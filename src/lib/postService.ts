import { prisma } from "./prisma";
import { Post } from "@/types/admins/articles/postType";

export const postService = {
  /**
   * Get post by slug (post_name) with categories
   */
  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const existing = await prisma.neo_posts.findFirst({
        where: { post_name: slug },
        select: { id: true, count_view: true },
      });

      if (!existing) return null;

      const post = await prisma.neo_posts.update({
        where: { id: existing.id },
        data: {
          count_view: existing.count_view === null ? 1 : { increment: 1 },
        },
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
          count_view: true,
          post_categories: {
            select: {
              id: true,
              title: true,
            },
          },
          program_categories: {
            select: {
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
        program: post.program_categories
          ? { ...post.program_categories }
          : undefined,
        created_at: post.created_at?.toISOString() || new Date().toISOString(),
        updated_at: post.updated_at?.toISOString() || new Date().toISOString(),
      } as Post;
    } catch (error) {
      console.error("Error in PostService.getPostBySlug:", error);
      return null;
    }
  },

  /**
   * Get latest post by type
   */
  async getLatestPostByType(type: string): Promise<Post | null> {
    try {
      const post = await prisma.neo_posts.findFirst({
        where: {
          post_type: type,
          post_status: "publish",
        },
        orderBy: {
          created_at: "desc",
        },
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
          count_view: true,
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
      console.error("Error in PostService.getLatestPostByType:", error);
      return null;
    }
  },

  /**
   * Get suggested posts
   */
  async getSuggestions(limit: number = 6, excludeId?: string): Promise<Post[]> {
    try {
      const posts = await prisma.neo_posts.findMany({
        where: {
          post_type: "post",
          post_status: "publish",
          id: excludeId ? { not: Number(excludeId) } : undefined,
        },
        orderBy: {
          created_at: "desc",
        },
        take: limit,
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
          count_view: true,
          post_categories: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return posts.map((post) => ({
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
      })) as Post[];
    } catch (error) {
      console.error("Error in PostService.getSuggestions:", error);
      return [];
    }
  },
};
