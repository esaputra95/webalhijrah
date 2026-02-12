import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohSchema } from "@/types/halaqohSchema";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const categoryId = sp.get("category_id");
  const mentorId = sp.get("mentor_id");

  const halaqohs = await prisma.halaqohs.findMany({
    where: {
      ...(categoryId ? { category_id: Number(categoryId) } : {}),
      ...(mentorId ? { mentor_id: Number(mentorId) } : {}),
    },
    include: {
      category: true,
      mentor: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return setResponse(halaqohs, "Data halaqoh berhasil diambil");
}

export const POST = wrap(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = HalaqohSchema.parse(body);

  const created = await prisma.halaqohs.create({
    data: {
      title: parsed.title,
      category_id: parsed.category_id,
      mentor_id: parsed.mentor_id,
      schedule_info: parsed.schedule_info,
      location_type: parsed.location_type,
      meeting_link: parsed.meeting_link,
      status: parsed.status,
    },
  });

  return setResponse(created, "Halaqoh berhasil dibuat", 201);
});
