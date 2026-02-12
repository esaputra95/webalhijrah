import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohAttendanceSchema } from "@/types/halaqohSchema";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const halaqohId = sp.get("halaqoh_id");
  const date = sp.get("date");

  const attendance = await prisma.halaqoh_attendance.findMany({
    where: {
      ...(halaqohId ? { halaqoh_id: Number(halaqohId) } : {}),
      ...(date ? { date: new Date(date) } : {}),
    },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });

  return setResponse(attendance, "Data absensi berhasil diambil");
}

export const POST = wrap(async (req: NextRequest) => {
  const body = await req.json();

  if (Array.isArray(body)) {
    // Bulk create/update
    const results = await prisma.$transaction(
      body.map((item) => {
        const parsed = HalaqohAttendanceSchema.parse(item);
        return prisma.halaqoh_attendance.upsert({
          where: {
            halaqoh_id_user_id_date: {
              halaqoh_id: parsed.halaqoh_id,
              user_id: parsed.user_id,
              date: parsed.date,
            },
          },
          update: {
            status: parsed.status,
            notes: parsed.notes,
          },
          create: {
            halaqoh_id: parsed.halaqoh_id,
            user_id: parsed.user_id,
            date: parsed.date,
            status: parsed.status,
            notes: parsed.notes,
          },
        });
      }),
    );
    return setResponse(results, "Data absensi berhasil disimpan", 201);
  }

  const parsed = HalaqohAttendanceSchema.parse(body);
  const created = await prisma.halaqoh_attendance.create({
    data: {
      halaqoh_id: parsed.halaqoh_id,
      user_id: parsed.user_id,
      date: parsed.date,
      status: parsed.status,
      notes: parsed.notes,
    },
  });

  return setResponse(created, "Absensi berhasil dicatat", 201);
});
