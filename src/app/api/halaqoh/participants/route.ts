import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse, fail } from "@/lib/http";
import { auth } from "@/auth";

export const POST = wrap(async (req: NextRequest) => {
  const session = await auth();

  if (!session || String(session.user.role).toUpperCase() !== "ADMIN") {
    return fail("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { user_id, halaqoh_id } = body;

  if (!user_id || !halaqoh_id) {
    return fail("user_id and halaqoh_id are required", { status: 400 });
  }

  // Check if already a participant in THIS halaqoh
  const existing = await prisma.halaqoh_participants.findFirst({
    where: {
      user_id: Number(user_id),
      halaqoh_id: Number(halaqoh_id),
    },
  });

  if (existing) {
    return fail("Jamaah sudah terdaftar di halaqoh ini", { status: 400 });
  }

  // Create participant record in a transaction to ensure registration is updated
  const result = await prisma.$transaction(async (tx) => {
    const participant = await tx.halaqoh_participants.create({
      data: {
        user_id: Number(user_id),
        halaqoh_id: Number(halaqoh_id),
        status: "ACTIVE",
        joined_at: new Date(),
      },
      include: {
        halaqoh: true,
      },
    });

    // Update registration status to COMPLETED
    await tx.halaqoh_registrations.updateMany({
      where: {
        user_id: Number(user_id),
        category_id: participant.halaqoh.category_id,
        status: { not: "COMPLETED" },
      },
      data: {
        status: "COMPLETED",
      },
    });

    return participant;
  });

  return setResponse(result, "Jamaah berhasil ditempatkan ke kelas", 201);
});

export const GET = wrap(async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const halaqohId = sp.get("halaqoh_id");
  const userId = sp.get("user_id");

  const participants = await prisma.halaqoh_participants.findMany({
    where: {
      ...(halaqohId ? { halaqoh_id: Number(halaqohId) } : {}),
      ...(userId ? { user_id: Number(userId) } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      halaqoh: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { joined_at: "desc" },
  });

  return setResponse(participants, "Data peserta berhasil diambil");
});
