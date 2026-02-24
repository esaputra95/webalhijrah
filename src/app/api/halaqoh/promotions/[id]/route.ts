import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse, fail } from "@/lib/http";
import { auth } from "@/auth";

export const DELETE = wrap(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth();

    if (!session || String(session.user.role).toUpperCase() !== "ADMIN") {
      return fail("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const promotionId = Number(id);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Get the promotion record
      const promotion = await tx.halaqoh_promotions.findUnique({
        where: { id: promotionId },
      });

      if (!promotion) {
        throw new AppError("Data perpindahan tidak ditemukan", { status: 404 });
      }

      // 2. Remove the ACTIVE record in the target class
      const targetParticipant = await tx.halaqoh_participants.findFirst({
        where: {
          user_id: promotion.user_id,
          halaqoh_id: promotion.to_halaqoh_id,
          status: "ACTIVE",
        },
      });

      if (targetParticipant) {
        await tx.halaqoh_participants.delete({
          where: { id: targetParticipant.id },
        });
      }

      // 3. Restore the record in the source class (if exists)
      if (promotion.from_halaqoh_id) {
        const sourceParticipant = await tx.halaqoh_participants.findFirst({
          where: {
            user_id: promotion.user_id,
            halaqoh_id: promotion.from_halaqoh_id,
            status: "GRADUATED",
          },
          orderBy: { joined_at: "desc" },
        });

        if (sourceParticipant) {
          await tx.halaqoh_participants.update({
            where: { id: sourceParticipant.id },
            data: { status: "ACTIVE" },
          });
        }
      }

      // 4. Delete the promotion record
      await tx.halaqoh_promotions.delete({
        where: { id: promotionId },
      });

      return { id: promotionId };
    });

    return setResponse(result, "Perpindahan kelas berhasil dibatalkan");
  },
);
