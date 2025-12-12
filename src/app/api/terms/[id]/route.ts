// src/app/api/terms/[id]/route.ts
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { TermUpdateSchema } from "@/types/termSchema";
import { NextRequest } from "next/server";

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  name: true,
  slug: true,
  created_at: true,
  updated_at: true,
} as const;

// ====== GET /api/terms/[id] ======
export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const term = await prisma.neo_terms.findUnique({
      where: { id: Number(id) },
      select: SELECT_FIELDS,
    });

    if (!term) {
      throw new AppError("Term tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(term, "Detail Term");
  }
);

// ====== PUT /api/terms/[id] ======
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = TermUpdateSchema.parse(body);

    // Check if exists
    const exists = await prisma.neo_terms.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Term tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Build update data
    const data: Record<string, unknown> = {};
    if (parsed.name !== undefined) data.name = parsed.name;
    if (parsed.slug !== undefined) data.slug = parsed.slug;

    const updated = await prisma.neo_terms.update({
      where: { id: Number(id) },
      data,
      select: SELECT_FIELDS,
    });

    return setResponse(updated, "Term berhasil diupdate");
  }
);

// ====== DELETE /api/terms/[id] ======
export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const exists = await prisma.neo_terms.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Term tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const deleted = await prisma.neo_terms.delete({
      where: { id: Number(id) },
      select: { id: true, name: true, slug: true },
    });

    return setResponse(deleted, "Term berhasil dihapus");
  }
);
