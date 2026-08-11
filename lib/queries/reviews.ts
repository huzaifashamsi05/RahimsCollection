import { createClient } from "@/lib/supabase/server";
import { Review } from "@/types/review";

export async function getReviews(publishedOnly: boolean = false): Promise<Review[]> {
  const supabase = await createClient();
  let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
  
  if (publishedOnly) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  
  if (error || !data) {
    console.error("Error fetching reviews:", error);
    return [];
  }
  return data as Review[];
}
