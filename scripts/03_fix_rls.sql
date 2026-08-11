-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_color_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow full access to authenticated users on products" ON products;
DROP POLICY IF EXISTS "Allow full access to authenticated users on product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Allow full access to authenticated users on product_colors" ON product_colors;
DROP POLICY IF EXISTS "Allow full access to authenticated users on product_color_images" ON product_color_images;

-- Create policies for authenticated admins to have full access
CREATE POLICY "Allow full access to authenticated users on products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on product_sizes" ON product_sizes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on product_colors" ON product_colors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on product_color_images" ON product_color_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Ensure public read access remains
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
DROP POLICY IF EXISTS "Allow public read access on product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Allow public read access on product_colors" ON product_colors;
DROP POLICY IF EXISTS "Allow public read access on product_color_images" ON product_color_images;

CREATE POLICY "Allow public read access on products" ON products FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on product_sizes" ON product_sizes FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on product_colors" ON product_colors FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on product_color_images" ON product_color_images FOR SELECT TO public USING (true);
