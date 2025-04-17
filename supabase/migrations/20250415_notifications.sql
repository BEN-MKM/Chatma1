-- Création de la table device_tokens pour gérer les tokens des appareils
CREATE TABLE IF NOT EXISTS device_tokens (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    token text NOT NULL,
    platform text NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
    app_version text,
    created_at timestamptz DEFAULT now(),
    last_active timestamptz DEFAULT now(),
    UNIQUE(user_id, token)
);

-- Création de la table notifications pour stocker toutes les notifications
CREATE TABLE IF NOT EXISTS notifications (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('message', 'mention', 'like', 'comment', 'follow', 'product')),
    title text NOT NULL,
    body text NOT NULL,
    data jsonb DEFAULT '{}',
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    target_id text -- ID de la cible (message_id, post_id, etc.)
);

-- Création de la table message_status pour suivre l'état des messages
CREATE TABLE IF NOT EXISTS message_status (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    read boolean DEFAULT false,
    delivered boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(message_id, user_id)
);

-- Création de la table mentions pour gérer les mentions
CREATE TABLE IF NOT EXISTS mentions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
    mentioned_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(post_id, mentioned_user_id)
);

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_message_status_message_id ON message_status(message_id);
CREATE INDEX IF NOT EXISTS idx_message_status_user_id ON message_status(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON device_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_mentions_mentioned_user_id ON mentions(mentioned_user_id);

-- Fonction pour marquer automatiquement les messages comme délivrés
CREATE OR REPLACE FUNCTION mark_message_delivered()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO message_status (message_id, user_id, delivered)
    VALUES (NEW.id, NEW.recipient_id, true)
    ON CONFLICT (message_id, user_id) DO UPDATE
    SET delivered = true, updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour marquer automatiquement les messages comme délivrés
CREATE TRIGGER message_delivered_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION mark_message_delivered();

-- Fonction pour créer une notification lors d'une nouvelle mention
CREATE OR REPLACE FUNCTION create_mention_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        user_id,
        type,
        title,
        body,
        data,
        actor_id,
        target_id
    )
    VALUES (
        NEW.mentioned_user_id,
        'mention',
        'Nouvelle mention',
        'Quelqu''un vous a mentionné',
        jsonb_build_object(
            'mention_id', NEW.id,
            'post_id', NEW.post_id
        ),
        NEW.created_by,
        NEW.post_id::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer automatiquement une notification lors d'une mention
CREATE TRIGGER mention_notification_trigger
AFTER INSERT ON mentions
FOR EACH ROW
EXECUTE FUNCTION create_mention_notification();

-- Fonction pour nettoyer les vieux tokens
CREATE OR REPLACE FUNCTION cleanup_old_device_tokens()
RETURNS void AS $$
BEGIN
    -- Supprimer les tokens inactifs depuis plus de 30 jours
    DELETE FROM device_tokens
    WHERE last_active < now() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Créer un job pour nettoyer les vieux tokens quotidiennement
SELECT cron.schedule(
    'cleanup-old-device-tokens',
    '0 0 * * *', -- À minuit tous les jours
    'SELECT cleanup_old_device_tokens();'
);
