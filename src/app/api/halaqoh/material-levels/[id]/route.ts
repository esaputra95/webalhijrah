import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohMaterialLevelSchema } from "@/types/halaqohSchema";

export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const level = await prisma.halaqoh_material_levels.findUnique({
      where: { id: Number(id) },
      include: {
        category: { select: { id: true, title: true } },
      },
    });

    if (!level) {
      throw new AppError("Tingkatan materi tidak ditemukan", { status: 404 });
    }

    return setResponse(level, "Detail tingkatan materi");
  },
);

export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = HalaqohMaterialLevelSchema.partial().parse(body);

    const { id: _, ...data } = parsed;

    const updated = await prisma.halaqoh_material_levels.update({
      where: { id: Number(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    return setResponse(updated, "Tingkatan materi berhasil diperbarui");
  },
);

export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    // Check if any class is using this level
    const classCount = await prisma.halaqohs.count({
      where: { material_level_id: Number(id) },
    });

    if (classCount > 0) {
      throw new AppError(
        `Tidak bisa dihapus, masih ada ${classCount} kelas yang menggunakan tingkatan ini`,
        { status: 400 },
      );
    }

    await prisma.halaqoh_material_levels.delete({
      where: { id: Number(id) },
    });

    return setResponse(null, "Tingkatan materi berhasil dihapus");
  },
);
