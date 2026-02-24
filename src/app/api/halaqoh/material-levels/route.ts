import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohMaterialLevelSchema } from "@/types/halaqohSchema";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const categoryId = sp.get("category_id");

  const levels = await prisma.halaqoh_material_levels.findMany({
    where: {
      ...(categoryId ? { category_id: Number(categoryId) } : {}),
    },
    include: {
      category: { select: { id: true, title: true } },
    },
    orderBy: [{ category_id: "asc" }, { level_order: "asc" }],
  });

  return setResponse(levels, "Data tingkatan materi berhasil diambil");
}

export const POST = wrap(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = HalaqohMaterialLevelSchema.parse(body);

  const { id: _, ...data } = parsed;

  const created = await prisma.halaqoh_material_levels.create({
    data: {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return setResponse(created, "Tingkatan materi berhasil dibuat", 201);
});
