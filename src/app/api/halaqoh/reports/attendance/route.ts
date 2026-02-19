import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { setResponse } from "@/lib/http";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const startAt = sp.get("startAt");
  const endAt = sp.get("endAt");
  const halaqohId = sp.get("halaqoh_id");
  const categoryId = sp.get("category_id");
  const status = sp.get("status");
  const all = sp.get("all");

  const where: Record<string, unknown> = {};

  if (startAt && endAt) {
    where.date = { gte: new Date(startAt), lte: new Date(endAt) };
  }
  if (halaqohId) where.halaqoh_id = Number(halaqohId);
  if (categoryId) where.halaqoh = { category_id: Number(categoryId) };
  if (status) where.status = status;

  const page = Number(sp.get("page") || "1");
  const limit = Number(sp.get("limit") || "20");

  const [data, total] = await Promise.all([
    prisma.halaqoh_attendance.findMany({
      where,
      include: {
        user: { select: { name: true } },
        halaqoh: {
          select: {
            title: true,
            category: { select: { title: true } },
          },
        },
      },
      orderBy: { date: "desc" },
      ...(all !== "true" ? { skip: (page - 1) * limit, take: limit } : {}),
    }),
    prisma.halaqoh_attendance.count({ where }),
  ]);

  // Compute summary
  const allForSummary = await prisma.halaqoh_attendance.groupBy({
    by: ["status"],
    where,
    _count: { status: true },
  });

  const summary: Record<string, number> = {
    HADIR: 0,
    IZIN: 0,
    SAKIT: 0,
    ALPA: 0,
  };
  allForSummary.forEach((s) => {
    summary[s.status] = s._count.status;
  });

  return setResponse(
    {
      data,
      metaData: {
        total,
        totalPage: Math.ceil(total / limit),
        summary,
      },
    },
    "Laporan kehadiran berhasil diambil",
  );
}
