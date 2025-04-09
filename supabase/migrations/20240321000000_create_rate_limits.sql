-- Create a table to track recipe generation attempts
CREATE TABLE IF NOT EXISTS recipe_generation_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index for faster lookups
CREATE INDEX idx_recipe_generation_attempts_ip_created ON recipe_generation_attempts(ip_address, created_at);

-- Create a function to check if a user/IP has exceeded the limit
CREATE OR REPLACE FUNCTION check_recipe_generation_limit(ip TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    attempt_count INTEGER;
    is_authenticated BOOLEAN;
BEGIN
    -- Check if the request has an authenticated user
    is_authenticated := (SELECT auth.uid() IS NOT NULL);
    
    -- If authenticated, no limit
    IF is_authenticated THEN
        RETURN TRUE;
    END IF;
    
    -- Count attempts in the last 7 days
    SELECT COUNT(*)
    INTO attempt_count
    FROM recipe_generation_attempts
    WHERE ip_address = ip
    AND created_at > NOW() - INTERVAL '7 days';
    
    -- Return TRUE if under limit (5 attempts per week), FALSE otherwise
    RETURN attempt_count < 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to record an attempt
CREATE OR REPLACE FUNCTION record_recipe_generation_attempt(ip TEXT)
RETURNS VOID AS $$
BEGIN
    -- Only record if not authenticated
    IF auth.uid() IS NULL THEN
        INSERT INTO recipe_generation_attempts (ip_address)
        VALUES (ip);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE recipe_generation_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow insert for all" ON recipe_generation_attempts
    FOR INSERT TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Allow select for all" ON recipe_generation_attempts
    FOR SELECT TO authenticated, anon
    USING (true); 