import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { SliderCreateSchema } from "@/types/masters/silderSchema";

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  image: true,
  type: true,
  description: true,
  user_id: true,
  created_at: true,
  updated_at: true,
} as const;

// ====== GET /api/sliders ======
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const type = sp.get("type");

    const where: Prisma.slidersWhereInput = type
      ? { type: { equals: type } }
      : {};

    const sliders = await prisma.sliders.findMany({
      where,
      orderBy: { created_at: "desc" },
      select: SELECT_FIELDS,
    });

    return NextResponse.json(
      {
        status: true,
        message: "Data Sliders berhasil diambil",
        data: sliders,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/sliders error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Sliders" },
      { status: 500 }
    );
  }
}

// ====== POST /api/sliders ======
export const POST = wrap(async (req: Request) => {
  const body = await req.json();
  const parsed = SliderCreateSchema.parse(body);

  const created = await prisma.sliders.create({
    data: {
      image: parsed.image,
      type: parsed.type,
      description: parsed.description,
      user_id: parsed.user_id,
    },
    select: SELECT_FIELDS,
  });

  return setResponse(created, "Slider berhasil dibuat", 201);
});
