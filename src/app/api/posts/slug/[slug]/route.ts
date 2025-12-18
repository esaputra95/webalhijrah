// src/app/api/posts/[id]/route.ts
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// ====== Select Fields ======
const SELECT_FIELDS = {
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
  users: {
    select: { id: true, name: true, email: true },
  },
} as const;

export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
    const { slug } = await ctx.params;

    const post = await prisma.neo_posts.findFirst({
      where: { post_name: slug },
      select: SELECT_FIELDS,
    });

    if (!post) {
      throw new AppError("Post tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(post, "Detail Post");
  }
);

// End of file
