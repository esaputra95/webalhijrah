import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { ProgramUpdateSchema } from "@/types/programSchema";

// ====== GET /api/programs/[id] ======
export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { status: false, message: "ID Program tidak valid" },
        { status: 400 }
      );
    }

    const program = await prisma.neo_programs.findUnique({
      where: { id },
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
    console.error("GET /api/programs/[id] error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Program" },
      { status: 500 }
    );
  }
}

// ====== PUT /api/programs/[id] ======
export const PUT = wrap(
  async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return setResponse(null, "ID Program tidak valid", 400);
    }

    const body = await req.json();
    const parsed = ProgramUpdateSchema.parse(body);

    const existing = await prisma.neo_programs.findUnique({
      where: { id },
    });

    if (!existing) {
      return setResponse(null, "Program tidak ditemukan", 404);
    }

    const updated = await prisma.neo_programs.update({
      where: { id },
      data: {
        title: parsed.title,
        slug: parsed.slug,
        content: parsed.content,
        description: parsed.description,
        user_id: parsed.user_id,
        program_category_id: parsed.program_category_id,
        image: parsed.image,
        date: parsed.date
          ? new Date(parsed.date)
          : parsed.date === null
          ? null
          : undefined,
        updated_at: new Date(),
      },
    });

    return setResponse(updated, "Program berhasil diupdate", 200);
  }
);

// ====== DELETE /api/programs/[id] ======
export const DELETE = wrap(
  async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return setResponse(null, "ID Program tidak valid", 400);
    }

    const existing = await prisma.neo_programs.findUnique({
      where: { id },
    });

    if (!existing) {
      return setResponse(null, "Program tidak ditemukan", 404);
    }

    await prisma.neo_programs.delete({
      where: { id },
    });

    return setResponse(null, "Program berhasil dihapus", 200);
  }
);
