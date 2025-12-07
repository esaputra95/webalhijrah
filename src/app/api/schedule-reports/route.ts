import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const startAt = (sp.get("startAt") || "").trim();
  const endAt = (sp.get("endAt") || "").trim();
  try {
    const startDate = startAt ? `${startAt} 00:00:00` : "";
    const endDate = endAt ? `${endAt} 23:59:59` : "";
    const data = await prisma.schedules.findMany({
      where: {
        startAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        users: true,
      },
    });

    let response = data?.map((val) => [
      val?.users?.name ?? "",
      dayjs(val?.startAt).format("DD/MM/YYYY hh:mm"),
      dayjs(val?.endAt).format("DD/MM/YYYY hh:mm"),
      val?.description ?? "",
    ]);

    response = [["Nama", "Mulai", "Akhir", "Kegiatan"], ...response];

    return NextResponse.json(
      {
        status: true,
        message: "Data room_requests Berhasil Diambil",
        data: response,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/room_requests error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data room_requests" },
      { status: 500 }
    );
  }
}
