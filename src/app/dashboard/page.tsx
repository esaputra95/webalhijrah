"use client";
import React from "react";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { useMyPrograms } from "@/hooks/masters/useHalaqohRegistrations";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Spinner from "@/components/ui/loading/Spinner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HalaqohRegistration } from "@/types/halaqoh";
import {
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineClipboardList,
  HiOutlineChevronRight,
} from "react-icons/hi";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ParticipantDashboard() {
  const { data: session } = useSession();
  const { data: myPrograms, isLoading } = useMyPrograms();
  const router = useRouter();

  const participations = myPrograms?.data?.participations || [];
  const registrations =
    (myPrograms?.data?.registrations as HalaqohRegistration[]) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar withScrolled={false} />

      <main className="pt-32 pb-20 container mx-auto px-4">
        {/* Header Profile */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-brand-gold/20 shadow-inner">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="User"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-brand-brown/10 flex items-center justify-center text-3xl">
                👤
              </div>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-[#4A4C70] mb-1">
              Ahlan wa Sahlan, {session?.user?.name || "Jamaah"}!
            </h1>
            <p className="text-slate-500">
              Senang melihatmu kembali. Teruslah istiqomah dalam menuntut ilmu.
            </p>
          </div>
        </motion.section>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="large" />
            <p className="mt-4 text-slate-500 font-medium">
              Memuat data program...
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Active Programs column */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
                    <HiOutlineAcademicCap />
                  </div>
                  <h2 className="text-2xl font-bold text-[#4A4C70]">
                    Halaqoh Saya
                  </h2>
                </div>

                {participations.length === 0 &&
                registrations.filter((r) => r.status === "ACCEPTED").length ===
                  0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
                    <p className="text-slate-400 mb-4 text-lg">
                      Kamu belum bergabung dalam halaqoh apapun.
                    </p>
                    <Link
                      href="/halaqoh"
                      className="inline-flex items-center font-bold text-brand-gold hover:underline"
                    >
                      Cari Program Halaqoh{" "}
                      <HiOutlineChevronRight className="ml-1" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {participations.map((p, idx) => (
                      <motion.div
                        key={`part-${p.id}`}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Link
                          href={`/dashboard/halaqoh/${p.id}`}
                          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md hover:border-brand-gold/30 transition-all group"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl overflow-hidden relative">
                            {p.halaqoh?.category?.image ? (
                              <Image
                                src={p.halaqoh.category.image}
                                alt="Prog"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              "📖"
                            )}
                          </div>
                          <div className="flex-1">
                            <span
                              className={`text-[10px] uppercase tracking-wider font-bold mb-1 block ${
                                p.status === "ACTIVE"
                                  ? "text-green-500"
                                  : "text-brand-gold"
                              }`}
                            >
                              {p.status}
                            </span>
                            <h3 className="text-xl font-bold text-[#4A4C70] group-hover:text-brand-gold transition-colors">
                              {p.halaqoh?.title}
                            </h3>
                            <p className="text-sm text-slate-500">
                              Mentor:{" "}
                              {p.halaqoh?.mentor?.user?.name || "Asatidzah"}
                            </p>
                          </div>
                          <HiOutlineChevronRight className="text-2xl text-slate-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.div>
                    ))}

                    {/* Accepted Registrations that aren't yet in participations */}
                    {registrations
                      .filter(
                        (r) => r.status === "ACCEPTED" && !r.participant_id,
                      )
                      .map((r, idx) => (
                        <motion.div
                          key={`reg-${r.id}`}
                          initial="hidden"
                          animate="visible"
                          variants={fadeInUp}
                          transition={{
                            delay: (participations.length + idx) * 0.1,
                          }}
                        >
                          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 opacity-80">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl overflow-hidden relative grayscale">
                              {r.category?.image ? (
                                <Image
                                  src={r.category.image}
                                  alt="Prog"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                "📝"
                              )}
                            </div>
                            <div className="flex-1">
                              <span className="text-[10px] uppercase tracking-wider font-bold mb-1 block text-green-600">
                                PENDAFTARAN DISETUJUI
                              </span>
                              <h3 className="text-xl font-bold text-[#4A4C70]">
                                {r.category?.title}
                              </h3>
                              <p className="text-xs text-slate-400 italic">
                                Menunggu Admin menunjuk kelas & pembimbing...
                              </p>
                            </div>
                            <div className="text-xs font-bold text-slate-300">
                              WAITING
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar / Registrations */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
                    <HiOutlineClipboardList />
                  </div>
                  <h2 className="text-xl font-bold text-[#4A4C70]">
                    Status Pendaftaran
                  </h2>
                </div>

                {registrations.length === 0 ? (
                  <p className="text-slate-400 italic text-sm px-2">
                    Tidak ada pendaftaran aktif.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((r) => (
                      <div
                        key={r.id}
                        className={`bg-white rounded-xl p-4 border border-slate-100 shadow-sm transition-all ${
                          r.status === "ACCEPTED" && r.participant_id
                            ? "cursor-pointer hover:border-brand-gold border-brand-gold/20"
                            : ""
                        }`}
                        onClick={() => {
                          if (r.status === "ACCEPTED" && r.participant_id) {
                            router.push(
                              `/dashboard/halaqoh/${r.participant_id}`,
                            );
                          }
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-[#4A4C70] text-sm leading-tight">
                            {r.category?.title}
                          </h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              r.status === "PENDING"
                                ? "bg-amber-50 text-amber-500"
                                : r.status === "REJECTED"
                                  ? "bg-red-50 text-red-500"
                                  : r.status === "ACCEPTED"
                                    ? "bg-green-50 text-green-600"
                                    : "bg-blue-50 text-blue-500"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <HiOutlineClock />
                          <span>
                            Daftar:{" "}
                            {new Date(r.created_at || "").toLocaleDateString(
                              "id-ID",
                            )}
                          </span>
                        </div>
                        {r.status === "ACCEPTED" && (
                          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-brand-gold">
                            <span>
                              {r.participant_id
                                ? "LIHAT DETAIL KELAS"
                                : "MENUNGGU PENEMPATAN KELAS"}
                            </span>
                            <HiOutlineChevronRight />
                          </div>
                        )}
                        {r.status === "PENDING" && (
                          <p className="text-[10px] text-slate-400 mt-2 bg-slate-50 p-2 rounded-lg italic">
                            Mohon tunggu konfirmasi dari panitia via WA.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Tips Section */}
              <section className="bg-[#4A4C70] rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 text-7xl opacity-10">
                  📖
                </div>
                <h4 className="font-bold text-brand-gold mb-2">Tips Belajar</h4>
                <p className="text-xs text-slate-200 leading-relaxed mb-4">
                  &quot;Siapa yang menempuh jalan untuk mencari ilmu, maka Allah
                  akan mudahkan baginya jalan menuju surga.&quot; (HR. Muslim)
                </p>
                <div className="w-8 h-1 bg-brand-gold rounded-full"></div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
