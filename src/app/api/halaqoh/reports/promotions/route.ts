import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { setResponse } from "@/lib/http";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const startAt = sp.get("startAt");
  const endAt = sp.get("endAt");
  const categoryId = sp.get("category_id");
  const type = sp.get("type");
  const all = sp.get("all");

  const where: Record<string, unknown> = {};

  if (startAt && endAt) {
    where.promoted_at = {
      gte: new Date(startAt),
      lte: new Date(endAt + "T23:59:59"),
    };
  }
  if (categoryId) where.category_id = Number(categoryId);
  if (type) where.type = type;

  const page = Number(sp.get("page") || "1");
  const limit = Number(sp.get("limit") || "20");

  const [data, total] = await Promise.all([
    prisma.halaqoh_promotions.findMany({
      where,
      include: {
        user: { select: { name: true } },
        admin: { select: { name: true } },
        category: { select: { title: true } },
        from_halaqoh: { select: { title: true } },
        to_halaqoh: { select: { title: true } },
        from_level: { select: { title: true } },
        to_level: { select: { title: true } },
      },
      orderBy: { promoted_at: "desc" },
      ...(all !== "true" ? { skip: (page - 1) * limit, take: limit } : {}),
    }),
    prisma.halaqoh_promotions.count({ where }),
  ]);

  // Count by type
  const typeCounts = await prisma.halaqoh_promotions.groupBy({
    by: ["type"],
    where,
    _count: { type: true },
  });

  const summary: Record<string, number> = {
    PROMOTION: 0,
    DEMOTION: 0,
    INITIAL_PLACEMENT: 0,
  };
  typeCounts.forEach((t) => {
    summary[t.type] = t._count.type;
  });

  // Average test score
  const avgScore = await prisma.halaqoh_promotions.aggregate({
    where: { ...where, test_score: { not: null } },
    _avg: { test_score: true },
  });

  return setResponse(
    {
      data,
      metaData: {
        total,
        totalPage: Math.ceil(total / limit),
        summary,
        avgTestScore: avgScore._avg.test_score || 0,
      },
    },
    "Laporan kenaikan level berhasil diambil",
  );
}
