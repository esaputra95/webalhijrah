import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse, fail } from "@/lib/http";
import { auth } from "@/auth";

export const GET = wrap(async (req: NextRequest) => {
  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  if (!userId) {
    return fail("Anda harus login terlebih dahulu", { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const halaqohId = sp.get("halaqoh_id");

  if (!halaqohId) {
    return fail("Halaqoh ID diperlukan");
  }

  // Verify that the mentor owns this halaqoh
  const mentor = await prisma.halaqoh_mentors.findUnique({
    where: { user_id: userId },
  });

  const halaqoh = await prisma.halaqohs.findUnique({
    where: { id: Number(halaqohId) },
  });

  if (!mentor || halaqoh?.mentor_id !== mentor.id) {
    return fail("Anda tidak memiliki akses ke kelas ini", { status: 403 });
  }

  const students = await prisma.halaqoh_participants.findMany({
    where: { halaqoh_id: Number(halaqohId) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { user: { name: "asc" } },
  });

  return setResponse(students, "Daftar santri berhasil diambil");
});
