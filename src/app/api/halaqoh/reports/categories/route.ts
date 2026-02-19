import { prisma } from "@/lib/prisma";
import { setResponse } from "@/lib/http";

export async function GET() {
  const categories = await prisma.halaqoh_categories.findMany({
    include: {
      halaqohs: {
        select: {
          id: true,
          participants: {
            select: { id: true, status: true },
          },
        },
      },
      registrations: {
        select: { id: true, status: true },
      },
    },
  });

  const data = categories.map((cat) => {
    const totalClasses = cat.halaqohs.length;
    const allParticipants = cat.halaqohs.flatMap((h) => h.participants);
    const totalParticipants = allParticipants.length;
    const totalActive = allParticipants.filter(
      (p) => p.status === "ACTIVE",
    ).length;
    const totalGraduated = allParticipants.filter(
      (p) => p.status === "GRADUATED",
    ).length;
    const totalDropped = allParticipants.filter(
      (p) => p.status === "DROPPED",
    ).length;
    const totalRegistrations = cat.registrations.length;
    const totalAccepted = cat.registrations.filter(
      (r) => r.status === "ACCEPTED",
    ).length;

    return {
      id: cat.id,
      title: cat.title,
      image: cat.image,
      totalClasses,
      totalParticipants,
      totalActive,
      totalGraduated,
      totalDropped,
      totalRegistrations,
      totalAccepted,
    };
  });

  // Global totals
  const totalCategories = data.length;
  const totalClasses = data.reduce((s, d) => s + d.totalClasses, 0);
  const totalParticipants = data.reduce((s, d) => s + d.totalParticipants, 0);

  return setResponse(
    {
      data,
      metaData: {
        total: totalCategories,
        totalClasses,
        totalParticipants,
      },
    },
    "Laporan per kategori berhasil diambil",
  );
}
