-- Ensure the product-images bucket is set to public so images can be served without signed URLs
UPDATE storage.buckets
SET public = true
WHERE id = 'product-images';
