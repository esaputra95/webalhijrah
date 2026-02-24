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

  // Find the mentor record for this user
  const mentor = await prisma.halaqoh_mentors.findUnique({
    where: { user_id: userId },
  });

  if (!mentor) {
    return fail("Profil pembimbing tidak ditemukan", { status: 404 });
  }

  // Fetch classes assigned to this mentor
  const classes = await prisma.halaqohs.findMany({
    where: { mentor_id: mentor.id },
    include: {
      category: true,
      material_level: true,
      _count: {
        select: { participants: { where: { status: "ACTIVE" } } },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return setResponse(classes, "Daftar kelas pembimbing berhasil diambil");
});
