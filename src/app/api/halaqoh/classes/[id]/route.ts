import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohSchema } from "@/types/halaqohSchema";

export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const halaqoh = await prisma.halaqohs.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        mentor: {
          include: {
            user: { select: { name: true } },
          },
        },
        material_level: true,
      },
    });

    if (!halaqoh) {
      throw new AppError("Halaqoh tidak ditemukan", { status: 404 });
    }

    return setResponse(halaqoh, "Detail halaqoh");
  },
);

export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = HalaqohSchema.parse(body);

    const updated = await prisma.halaqohs.update({
      where: { id: Number(id) },
      data: {
        title: parsed.title,
        category_id: parsed.category_id,
        mentor_id: parsed.mentor_id,
        material_level_id: parsed.material_level_id || null,
        schedule_info: parsed.schedule_info,
        location_type: parsed.location_type,
        meeting_link: parsed.meeting_link,
        status: parsed.status,
      },
    });

    return setResponse(updated, "Halaqoh berhasil diperbarui");
  },
);

export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    // Check if there are active participants
    const activeParticipants = await prisma.halaqoh_participants.count({
      where: {
        halaqoh_id: Number(id),
        status: "ACTIVE",
      },
    });

    if (activeParticipants > 0) {
      throw new AppError(
        `Tidak bisa dihapus, masih ada ${activeParticipants} peserta aktif di kelas ini`,
        { status: 400 },
      );
    }

    await prisma.halaqohs.delete({
      where: { id: Number(id) },
    });

    return setResponse(null, "Halaqoh berhasil dihapus");
  },
);
