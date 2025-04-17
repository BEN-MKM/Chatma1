-- Création de la table payment_methods pour stocker les méthodes de paiement des utilisateurs
CREATE TABLE IF NOT EXISTS payment_methods (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_method_id text NOT NULL,
    provider text NOT NULL DEFAULT 'stripe',
    last_four text,
    card_type text,
    expiry_month integer,
    expiry_year integer,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, payment_method_id)
);

-- Création de la table transactions pour suivre toutes les transactions
CREATE TABLE IF NOT EXISTS transactions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    amount decimal NOT NULL,
    currency text NOT NULL DEFAULT 'eur',
    status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_intent_id text UNIQUE,
    payment_method_id uuid REFERENCES payment_methods(id),
    error_message text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    refunded_at timestamptz
);

-- Création de la table subscriptions pour gérer les abonnements
CREATE TABLE IF NOT EXISTS subscriptions (
    id text PRIMARY KEY, -- ID Stripe de l'abonnement
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    status text NOT NULL CHECK (status IN ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid')),
    price_id text NOT NULL,
    quantity integer DEFAULT 1,
    cancel_at_period_end boolean DEFAULT false,
    current_period_start timestamptz,
    current_period_end timestamptz,
    created_at timestamptz DEFAULT now(),
    canceled_at timestamptz,
    trial_start timestamptz,
    trial_end timestamptz
);

-- Création de la table products pour les produits d'abonnement
CREATE TABLE IF NOT EXISTS subscription_products (
    id text PRIMARY KEY, -- ID Stripe du produit
    name text NOT NULL,
    description text,
    active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Création de la table prices pour les prix des produits d'abonnement
CREATE TABLE IF NOT EXISTS subscription_prices (
    id text PRIMARY KEY, -- ID Stripe du prix
    product_id text REFERENCES subscription_products(id) ON DELETE CASCADE,
    active boolean DEFAULT true,
    currency text NOT NULL,
    type text NOT NULL CHECK (type IN ('one_time', 'recurring')),
    interval text CHECK (type != 'recurring' OR interval IN ('day', 'week', 'month', 'year')),
    interval_count integer,
    unit_amount integer,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subscription_products_updated_at
    BEFORE UPDATE ON subscription_products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subscription_prices_updated_at
    BEFORE UPDATE ON subscription_prices
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Fonction pour s'assurer qu'il n'y a qu'une seule méthode de paiement par défaut
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default THEN
        UPDATE payment_methods
        SET is_default = false
        WHERE user_id = NEW.user_id
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default_payment_method_trigger
    BEFORE INSERT OR UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_payment_method();
