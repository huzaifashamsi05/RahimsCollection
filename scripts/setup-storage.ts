import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function setupStorage() {
  console.log('Setting up product-images bucket...');
  
  // 1. Create bucket if it doesn't exist
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.error('Failed to list buckets:', bucketsError);
    return;
  }

  const bucketExists = buckets.some(b => b.name === 'product-images');
  
  if (!bucketExists) {
    console.log('Bucket "product-images" not found. Creating...');
    const { error: createError } = await supabase.storage.createBucket('product-images', {
      public: true, // MUST be public so images can be served to users
      fileSizeLimit: 5242880, // 5MB limit
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
    
    if (createError) {
      console.error('Failed to create bucket:', createError);
      return;
    }
    console.log('Bucket created successfully!');
  } else {
    console.log('Bucket "product-images" already exists. Ensuring it is public...');
    await supabase.storage.updateBucket('product-images', {
      public: true,
      fileSizeLimit: 5242880,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
  }

  console.log('Storage setup complete.');
}

setupStorage();
