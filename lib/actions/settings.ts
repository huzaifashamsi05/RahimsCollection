'use server';

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return supabase;
}

export async function saveSettings(settings: Record<string, string>) {
  const supabase = await requireAdmin();

  const entries = Object.entries(settings);
  if (entries.length === 0) return { success: true };

  // Supabase upsert requires an array of objects
  const payload = entries.map(([key, value]) => ({ key, value }));

  const { error } = await supabase
    .from('site_settings')
    .upsert(payload, { onConflict: 'key' });

  if (error) {
    return { error: error.message };
  }

  // Revalidate entire site to ensure global elements like Navbar/Footer update
  revalidatePath('/', 'layout');

  return { success: true };
}
