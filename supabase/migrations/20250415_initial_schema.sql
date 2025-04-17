-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    is_seller BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Chats table
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT CHECK (type IN ('private', 'group')) NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Chat participants
CREATE TABLE chat_participants (
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (chat_id, user_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT,
    type TEXT CHECK (type IN ('text', 'image', 'audio', 'video', 'file')) NOT NULL,
    media_url TEXT,
    reply_to UUID REFERENCES messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    is_deleted BOOLEAN DEFAULT false
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',
    stock INTEGER DEFAULT 0,
    category TEXT NOT NULL,
    images TEXT[],
    status TEXT CHECK (status IN ('active', 'inactive', 'deleted')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Order items
CREATE TABLE order_items (
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

-- Posts table (for social feed)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[],
    type TEXT CHECK (type IN ('text', 'image', 'video')) NOT NULL,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Likes
CREATE TABLE likes (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (user_id, post_id)
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Repeat for other tables...

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;


-- Example RLS policies (adjust according to your needs)
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
-- Enable les extensions nécessaires
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Création de la table profiles
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    full_name text,
    avatar_url text,
    bio text,
    phone text,
    email text,
    website text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Création de la table notification_settings
create table if not exists public.notification_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade,
    settings jsonb default '{
        "messages": true,
        "messagePreview": true,
        "likes": true,
        "comments": true,
        "follows": true,
        "mentions": true,
        "newPosts": true,
        "productUpdates": true,
        "orderUpdates": true,
        "promotions": false,
        "newsletter": false,
        "sound": true,
        "vibration": true
    }'::jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- Création de la table device_settings
create table if not exists public.device_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade,
    settings jsonb default '{
        "autoUpdates": true,
        "backgroundSync": true,
        "dataUsage": true,
        "notifications": true
    }'::jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- Création de la table theme_settings
create table if not exists public.theme_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade,
    theme text default 'system' not null,
    color text default 'blue' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- Création de la table accessibility_settings
create table if not exists public.accessibility_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade,
    settings jsonb default '{
        "reduceMotion": false,
        "increaseContrast": false,
        "boldText": false,
        "reduceTransparency": false,
        "textSize": 1,
        "autoplay": true,
        "subtitles": false
    }'::jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- Création de la table language_settings
create table if not exists public.language_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade,
    language text default 'fr' not null,
    use_system_language boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- Création de la table privacy_settings
create table if not exists public.privacy_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade,
    settings jsonb default '{
        "profileVisibility": "public",
        "messagePrivacy": "everyone",
        "showOnlineStatus": true,
        "showLastSeen": true,
        "showReadReceipts": true,
        "showTypingIndicator": true
    }'::jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- Création de la table security_settings
create table if not exists public.security_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade,
    two_factor_enabled boolean default false not null,
    two_factor_secret text,
    backup_codes jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- Création de la table blocked_users
create table if not exists public.blocked_users (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade,
    blocked_user_id uuid references public.profiles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, blocked_user_id)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.notification_settings enable row level security;
alter table public.device_settings enable row level security;
alter table public.theme_settings enable row level security;
alter table public.accessibility_settings enable row level security;
alter table public.language_settings enable row level security;
alter table public.privacy_settings enable row level security;
alter table public.security_settings enable row level security;
alter table public.blocked_users enable row level security;

-- Policies pour profiles
create policy "Les utilisateurs peuvent voir tous les profils publics"
    on public.profiles for select
    using (true);

create policy "Les utilisateurs peuvent modifier leur propre profil"
    on public.profiles for update
    using (auth.uid() = id);

-- Policies pour les paramètres
create policy "Les utilisateurs peuvent voir leurs propres paramètres"
    on public.notification_settings for select
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs propres paramètres"
    on public.notification_settings for all
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent voir leurs propres paramètres"
    on public.device_settings for select
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs propres paramètres"
    on public.device_settings for all
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent voir leurs propres paramètres"
    on public.theme_settings for select
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs propres paramètres"
    on public.theme_settings for all
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent voir leurs propres paramètres"
    on public.accessibility_settings for select
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs propres paramètres"
    on public.accessibility_settings for all
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent voir leurs propres paramètres"
    on public.language_settings for select
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs propres paramètres"
    on public.language_settings for all
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent voir leurs propres paramètres"
    on public.privacy_settings for select
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs propres paramètres"
    on public.privacy_settings for all
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent voir leurs propres paramètres"
    on public.security_settings for select
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs propres paramètres"
    on public.security_settings for all
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent voir leurs utilisateurs bloqués"
    on public.blocked_users for select
    using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent gérer leurs utilisateurs bloqués"
    on public.blocked_users for all
    using (auth.uid() = user_id);

-- Triggers pour mettre à jour updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

create trigger handle_updated_at
    before update
    on public.profiles
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update
    on public.notification_settings
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update
    on public.device_settings
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update
    on public.theme_settings
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update
    on public.accessibility_settings
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update
    on public.language_settings
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update
    on public.privacy_settings
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update
    on public.security_settings
    for each row
    execute procedure public.handle_updated_at();
