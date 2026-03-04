import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gender = searchParams.get("gender");
    const search = searchParams.get("search");
    const startAt = searchParams.get("startAt");
    const endAt = searchParams.get("endAt");
    const all = searchParams.get("all") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Prisma.ItikafWhereInput = {};

    if (gender) where.gender = gender;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (startAt || endAt) {
      where.createdAt = {
        ...(startAt && { gte: new Date(`${startAt}T00:00:00Z`) }),
        ...(endAt && { lte: new Date(`${endAt}T23:59:59Z`) }),
      };
    }

    const [data, total] = await Promise.all([
      prisma.itikaf.findMany({
        where,
        orderBy: { id: "desc" },
        ...(all ? {} : { skip, take: limit }),
      }),
      prisma.itikaf.count({ where }),
    ]);

    // Summary statistics
    const [ikhwanCount, akhwatCount] = await Promise.all([
      prisma.itikaf.count({ where: { ...where, gender: "Laki-laki" } }),
      prisma.itikaf.count({ where: { ...where, gender: "Perempuan" } }),
    ]);

    const summary = {
      total,
      ikhwan: ikhwanCount,
      akhwat: akhwatCount,
    };

    return NextResponse.json({
      ok: true,
      data: {
        data,
        metaData: {
          total,
          page,
          limit,
          totalPage: Math.ceil(total / limit),
          summary,
        },
      },
    });
  } catch (error) {
    console.error("Itikaf Report API Error:", error);
    return NextResponse.json(
      { ok: false, message: "Gagal mengambil data laporan" },
      { status: 500 },
    );
  }
}
