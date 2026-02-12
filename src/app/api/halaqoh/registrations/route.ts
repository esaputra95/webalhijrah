import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse, fail } from "@/lib/http";
import { HalaqohRegistrationSchema } from "@/types/halaqohSchema";
import { registration_status } from "@prisma/client";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const userId = sp.get("user_id");
  const isPlaced = sp.get("is_placed");
  const categoryId = sp.get("category_id");

  const registrations = await prisma.halaqoh_registrations.findMany({
    where: {
      ...(status ? { status: status as registration_status } : {}),
      ...(userId ? { user_id: Number(userId) } : {}),
      ...(categoryId ? { category_id: Number(categoryId) } : {}),
      ...(isPlaced === "true" ? { status: "COMPLETED" } : {}),
      ...(isPlaced === "false" ? { status: { not: "COMPLETED" } } : {}),
    },
    include: {
      user: { select: { name: true, email: true } },
      category: true,
    },
    orderBy: { created_at: "desc" },
  });

  return setResponse(registrations, "Data pendaftaran berhasil diambil");
}

export const POST = wrap(async (req: NextRequest) => {
  const session = await auth();
  const body = await req.json();
  const parsed = HalaqohRegistrationSchema.parse(body);

  const userId =
    parsed.user_id || (session?.user?.id ? Number(session.user.id) : null);

  if (!userId) {
    return fail("Anda harus login terlebih dahulu", { status: 401 });
  }

  // Prevent duplicate registration for active/pending status
  const existing = await prisma.halaqoh_registrations.findFirst({
    where: {
      user_id: userId,
      category_id: parsed.category_id,
      status: { in: ["PENDING", "TESTING", "ACCEPTED"] },
    },
  });

  if (existing) {
    return fail("Anda sudah terdaftar dalam program ini");
  }

  // Fetch category to get default test date if needed
  const category = await prisma.halaqoh_categories.findUnique({
    where: { id: parsed.category_id },
  });

  if (!category) {
    return fail("Program tidak ditemukan", { status: 404 });
  }

  const created = await prisma.halaqoh_registrations.create({
    data: {
      user_id: userId,
      category_id: parsed.category_id,
      status: parsed.status || "PENDING",
      phone_number: parsed.phone_number,
      address: parsed.address,
      gender: parsed.gender,
      notes: parsed.notes,
      date: parsed.date ? new Date(parsed.date) : null,
      date_test: parsed.date_test
        ? new Date(parsed.date_test)
        : category.date_test,
    },
    include: {
      user: { select: { name: true } },
      category: true,
    },
  });

  return setResponse(created, "Pendaftaran berhasil dikirim", 201);
});
