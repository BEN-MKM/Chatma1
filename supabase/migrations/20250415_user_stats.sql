-- Create user_stats table
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    publications INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    followings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view any user_stats"
    ON user_stats FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own stats"
    ON user_stats FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create trigger to automatically create stats entry when a new profile is created
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_stats (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_user_stats();
