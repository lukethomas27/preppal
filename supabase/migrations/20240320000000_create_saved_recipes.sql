-- Create saved_recipes table
CREATE TABLE IF NOT EXISTS saved_recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    cooking_time INTEGER,
    difficulty TEXT,
    servings INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own saved recipes
CREATE POLICY "Users can view their own saved recipes"
    ON saved_recipes
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy to allow users to insert their own saved recipes
CREATE POLICY "Users can insert their own saved recipes"
    ON saved_recipes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own saved recipes
CREATE POLICY "Users can update their own saved recipes"
    ON saved_recipes
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy to allow users to delete their own saved recipes
CREATE POLICY "Users can delete their own saved recipes"
    ON saved_recipes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_saved_recipes_updated_at
    BEFORE UPDATE ON saved_recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 