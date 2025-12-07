import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const startAt = (sp.get("startAt") || "").trim();
  const endAt = (sp.get("endAt") || "").trim();
  try {
    // Add time to dates: startAt + 00:00, endAt + 23:59
    const startDate = startAt ? `${startAt} 00:00:00` : "";
    const endDate = endAt ? `${endAt} 23:59:59` : "";

    const data = await prisma.room_requests.findMany({
      where: {
        startAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        requester: true,
        approvedBy: true,
        rooms: true,
        attachments: true,
        services: {
          include: {
            service: true,
          },
        },
        rejectedBy: true,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: any[] = [];
    for (const val of data) {
      newData.push([
        val?.borrowerName?.toString() ?? "",
        val?.borrowerOrganization ?? "",
        val?.borrowerPhone ?? "",
        val?.rooms?.name ?? "",
        val?.status,
        dayjs(val?.startAt).format("DD/MM/YYYY hh:mm"),
        dayjs(val?.endAt).format("DD/MM/YYYY hh:mm"),
      ]);
      newData.push([
        "",
        "",
        "",
        "",
        "Service",
        "Jumlah Pengajuan",
        "Jumlah Disetujui",
      ]);
      val.services.forEach((e) => {
        newData.push([
          "",
          "",
          "",
          "",
          e?.service?.name,
          e?.requestedQty,
          e?.approvedQty,
        ]);
      });
    }

    const response = [
      [
        "Nama PIC",
        "Organisasi",
        "Phone",
        "Ruangan",
        "Status",
        "Mulai",
        "Akhir",
      ],
      ...newData,
    ];

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
