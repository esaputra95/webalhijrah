import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohMentorSchema } from "@/types/halaqohSchema";

export const GET = wrap(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id: idParam } = await params;
    const mentor = await prisma.halaqoh_mentors.findUnique({
      where: { id: Number(idParam) },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!mentor) return setResponse(null, "Pembimbing tidak ditemukan", 404);
    return setResponse(mentor, "Data pembimbing berhasil diambil");
  },
);

export const PUT = wrap(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id: idParam } = await params;
    const body = await req.json();
    const parsed = HalaqohMentorSchema.parse(body);

    const updated = await prisma.halaqoh_mentors.update({
      where: { id: Number(idParam) },
      data: {
        bio: parsed.bio,
        specialization: parsed.specialization,
        is_active: parsed.is_active,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return setResponse(updated, "Pembimbing berhasil diperbarui");
  },
);

export const DELETE = wrap(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id: idParam } = await params;
    const id = Number(idParam);

    const mentor = await prisma.halaqoh_mentors.findUnique({
      where: { id },
      select: { user_id: true },
    });

    if (!mentor) return setResponse(null, "Pembimbing tidak ditemukan", 404);

    await prisma.halaqoh_mentors.delete({
      where: { id },
    });

    // Revert role to USER if no longer a mentor in any capacity (safety check)
    const otherMentorRoles = await prisma.halaqoh_mentors.count({
      where: { user_id: mentor.user_id },
    });

    if (otherMentorRoles === 0) {
      const user = await prisma.users.findUnique({
        where: { id: mentor.user_id },
        select: { role: true },
      });

      // Only revert if the role is currently 'mentor' (lowercase or uppercase check)
      if (user?.role?.toUpperCase() === "MENTOR") {
        await prisma.users.update({
          where: { id: mentor.user_id },
          data: { role: "USER" },
        });
      }
    }

    return setResponse(null, "Pembimbing berhasil dihapus");
  },
);
