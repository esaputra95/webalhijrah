import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { SliderCreateSchema } from "@/types/masters/silderSchema";
import { NextRequest } from "next/server";

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  image: true,
  type: true,
  description: true,
  user_id: true,
  created_at: true,
  updated_at: true,
} as const;

// ====== GET /api/sliders/[id] ======
export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const slider = await prisma.sliders.findUnique({
      where: { id: Number(id) },
      select: SELECT_FIELDS,
    });

    if (!slider) {
      throw new AppError("Slider tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(slider, "Detail Slider");
  }
);

// ====== PUT /api/sliders/[id] ======
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = SliderCreateSchema.partial().parse(body);

    // Check if exists
    const exists = await prisma.sliders.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Slider tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Build update data
    const data: Record<string, unknown> = {};
    if (parsed.image !== undefined) data.image = parsed.image;
    if (parsed.type !== undefined) data.type = parsed.type;
    if (parsed.description !== undefined) data.description = parsed.description;
    if (parsed.user_id !== undefined) data.user_id = parsed.user_id;

    const updated = await prisma.sliders.update({
      where: { id: Number(id) },
      data,
      select: SELECT_FIELDS,
    });

    return setResponse(updated, "Slider berhasil diupdate");
  }
);

// ====== DELETE /api/sliders/[id] ======
export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const exists = await prisma.sliders.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Slider tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const deleted = await prisma.sliders.delete({
      where: { id: Number(id) },
      select: { id: true, type: true, description: true },
    });

    return setResponse(deleted, "Slider berhasil dihapus");
  }
);
