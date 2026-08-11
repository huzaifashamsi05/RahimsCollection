'use server';

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Return a generic error to prevent email enumeration or brute force hints
    return { error: 'Invalid email or password.' };
  }

  // Redirect to admin dashboard on success
  redirect('/admin');
}

export async function adminLogout() {
  const supabase = await createClient();
  
  await supabase.auth.signOut();
  
  // Revalidate admin paths and redirect
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
