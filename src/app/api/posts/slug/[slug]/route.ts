// src/app/api/posts/slug/[slug]/route.ts
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { postService } from "@/lib/postService";
import { NextRequest } from "next/server";

export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
    const { slug } = await ctx.params;

    const post = await postService.getPostBySlug(slug);

    if (!post) {
      throw new AppError("Post tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(post, "Detail Post");
  },
);

// End of file
