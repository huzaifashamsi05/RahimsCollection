import { createClient } from '../supabase/server';

export async function getSettings(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error || !data) return {};

  const settings: Record<string, string> = {};
  for (const row of data) {
    settings[row.key] = row.value || '';
  }

  return settings;
}
