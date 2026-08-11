-- 1. Add scarcity_label to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS scarcity_label TEXT;

-- 2. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS policies for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on published reviews"
    ON reviews FOR SELECT
    TO public
    USING (is_published = true);

CREATE POLICY "Allow full access to authenticated admins on reviews"
    ON reviews FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
