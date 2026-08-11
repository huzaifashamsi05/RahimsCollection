export interface Review {
  id: string;
  author_name: string;
  content: string;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
}
