CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on site_settings"
    ON site_settings FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow full access to authenticated admins on site_settings"
    ON site_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Seed defaults
INSERT INTO site_settings (key, value) VALUES
    ('hero_headline', 'This Season''s Finest Suits'),
    ('hero_subtext', 'Elevate your wardrobe with Rahim''s Collection.'),
    ('hero_image_url', ''),
    ('about_heading', 'About Rahim''s Collection'),
    ('about_body', 'Discover the artistry and heritage woven into every piece.'),
    ('about_image_url', ''),
    ('facebook_url', 'https://facebook.com/rahimscollection'),
    ('instagram_url', 'https://instagram.com/rahimscollection'),
    ('category_image_url_raw-silk', ''),
    ('category_image_url_chiffon', ''),
    ('category_image_url_organza', ''),
    ('category_image_url_georgette', ''),
    ('category_image_url_net', ''),
    ('category_image_url_velvet', '')
ON CONFLICT (key) DO NOTHING;
