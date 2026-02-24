import { prisma } from "@/lib/prisma";
import { setResponse } from "@/lib/http";

export async function GET() {
  const mentors = await prisma.halaqoh_mentors.findMany({
    where: { is_active: true },
    include: {
      user: { select: { name: true, email: true } },
      halaqohs: {
        select: {
          id: true,
          title: true,
          participants: {
            select: { id: true, status: true },
          },
          attendance: {
            select: { id: true, status: true },
          },
        },
      },
    },
  });

  const data = mentors.map((mentor) => {
    const totalClasses = mentor.halaqohs.length;
    const totalParticipants = mentor.halaqohs.reduce(
      (sum, h) =>
        sum + h.participants.filter((p) => p.status === "ACTIVE").length,
      0,
    );
    const totalGraduated = mentor.halaqohs.reduce(
      (sum, h) =>
        sum + h.participants.filter((p) => p.status === "GRADUATED").length,
      0,
    );
    const totalAttendance = mentor.halaqohs.reduce(
      (sum, h) => sum + h.attendance.length,
      0,
    );
    const totalHadir = mentor.halaqohs.reduce(
      (sum, h) => sum + h.attendance.filter((a) => a.status === "HADIR").length,
      0,
    );
    const attendanceRate =
      totalAttendance > 0
        ? Math.round((totalHadir / totalAttendance) * 100)
        : 0;

    return {
      id: mentor.id,
      name: mentor.user.name,
      email: mentor.user.email,
      specialization: mentor.specialization,
      totalClasses,
      totalParticipants,
      totalGraduated,
      attendanceRate,
    };
  });

  return setResponse(
    {
      data,
      metaData: {
        total: data.length,
      },
    },
    "Laporan per mentor berhasil diambil",
  );
}
