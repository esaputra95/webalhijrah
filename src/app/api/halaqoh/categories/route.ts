import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohCategorySchema } from "@/types/halaqohSchema";

export async function GET() {
  const categories = await prisma.halaqoh_categories.findMany({
    orderBy: { title: "asc" },
  });
  return setResponse(categories, "Data kategori halaqoh berhasil diambil");
}

export const POST = wrap(async (req: NextRequest) => {
  const body = await req.json();
  console.log("POST /api/halaqoh/categories - Body:", body);
  const parsed = HalaqohCategorySchema.parse(body);

  const { id: _, ...data } = parsed;
  console.log("POST /api/halaqoh/categories - Data to save:", data);

  const created = await prisma.halaqoh_categories.create({
    data,
  });

  return setResponse(created, "Kategori halaqoh berhasil dibuat", 201);
});
