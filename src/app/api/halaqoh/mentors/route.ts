import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohMentorSchema } from "@/types/halaqohSchema";

export async function GET() {
  const mentors = await prisma.halaqoh_mentors.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  return setResponse(mentors, "Data pembimbing berhasil diambil");
}

export const POST = wrap(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = HalaqohMentorSchema.parse(body);

  const created = await prisma.halaqoh_mentors.create({
    data: {
      user_id: parsed.user_id,
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

  return setResponse(created, "Pembimbing berhasil ditambahkan", 201);
});
