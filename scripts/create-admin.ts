import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

// We need the service_role key to bypass RLS and use the Admin API
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log('Creating admin user...');
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@rahimscollection.com',
    password: 'Ra00Co',
    email_confirm: true // auto-confirm email so we can login immediately
  });

  if (error) {
    if (error.message.includes('already been registered')) {
      console.log('Admin user already exists!');
    } else {
      console.error('Error creating user:', error);
    }
  } else {
    console.log('Successfully created admin user:', data.user.email);
  }
}

createAdminUser();
