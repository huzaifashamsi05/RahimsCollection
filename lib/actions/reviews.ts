"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveReview(payload: {
  id?: string;
  author_name: string;
  content: string;
  image_url: string | null;
  is_published: boolean;
}) {
  const supabase = await createClient();
  const { id, ...data } = payload;

  if (id) {
    const { error } = await supabase.from("reviews").update(data).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("reviews").insert(data);
    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  
  if (error) return { error: error.message };
  
  revalidatePath("/", "layout");
  return { success: true };
}
