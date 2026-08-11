-- =======================================================================================
-- Schema for Rahim's Collection
-- =======================================================================================

-- Enable the uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------------------
-- 1. Products
-- ---------------------------------------------------------------------------------------
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  category TEXT NOT NULL,
  stock_type TEXT NOT NULL CHECK (stock_type IN ('ready', 'made-to-order')),
  piece_count INTEGER NOT NULL CHECK (piece_count IN (2, 3)),
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_featured_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_sold_out BOOLEAN NOT NULL DEFAULT false,
  restockable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------------------------------------
-- 2. Product Colors
-- ---------------------------------------------------------------------------------------
CREATE TABLE product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hex TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Note: We rely on application logic to ensure exactly one color per product has is_default = true.

-- ---------------------------------------------------------------------------------------
-- 3. Product Color Images
-- ---------------------------------------------------------------------------------------
CREATE TABLE product_color_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_color_id UUID NOT NULL REFERENCES product_colors(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------------------
-- 4. Product Sizes
-- ---------------------------------------------------------------------------------------
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------------------
-- 5. Bulk Inquiries
-- ---------------------------------------------------------------------------------------
CREATE TABLE bulk_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  contact TEXT NOT NULL,
  quantity_range TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =======================================================================================
-- Row Level Security (RLS)
-- =======================================================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_color_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_inquiries ENABLE ROW LEVEL SECURITY;

-- Products and related tables: Public Read, Admin Write
-- (Admin write is implicitly allowed for Service Role / super users, 
--  but we can add an explicit policy if a specific auth role is used later.
--  For now, anon can SELECT only.)
CREATE POLICY "Allow public read-only access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to product_colors" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to product_color_images" ON product_color_images FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to product_sizes" ON product_sizes FOR SELECT USING (true);

-- Bulk Inquiries: Public Insert, Admin Select/Update/Delete
CREATE POLICY "Allow public insert to bulk_inquiries" ON bulk_inquiries FOR INSERT WITH CHECK (true);
-- Note: SELECT on bulk_inquiries is restricted by default since there's no SELECT policy for public.
