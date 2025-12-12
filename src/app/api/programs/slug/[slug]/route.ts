import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ====== GET /api/programs/slug/[slug] ======
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;

    const program = await prisma.neo_programs.findFirst({
      where: { slug: slug },
      include: {
        programCategories: {
          select: { id: true, title: true },
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { status: false, message: "Program tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "Data Program berhasil diambil",
        data: program,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/programs/slug/[slug] error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Program" },
      { status: 500 }
    );
  }
}
