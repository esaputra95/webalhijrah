import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { wrap } from "@/lib/errorApi";
import { setResponse, fail } from "@/lib/http";
import { auth } from "@/auth";

export const PUT = wrap(async (req: NextRequest) => {
  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  if (!userId) {
    return fail("Anda harus login terlebih dahulu", { status: 401 });
  }

  const { participant_id, notes } = await req.json();

  if (!participant_id) {
    return fail("Participant ID diperlukan");
  }

  // Verify mentor access
  const mentor = await prisma.halaqoh_mentors.findUnique({
    where: { user_id: userId },
  });

  const participant = await prisma.halaqoh_participants.findUnique({
    where: { id: Number(participant_id) },
    include: { halaqoh: true },
  });

  if (!mentor || participant?.halaqoh?.mentor_id !== mentor.id) {
    return fail("Anda tidak memiliki akses ke data santri ini", {
      status: 403,
    });
  }

  const updated = await prisma.halaqoh_participants.update({
    where: { id: Number(participant_id) },
    data: { notes },
  });

  return setResponse(
    updated,
    "Catatan perkembangan santri berhasil diperbarui",
  );
});
