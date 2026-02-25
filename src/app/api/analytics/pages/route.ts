import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ALLOWED_SORT: Record<string, Prisma.Sql> = {
  totalViews: Prisma.sql`totalViews`,
  uniqueVisitors: Prisma.sql`uniqueVisitors`,
  lastVisit: Prisma.sql`lastVisit`,
  route_key: Prisma.sql`route_key`,
  path: Prisma.sql`path`,
};

type AggregatedPageRow = {
  route_key: string;
  path: string;
  totalViews: bigint | number;
  uniqueVisitors: bigint | number;
  uniqueIps: bigint | number;
  latestIp: string | null;
  lastVisit: Date | string;
};

type SummaryRow = {
  totalViews: bigint | number;
  uniqueVisitors: bigint | number;
  uniqueIps: bigint | number;
  totalPages: bigint | number;
};

type TrendRow = {
  day: Date | string;
  totalViews: bigint | number;
  uniqueVisitors: bigint | number;
};

const toNumber = (value: bigint | number | null | undefined) =>
  Number(value ?? 0);

function parseDateRange(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const startAt = sp.get("startAt");
  const endAt = sp.get("endAt");

  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const startDate = startAt ? new Date(`${startAt}T00:00:00`) : defaultStart;
  const endDate = endAt ? new Date(`${endAt}T23:59:59.999`) : now;

  return { startDate, endDate };
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const allowedRoles = ["ADMIN", "ADMIN_TAKMIR", "ADMIN_KESANTRIAN"];
    if (!allowedRoles.includes(String(session?.user?.role || "").toUpperCase())) {
      return NextResponse.json(
        { status: false, message: "Tidak punya akses" },
        { status: 403 },
      );
    }

    const sp = req.nextUrl.searchParams;
    const page = Math.max(parseInt(sp.get("page") || "1", 10), 1);
    const limit = Math.min(100, Math.max(parseInt(sp.get("limit") || "10", 10), 1));
    const skip = (page - 1) * limit;
    const q = (sp.get("q") || "").trim();
    const sortby = sp.get("sortby") || "totalViews";
    const sort = (sp.get("sort") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    const { startDate, endDate } = parseDateRange(req);

    const whereDate = Prisma.sql`visited_at BETWEEN ${startDate} AND ${endDate}`;
    const whereSearch = q
      ? Prisma.sql`AND (path LIKE ${`%${q}%`} OR route_key LIKE ${`%${q}%`})`
      : Prisma.empty;
    const orderField = ALLOWED_SORT[sortby] || Prisma.sql`totalViews`;
    const orderDir = sort === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

    const [rows, countRows, summaryRows, trendRows] = await Promise.all([
      prisma.$queryRaw<AggregatedPageRow[]>(Prisma.sql`
        SELECT
          route_key,
          path,
          COUNT(*) AS totalViews,
          COUNT(DISTINCT visitor_hash) AS uniqueVisitors,
          COUNT(DISTINCT ip_address) AS uniqueIps,
          SUBSTRING_INDEX(
            GROUP_CONCAT(ip_address ORDER BY visited_at DESC SEPARATOR ','),
            ',',
            1
          ) AS latestIp,
          MAX(visited_at) AS lastVisit
        FROM page_visits
        WHERE ${whereDate}
        ${whereSearch}
        GROUP BY route_key, path
        ORDER BY ${orderField} ${orderDir}
        LIMIT ${limit} OFFSET ${skip}
      `),
      prisma.$queryRaw<Array<{ total: bigint | number }>>(Prisma.sql`
        SELECT COUNT(*) AS total
        FROM (
          SELECT 1
          FROM page_visits
          WHERE ${whereDate}
          ${whereSearch}
          GROUP BY route_key, path
        ) grouped
      `),
      prisma.$queryRaw<SummaryRow[]>(Prisma.sql`
        SELECT
          COUNT(*) AS totalViews,
          COUNT(DISTINCT visitor_hash) AS uniqueVisitors,
          COUNT(DISTINCT ip_address) AS uniqueIps,
          COUNT(DISTINCT route_key) AS totalPages
        FROM page_visits
        WHERE ${whereDate}
        ${whereSearch}
      `),
      prisma.$queryRaw<TrendRow[]>(Prisma.sql`
        SELECT
          DATE(visited_at) AS day,
          COUNT(*) AS totalViews,
          COUNT(DISTINCT visitor_hash) AS uniqueVisitors
        FROM page_visits
        WHERE ${whereDate}
        ${whereSearch}
        GROUP BY DATE(visited_at)
        ORDER BY DATE(visited_at) ASC
      `),
    ]);

    const total = toNumber(countRows[0]?.total);
    const totalPage = Math.max(1, Math.ceil(total / limit));
    const nextPage = page * limit < total ? page + 1 : null;
    const summary = summaryRows[0] || {
      totalViews: 0,
      uniqueVisitors: 0,
      uniqueIps: 0,
      totalPages: 0,
    };

    return NextResponse.json(
      {
        status: true,
        message: "Data analytics halaman berhasil diambil",
        metaData: {
          page,
          limit,
          total,
          nextPage,
          totalPage,
          sortby,
          sort,
        },
        data: {
          summary: {
            totalViews: toNumber(summary.totalViews),
            uniqueVisitors: toNumber(summary.uniqueVisitors),
            uniqueIps: toNumber(summary.uniqueIps),
            totalPages: toNumber(summary.totalPages),
          },
          rows: rows.map((row) => ({
            route_key: row.route_key,
            path: row.path,
            totalViews: toNumber(row.totalViews),
            uniqueVisitors: toNumber(row.uniqueVisitors),
            uniqueIps: toNumber(row.uniqueIps),
            latestIp: row.latestIp || null,
            lastVisit: row.lastVisit ? new Date(row.lastVisit).toISOString() : null,
          })),
          trends: trendRows.map((row) => ({
            day: row.day ? new Date(row.day).toISOString().slice(0, 10) : null,
            totalViews: toNumber(row.totalViews),
            uniqueVisitors: toNumber(row.uniqueVisitors),
          })),
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("GET /api/analytics/pages error:", error);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil analytics halaman" },
      { status: 500 },
    );
  }
}
