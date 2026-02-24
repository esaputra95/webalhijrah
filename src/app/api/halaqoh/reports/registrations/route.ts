import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { setResponse } from "@/lib/http";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const startAt = sp.get("startAt");
  const endAt = sp.get("endAt");
  const categoryId = sp.get("category_id");
  const status = sp.get("status");
  const all = sp.get("all");

  const where: Record<string, unknown> = {};

  if (startAt && endAt) {
    where.created_at = {
      gte: new Date(startAt),
      lte: new Date(endAt + "T23:59:59"),
    };
  }
  if (categoryId) where.category_id = Number(categoryId);
  if (status) where.status = status;

  const page = Number(sp.get("page") || "1");
  const limit = Number(sp.get("limit") || "20");

  const [data, total] = await Promise.all([
    prisma.halaqoh_registrations.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        category: { select: { title: true } },
      },
      orderBy: { created_at: "desc" },
      ...(all !== "true" ? { skip: (page - 1) * limit, take: limit } : {}),
    }),
    prisma.halaqoh_registrations.count({ where }),
  ]);

  // Count by status
  const statusCounts = await prisma.halaqoh_registrations.groupBy({
    by: ["status"],
    where,
    _count: { status: true },
  });

  const summary: Record<string, number> = {
    PENDING: 0,
    TESTING: 0,
    ACCEPTED: 0,
    REJECTED: 0,
    COMPLETED: 0,
  };
  statusCounts.forEach((s) => {
    summary[s.status] = s._count.status;
  });

  // Average test score for accepted
  const avgScore = await prisma.halaqoh_registrations.aggregate({
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
    "Laporan registrasi berhasil diambil",
  );
}
