import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalArticles,
      totalPrograms,
      totalDonations,
      revenueResult,
      recentDonations,
      recentArticles,
    ] = await Promise.all([
      prisma.neo_posts.count({
        where: { post_type: "post" },
      }),
      prisma.neo_programs.count(),
      prisma.neo_donation_public.count({
        where: { deleted_at: null },
      }),
      prisma.neo_donation_public.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          // status: "settled",
          deleted_at: null,
        },
      }),
      prisma.neo_donation_public.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        where: { deleted_at: null },
      }),
      prisma.neo_posts.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        where: { post_type: "post" },
      }),
    ]);

    return NextResponse.json(
      {
        status: true,
        message: "Data Dashboard Berhasil Diambil",
        data: {
          stats: {
            totalArticles,
            totalPrograms,
            totalDonations,
            totalRevenue: Number(revenueResult._sum.amount || 0),
          },
          recentDonations,
          recentArticles,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Dashboard API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: false,
        message: "Gagal mengambil data dashboard",
        error: message,
      },
      { status: 500 }
    );
  }
}
