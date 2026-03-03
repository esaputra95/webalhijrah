import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.itikaf.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ ok: true, data: list });
  } catch (error) {
    console.error("Fetch itikaf error:", error);
    return NextResponse.json(
      { ok: false, message: "Gagal mengambil data itikaf" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "ID tidak valid" },
        { status: 400 },
      );
    }

    await prisma.itikaf.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ ok: true, message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Delete itikaf error:", error);
    return NextResponse.json(
      { ok: false, message: "Gagal menghapus data" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "ID tidak valid" },
        { status: 400 },
      );
    }

    const updated = await prisma.itikaf.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
        identitas: body.identitas,
        umur: parseInt(body.umur.toString()),
        gender: body.gender,
        surat_izin: body.surat_izin,
      },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    console.error("Update itikaf error:", error);
    return NextResponse.json(
      { ok: false, message: "Gagal memperbarui data" },
      { status: 500 },
    );
  }
}
