import { prisma } from "./prisma";
import { Post } from "@/types/admins/articles/postType";

export const postService = {
  /**
   * Get post by slug (post_name) with categories
   */
  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const post = await prisma.neo_posts.findFirst({
        where: { post_name: slug },
        select: {
          id: true,
          post_title: true,
          post_excerpt: true,
          post_name: true,
          post_content: true,
          post_status: true,
          post_type: true,
          post_mime_type: true,
          user_id: true,
          post_category_id: true,
          created_at: true,
          updated_at: true,
          date: true,
          post_image: true,
          account: true,
          code: true,
          post_categories: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!post) return null;

      // Transform Prisma response to Post type
      return {
        ...post,
        id: String(post.id),
        post_excerpt: post.post_excerpt || undefined,
        post_image: post.post_image || undefined,
        account: post.account || undefined,
        code: post.code || undefined,
        date: post.date || new Date(),
        post_categories: post.post_categories
          ? {
              ...post.post_categories,
              id: String(post.post_categories.id),
            }
          : undefined,
        created_at: post.created_at?.toISOString() || new Date().toISOString(),
        updated_at: post.updated_at?.toISOString() || new Date().toISOString(),
      } as Post;
    } catch (error) {
      console.error("Error in PostService.getPostBySlug:", error);
      return null;
    }
  },
};
