import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohCategorySchema } from "@/types/halaqohSchema";

export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const category = await prisma.halaqoh_categories.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      throw new AppError("Kategori tidak ditemukan", { status: 404 });
    }

    return setResponse(category, "Detail kategori halaqoh");
  },
);

export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    console.log(`PUT /api/halaqoh/categories/${id} - Body:`, body);

    // Apply the same schema with partial for updates
    const parsed = HalaqohCategorySchema.partial().parse(body);

    const { id: _, ...data } = parsed;

    const updated = await prisma.halaqoh_categories.update({
      where: { id: Number(id) },
      data,
    });

    return setResponse(updated, "Kategori halaqoh berhasil diperbarui");
  },
);

export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    await prisma.halaqoh_categories.delete({
      where: { id: Number(id) },
    });

    return setResponse(null, "Kategori halaqoh berhasil dihapus");
  },
);
