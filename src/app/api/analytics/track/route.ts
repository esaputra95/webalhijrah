import { prisma } from "@/lib/prisma";
import { normalizeRouteKey, sanitizePath, shouldTrackPath } from "@/lib/analyticsPath";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

type TrackPayload = {
  path?: string;
  routeKey?: string;
  sessionId?: string;
  referrer?: string | null;
};

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

function normalizeIp(ip: string): string {
  if (!ip) return "unknown";
  if (ip === "::1") return "127.0.0.1";
  if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");
  return ip;
}

function toVisitorHash(ip: string, userAgent: string): string {
  const salt = process.env.ANALYTICS_SALT || process.env.NEXTAUTH_SECRET || "analytics-default-salt";
  return crypto.createHash("sha256").update(`${ip}|${userAgent}|${salt}`).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as TrackPayload;
    const rawPath = body.path || "/";
    const path = sanitizePath(rawPath);

    if (!shouldTrackPath(path)) {
      return NextResponse.json({ status: true, message: "Path dilewati" }, { status: 200 });
    }

    const routeKey = body.routeKey || normalizeRouteKey(path);
    const userAgent = (req.headers.get("user-agent") || "unknown").slice(0, 512);
    const ip = normalizeIp(getClientIp(req)).slice(0, 45);
    const visitorHash = toVisitorHash(ip, userAgent);
    const sessionId = body.sessionId?.slice(0, 64) || null;
    const referrer = body.referrer?.slice(0, 1024) || null;

    const recentDup = await prisma.$queryRaw<Array<{ id: bigint }>>`
      SELECT id
      FROM page_visits
      WHERE route_key = ${routeKey}
        AND (
          (${sessionId} IS NOT NULL AND session_id = ${sessionId})
          OR (${sessionId} IS NULL AND visitor_hash = ${visitorHash})
        )
        AND visited_at >= DATE_SUB(NOW(), INTERVAL 15 SECOND)
      LIMIT 1
    `;

    if (recentDup.length > 0) {
      return NextResponse.json({ status: true, message: "Duplicate singkat dilewati" }, { status: 200 });
    }

    await prisma.$executeRaw`
      INSERT INTO page_visits (
        path,
        route_key,
        visited_at,
        visitor_hash,
        ip_address,
        session_id,
        referrer,
        user_agent,
        created_at
      ) VALUES (
        ${path},
        ${routeKey},
        NOW(),
        ${visitorHash},
        ${ip},
        ${sessionId},
        ${referrer},
        ${userAgent},
        NOW()
      )
    `;

    return NextResponse.json({ status: true, message: "Tracked" }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/analytics/track error:", error);
    return NextResponse.json(
      { status: false, message: "Gagal menyimpan analytics" },
      { status: 500 },
    );
  }
}
