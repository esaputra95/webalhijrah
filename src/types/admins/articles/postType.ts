export interface Post {
  id: string;
  post_title: string;
  post_name: string;
  post_content: string;
  post_excerpt?: string;
  post_image?: string;
  code?: string;
  account?: number;
  date: Date;
  category?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}
