import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse, fail } from "@/lib/http";
import { auth } from "@/auth";

export const GET = wrap(async () => {
  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  if (!userId) {
    return fail("Anda harus login terlebih dahulu", { status: 401 });
  }

  // Fetch active/past participations
  const participations = await prisma.halaqoh_participants.findMany({
    where: { user_id: userId },
    include: {
      halaqoh: {
        include: {
          category: true,
          mentor: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { joined_at: "desc" },
  });

  // Fetch registrations
  const registrations = await prisma.halaqoh_registrations.findMany({
    where: { user_id: userId },
    include: {
      category: true,
    },
    orderBy: { created_at: "desc" },
  });

  // Enrich registrations with participant_id if ACCEPTED and assigned
  const enrichedRegistrations = await Promise.all(
    registrations.map(async (reg) => {
      if (reg.status === "ACCEPTED") {
        // Try to find ANY participation for this user in this category
        const p = await prisma.halaqoh_participants.findFirst({
          where: {
            user_id: userId,
            halaqoh: {
              category_id: reg.category_id,
            },
          },
          select: { id: true },
        });
        return { ...reg, participant_id: p?.id || null };
      }
      return { ...reg, participant_id: null };
    }),
  );

  return setResponse(
    {
      participations,
      registrations: enrichedRegistrations,
    },
    "Data program saya berhasil diambil",
  );
});
