import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { setResponse } from "@/lib/http";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const halaqohId = sp.get("halaqoh_id");
  const categoryId = sp.get("category_id");
  const status = sp.get("status");
  const all = sp.get("all");

  const where: Record<string, unknown> = {};

  if (halaqohId) where.halaqoh_id = Number(halaqohId);
  if (categoryId) where.halaqoh = { category_id: Number(categoryId) };
  if (status) where.status = status;

  const page = Number(sp.get("page") || "1");
  const limit = Number(sp.get("limit") || "20");

  const [data, total] = await Promise.all([
    prisma.halaqoh_participants.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        halaqoh: {
          select: {
            title: true,
            category: { select: { title: true } },
          },
        },
      },
      orderBy: { joined_at: "desc" },
      ...(all !== "true" ? { skip: (page - 1) * limit, take: limit } : {}),
    }),
    prisma.halaqoh_participants.count({ where }),
  ]);

  // Count by status
  const statusCounts = await prisma.halaqoh_participants.groupBy({
    by: ["status"],
    where,
    _count: { status: true },
  });

  const summary: Record<string, number> = {
    ACTIVE: 0,
    GRADUATED: 0,
    DROPPED: 0,
  };
  statusCounts.forEach((s) => {
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
    "Laporan peserta berhasil diambil",
  );
}
