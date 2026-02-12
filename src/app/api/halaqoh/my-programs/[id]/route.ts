import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap, AppError } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { auth } from "@/auth";

export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;
    const { id } = await ctx.params;

    if (!userId) {
      throw new AppError("Anda harus login terlebih dahulu", { status: 401 });
    }

    const participation = await prisma.halaqoh_participants.findUnique({
      where: {
        id: Number(id),
        user_id: userId,
      },
      include: {
        halaqoh: {
          include: {
            category: true,
            mentor: {
              include: {
                user: { select: { name: true, email: true } },
              },
            },
          },
        },
      },
    });

    if (!participation) {
      throw new AppError("Data partisipasi tidak ditemukan", { status: 404 });
    }

    // Fetch classmates (other participants in the same halaqoh)
    const classmates = await prisma.halaqoh_participants.findMany({
      where: {
        halaqoh_id: participation.halaqoh_id,
        user_id: { not: userId },
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { user: { name: "asc" } },
    });

    // Fetch attendance
    const attendance = await prisma.halaqoh_attendance.findMany({
      where: {
        halaqoh_id: participation.halaqoh_id,
        user_id: userId,
      },
      orderBy: { date: "desc" },
    });

    return setResponse(
      {
        ...participation,
        classmates,
        attendance,
      },
      "Detail partisipasi berhasil diambil",
    );
  },
);
