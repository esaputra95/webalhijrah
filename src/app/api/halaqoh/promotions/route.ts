import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse, fail } from "@/lib/http";
import { auth } from "@/auth";
import { HalaqohPromotionSchema } from "@/types/halaqohSchema";

export const GET = wrap(async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const userId = sp.get("user_id");
  const categoryId = sp.get("category_id");

  const promotions = await prisma.halaqoh_promotions.findMany({
    where: {
      ...(userId ? { user_id: Number(userId) } : {}),
      ...(categoryId ? { category_id: Number(categoryId) } : {}),
    },
    include: {
      user: { select: { name: true, email: true } },
      admin: { select: { name: true } },
      category: { select: { id: true, title: true } },
      from_halaqoh: {
        select: { id: true, title: true },
      },
      to_halaqoh: {
        select: { id: true, title: true },
      },
      from_level: {
        select: { id: true, title: true, level_order: true },
      },
      to_level: {
        select: { id: true, title: true, level_order: true },
      },
    },
    orderBy: { promoted_at: "desc" },
  });

  return setResponse(promotions, "Data riwayat perpindahan berhasil diambil");
});

export const POST = wrap(async (req: NextRequest) => {
  const session = await auth();

  if (!session || String(session.user.role).toUpperCase() !== "ADMIN") {
    return fail("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const rawPayloads = Array.isArray(body) ? body : [body];

  // Process all payloads
  const result = await prisma.$transaction(async (tx) => {
    const processedPromotions = [];

    for (const rawPayload of rawPayloads) {
      const parsed = HalaqohPromotionSchema.parse(rawPayload);

      // Validate level sequence (must be ±1 step)
      if (parsed.from_level_id) {
        const fromLevel = await tx.halaqoh_material_levels.findUnique({
          where: { id: parsed.from_level_id },
        });
        const toLevel = await tx.halaqoh_material_levels.findUnique({
          where: { id: parsed.to_level_id },
        });

        if (!fromLevel || !toLevel) {
          throw new AppError("Level asal atau tujuan tidak ditemukan", {
            status: 400,
          });
        }

        if (fromLevel.category_id !== toLevel.category_id) {
          throw new AppError(
            "Level asal dan tujuan harus dalam kategori yang sama",
            { status: 400 },
          );
        }

        const diff = toLevel.level_order - fromLevel.level_order;
        if (Math.abs(diff) > 1) {
          throw new AppError(
            "Perpindahan harus berurutan (naik atau turun 1 level)",
            { status: 400 },
          );
        }

        // Auto-detect type based on direction
        if (diff > 0) {
          parsed.type = "PROMOTION";
        } else if (diff < 0) {
          parsed.type = "DEMOTION";
        } else {
          parsed.type = (rawPayload.type as any) || "PROMOTION";
        }
      } else {
        // No from_level means initial placement
        parsed.type = "INITIAL_PLACEMENT";
      }

      // Check participant doesn't already have ACTIVE status in target class
      const existingActive = await tx.halaqoh_participants.findFirst({
        where: {
          user_id: parsed.user_id,
          halaqoh_id: parsed.to_halaqoh_id,
          status: "ACTIVE",
        },
      });

      if (existingActive) {
        throw new AppError(
          `Peserta (ID: ${parsed.user_id}) sudah aktif di kelas tujuan`,
          { status: 400 },
        );
      }

      // 1. Graduate from old class (if from_halaqoh_id exists)
      if (parsed.from_halaqoh_id) {
        await tx.halaqoh_participants.updateMany({
          where: {
            user_id: parsed.user_id,
            halaqoh_id: parsed.from_halaqoh_id,
            status: "ACTIVE",
          },
          data: { status: "GRADUATED" },
        });
      }

      // 2. Create new participant in target class
      await tx.halaqoh_participants.create({
        data: {
          user_id: parsed.user_id,
          halaqoh_id: parsed.to_halaqoh_id,
          status: "ACTIVE",
          joined_at: new Date(),
        },
      });

      // 3. Record the promotion history
      const promotion = await tx.halaqoh_promotions.create({
        data: {
          user_id: parsed.user_id,
          category_id: parsed.category_id,
          from_halaqoh_id: parsed.from_halaqoh_id || null,
          to_halaqoh_id: parsed.to_halaqoh_id,
          from_level_id: parsed.from_level_id || null,
          to_level_id: parsed.to_level_id,
          type: parsed.type,
          test_score: parsed.test_score || null,
          notes: parsed.notes || null,
          promoted_by: Number(session.user.id),
          promoted_at: new Date(),
        },
      });

      processedPromotions.push(promotion);
    }

    return processedPromotions;
  });

  return setResponse(result, "Perpindahan kelas berhasil diproses", 201);
});
