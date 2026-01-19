export interface Post {
  id: string;
  post_title: string;
  post_name: string;
  post_content: string;
  post_excerpt?: string;
  post_image?: string;
  post_type?: string;
  post_status?: string;
  code?: string;
  account?: number;
  date: Date;
  post_category_id?: number;
  post_categories?: {
    id: string;
    title: string;
  };
  program?: {
    id?: string;
    title?: string;
  };
  program_categories?: {
    id?: string;
    title?: string;
  };
  count_view?: number;
  created_at: string;
  updated_at: string;
}
