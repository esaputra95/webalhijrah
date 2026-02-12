"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { useMyParticipation } from "@/hooks/masters/useHalaqohRegistrations";
import Spinner from "@/components/ui/loading/Spinner";
import { motion } from "framer-motion";
import {
  HiOutlineArrowLeft,
  HiOutlineVideoCamera,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineUsers,
} from "react-icons/hi";
import Button from "@/components/ui/buttons/Button";
import Image from "next/image";
import { HalaqohParticipant, HalaqohAttendance } from "@/types/halaqoh";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProgramDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: detailData, isLoading } = useMyParticipation(id as string);
  const participation = detailData?.data as
    | (HalaqohParticipant & {
        attendance: HalaqohAttendance[];
        classmates: HalaqohParticipant[];
      })
    | null;
  const halaqoh = participation?.halaqoh;
  const attendance = participation?.attendance || [];
  const classmates = participation?.classmates || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicNavbar withScrolled={false} />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Spinner size="large" />
          <p className="mt-4 text-slate-500">Memuat detail program...</p>
        </div>
      </div>
    );
  }

  if (!participation) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicNavbar withScrolled={false} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-800">
            Program Tidak Ditemukan
          </h2>
          <p className="text-slate-500 mb-6">
            Maaf, program yang Anda cari tidak tersedia atau Anda tidak memiliki
            akses.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar withScrolled={false} />

      <main className="pt-32 pb-20 container mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-gold transition-colors mb-8 font-medium"
        >
          <HiOutlineArrowLeft /> Kembali
        </button>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Card */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-wider">
                  {halaqoh?.category?.title}
                </span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase">
                  Status: {participation.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#4A4C70] mb-6">
                {halaqoh?.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl text-[#4A4C70] shadow-sm">
                    <HiOutlineCalendar />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">
                      Jadwal Rutin
                    </p>
                    <p className="font-bold text-[#4A4C70]">
                      {halaqoh?.schedule_info || "Menyusul"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl text-[#4A4C70] shadow-sm">
                    <HiOutlineUserGroup />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">
                      Lokasi / Metode
                    </p>
                    <p className="font-bold text-[#4A4C70]">
                      {halaqoh?.location_type === "ONLINE"
                        ? "Online (GMeet/Zoom)"
                        : "Offline (Tatap Muka)"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Classmates Section */}
            <section>
              <h2 className="text-2xl font-bold text-[#4A4C70] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center text-lg">
                  <HiOutlineUsers />
                </span>
                Teman Sekelas
              </h2>

              {classmates.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
                  <p className="text-slate-400 italic">
                    Kamu adalah peserta pertama di kelas ini. Barakallahu
                    fiikum!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {classmates.map((cm) => (
                    <motion.div
                      key={cm.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeInUp}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 shadow-inner">
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-xl">
                          👤
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-[#4A4C70] line-clamp-1">
                        {cm.user?.name}
                      </h4>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Attendance Section */}
            <section>
              <h2 className="text-2xl font-bold text-[#4A4C70] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  <HiOutlineCheckCircle />
                </span>
                Riwayat Kehadiran Saya
              </h2>

              {attendance.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
                  <p className="text-slate-400 italic">
                    Belum ada catatan kehadiran untuk program ini.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Catatan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {attendance.map((at) => (
                        <tr
                          key={at.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                            {new Date(at.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                at.status === "HADIR"
                                  ? "bg-green-50 text-green-600"
                                  : at.status === "IZIN"
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-red-50 text-red-600"
                              }`}
                            >
                              {at.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {at.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions / Link */}
            {halaqoh?.location_type === "ONLINE" && halaqoh?.meeting_link && (
              <section className="bg-brand-gold rounded-3xl p-6 text-brand-brown shadow-xl shadow-brand-gold/20 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl mb-4 backdrop-blur-sm">
                  <HiOutlineVideoCamera />
                </div>
                <h3 className="text-xl font-bold mb-2">Masuk Ruang Kelas</h3>
                <p className="text-sm opacity-80 mb-6 italic">
                  &quot;Baarakallahu Fiikum, selamat belajar jamaah.&quot;
                </p>
                <a
                  href={halaqoh.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-brand-brown text-white font-bold rounded-2xl hover:bg-opacity-90 transition-all text-center shadow-lg"
                >
                  Klik Link Meeting
                </a>
              </section>
            )}

            {/* Mentor Info */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-[#4A4C70] mb-4">
                Mentor / Pengajar
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-gold/20">
                  {halaqoh?.mentor?.user?.image ? (
                    <Image
                      src={halaqoh.mentor.user.image}
                      alt="Mentor"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-gold/10 flex items-center justify-center text-2xl">
                      🕌
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[#4A4C70] leading-tight">
                    {halaqoh?.mentor?.user?.name || "Asatidzah Al-Hijrah"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {halaqoh?.mentor?.specialization || "Ilmu Syar'i"}
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed italic border border-slate-100">
                {halaqoh?.mentor?.bio ||
                  "Membangun ilmu syar'i sesuai pemahaman salafush shalih."}
              </div>
            </section>

            {/* Help/Contact */}
            <section className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
              <h3 className="text-sm font-bold text-blue-800 mb-2">
                Butuh Bantuan?
              </h3>
              <p className="text-xs text-blue-600 leading-relaxed mb-4">
                Jika Anda memiliki kendala terkait materi atau jadwal, silakan
                hubungi admin halaqoh via WhatsApp.
              </p>
              <button className="text-xs font-bold text-blue-700 hover:underline">
                Hubungi Admin →
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
