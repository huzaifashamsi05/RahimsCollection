-- Enable RLS on storage.objects (usually enabled by default in Supabase, but good to be sure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on objects" ON storage.objects;

-- Create policies for authenticated admins to upload, update, and delete images
CREATE POLICY "Allow authenticated users to upload" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK ( bucket_id = 'product-images' );

CREATE POLICY "Allow authenticated users to update" 
ON storage.objects FOR UPDATE TO authenticated 
USING ( bucket_id = 'product-images' );

CREATE POLICY "Allow authenticated users to delete" 
ON storage.objects FOR DELETE TO authenticated 
USING ( bucket_id = 'product-images' );

-- Ensure everyone can view the images
CREATE POLICY "Allow public read access on objects"
ON storage.objects FOR SELECT TO public
USING ( bucket_id = 'product-images' );
