import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { PostCategoryCreateSchema } from "@/types/postCategorySchema";
import { NextRequest } from "next/server";

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  title: true,
  description: true,
  user_id: true,
  created_at: true,
  updated_at: true,
  users: {
    select: { id: true, name: true, email: true },
  },
} as const;

// ====== GET /api/post-categories/[id] ======
export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const category = await prisma.neo_post_categories.findUnique({
      where: { id: Number(id) },
      select: SELECT_FIELDS,
    });

    if (!category) {
      throw new AppError("Post Category tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(category, "Detail Post Category");
  }
);

// ====== PUT /api/post-categories/[id] ======
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    // Use partial schema for update if we want allow partial updates, but currently we reuse create schema + z.literal().optional() or just partial logic
    // But let's use CreateSchema for simplicity and allow partial update manually
    const parsed = PostCategoryCreateSchema.partial().parse(body);

    // Check if exists
    const exists = await prisma.neo_post_categories.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Post Category tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Build update data
    const data: Record<string, unknown> = {};
    if (parsed.title !== undefined) data.title = parsed.title;
    if (parsed.description !== undefined) data.description = parsed.description;
    if (parsed.user_id !== undefined) data.user_id = parsed.user_id;
    if (parsed.type !== undefined) data.type = parsed.type;

    const updated = await prisma.neo_post_categories.update({
      where: { id: Number(id) },
      data,
      select: SELECT_FIELDS,
    });

    return setResponse(updated, "Post Category berhasil diupdate");
  }
);

// ====== DELETE /api/post-categories/[id] ======
export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const exists = await prisma.neo_post_categories.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Post Category tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const deleted = await prisma.neo_post_categories.delete({
      where: { id: Number(id) },
      select: { id: true, title: true },
    });

    return setResponse(deleted, "Post Category berhasil dihapus");
  }
);
