'use server';

import { createClient } from '../supabase/server';

export async function submitBulkInquiry(formData: FormData) {
  const name = formData.get('name') as string;
  const country = formData.get('country') as string;
  const contact = formData.get('contact') as string;
  const quantityRange = formData.get('quantity') as string;
  const message = formData.get('message') as string;

  if (!name || !country || !contact || !quantityRange) {
    return { error: 'Please fill in all required fields.' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('bulk_inquiries')
    .insert({
      name,
      country,
      contact,
      quantity_range: quantityRange,
      message: message || null
    });

  if (error) {
    console.error('Error inserting bulk inquiry:', error);
    return { error: 'Something went wrong while submitting your inquiry. Please try again.' };
  }

  return { success: true };
}
