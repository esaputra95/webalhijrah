// src/app/api/posts/[id]/route.ts
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { PostUpdateSchema } from "@/types/postSchema";
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
  code: true,
  account: true,
  users: {
    select: { id: true, name: true, email: true },
  },
} as const;

// ====== GET /api/posts/[id] ======
export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const post = await prisma.neo_posts.findUnique({
      where: { id: Number(id) },
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

// ====== PUT /api/posts/[id] ======
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = PostUpdateSchema.parse(body);

    // Check if exists
    const exists = await prisma.neo_posts.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Post tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Build update data
    const data: Record<string, unknown> = {};
    if (parsed.post_title !== undefined) data.post_title = parsed.post_title;
    if (parsed.post_excerpt !== undefined)
      data.post_excerpt = parsed.post_excerpt;
    if (parsed.post_name !== undefined) data.post_name = parsed.post_name;
    if (parsed.post_content !== undefined)
      data.post_content = parsed.post_content;
    if (parsed.post_status !== undefined) data.post_status = parsed.post_status;
    if (parsed.post_type !== undefined) data.post_type = parsed.post_type;
    if (parsed.post_mime_type !== undefined)
      data.post_mime_type = parsed.post_mime_type;
    if (parsed.user_id !== undefined) data.user_id = parsed.user_id;
    if (parsed.post_category_id !== undefined)
      data.post_category_id = parsed.post_category_id;
    if (parsed.date !== undefined)
      data.date = parsed.date ? new Date(parsed.date) : null;
    if (parsed.post_image !== undefined) data.post_image = parsed.post_image;
    if (parsed.account !== undefined) data.account = parsed.account;

    const updated = await prisma.neo_posts.update({
      where: { id: Number(id) },
      data,
      select: SELECT_FIELDS,
    });

    return setResponse(updated, "Post berhasil diupdate");
  }
);

// ====== DELETE /api/posts/[id] ======
export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const exists = await prisma.neo_posts.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Post tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const deleted = await prisma.neo_posts.delete({
      where: { id: Number(id) },
      select: { id: true, post_title: true, post_name: true },
    });

    return setResponse(deleted, "Post berhasil dihapus");
  }
);
