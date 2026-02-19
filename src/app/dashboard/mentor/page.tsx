"use client";
import React, { useState } from "react";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import {
  useMentorClasses,
  useMentorStudents,
  useUpdateStudentNotes,
} from "@/hooks/masters/useMentorDashboard";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/ui/loading/Spinner";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineClipboardCheck,
  HiOutlinePencilAlt,
  HiOutlineChevronRight,
  HiOutlineArrowLeft,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
} from "react-icons/hi";
import { toast } from "react-toastify";
import AttendanceMarkingTable from "@/features/halaqoh/attendance/AttendanceMarkingTable";
import { useHalaqohAttendance } from "@/hooks/masters/useHalaqohAttendance";
import dayjs from "dayjs";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function MentorDashboard() {
  const { data: session } = useSession();
  const { data: classesRes, isLoading: isLoadingClasses } = useMentorClasses();
  const [selectedHalaqohId, setSelectedHalaqohId] = useState<number | null>(
    null,
  );
  const [view, setView] = useState<"LIST" | "DETAIL">("LIST");

  const classes = classesRes?.data || [];

  const handleSelectClass = (id: number) => {
    setSelectedHalaqohId(id);
    setView("DETAIL");
  };

  const handleBack = () => {
    setView("LIST");
    setSelectedHalaqohId(null);
  };

  if (
    session?.user?.role !== "MENTOR" &&
    session?.user?.role !== "ADMIN" &&
    session?.user?.role !== "SUPER_ADMIN"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Akses Dibatasi</h1>
          <p className="text-slate-500 mt-2">
            Halaman ini khusus untuk Pembimbing (Mentor).
          </p>
          <Link
            href="/dashboard"
            className="text-brand-gold hover:underline mt-4 block font-bold"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar withScrolled={false} />

      <main className="pt-32 pb-20 container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-[#4A4C70] rounded-3xl p-8 mb-10 shadow-lg relative overflow-hidden text-white"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl">
            🎓
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Dashboard Pembimbing</h1>
            <p className="text-slate-200 opacity-80">
              Kelola kelas, absensi, dan pantau perkembangan santri Anda.
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === "LIST" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
                  <HiOutlineAcademicCap />
                </div>
                <h2 className="text-2xl font-bold text-[#4A4C70]">
                  Kelas Saya
                </h2>
              </div>

              {isLoadingClasses ? (
                <div className="py-20 flex flex-col items-center">
                  <Spinner size="large" />
                  <p className="mt-4 text-slate-400">Memuat daftar kelas...</p>
                </div>
              ) : classes.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
                  <p className="text-slate-400">
                    Anda belum memiliki kelas yang aktif.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => handleSelectClass(cls.id)}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-gold/30 transition-all group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl overflow-hidden relative">
                          {cls.category?.image ? (
                            <Image
                              src={cls.category.image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            "📖"
                          )}
                        </div>
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          {(cls as any)._count?.participants || 0} Santri
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#4A4C70] group-hover:text-brand-gold transition-colors mb-1">
                        {cls.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <HiOutlineCalendar className="text-brand-gold" />{" "}
                        {cls.schedule_info || "Jadwal belum ditentukan"}
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-brand-gold">
                        <span>KELOLA KELAS</span>
                        <HiOutlineChevronRight />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <ClassDetailView
              halaqohId={selectedHalaqohId!}
              onBack={handleBack}
              halaqohTitle={
                classes.find((c) => c.id === selectedHalaqohId)?.title ||
                "Detail Kelas"
              }
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ClassDetailView({
  halaqohId,
  onBack,
  halaqohTitle,
}: {
  halaqohId: number;
  onBack: () => void;
  halaqohTitle: string;
}) {
  const [activeTab, setActiveTab] = useState<"ATTENDANCE" | "PROGRESS">(
    "ATTENDANCE",
  );
  const { data: studentsRes, isLoading: isLoadingStudents } =
    useMentorStudents(halaqohId);
  const [today] = useState(dayjs().format("YYYY-MM-DD"));
  const { data: attendanceRes, isLoading: isLoadingAttendance } =
    useHalaqohAttendance(halaqohId, today);

  const students = studentsRes?.data || [];
  const attendance = attendanceRes || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-gold transition-colors"
          >
            <HiOutlineArrowLeft />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[#4A4C70]">
              {halaqohTitle}
            </h2>
            <p className="text-sm text-slate-400">
              Input absensi dan catatan harian santri.
            </p>
          </div>
        </div>

        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex inline-flex">
          <button
            onClick={() => setActiveTab("ATTENDANCE")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${activeTab === "ATTENDANCE" ? "bg-brand-gold text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
          >
            <HiOutlineClipboardCheck /> ABSENSI
          </button>
          <button
            onClick={() => setActiveTab("PROGRESS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${activeTab === "PROGRESS" ? "bg-brand-gold text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
          >
            <HiOutlinePencilAlt /> CATATAN
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        {activeTab === "ATTENDANCE" ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#4A4C70]">Absensi Hari Ini</h3>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                {dayjs().locale("id").format("DD MMMM YYYY")}
              </span>
            </div>
            <AttendanceMarkingTable
              participants={students}
              existingAttendance={attendance}
              date={today}
              halaqohId={halaqohId}
              isLoading={isLoadingStudents || isLoadingAttendance}
            />
          </div>
        ) : (
          <StudentProgressNotes
            students={students}
            isLoading={isLoadingStudents}
          />
        )}
      </div>
    </motion.div>
  );
}

function StudentProgressNotes({
  students,
  isLoading,
}: {
  students: any[];
  isLoading: boolean;
}) {
  if (isLoading)
    return (
      <div className="py-10 flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-[#4A4C70] mb-4">
        Catatan Perkembangan Santri
      </h3>
      <div className="grid gap-4">
        {students.map((student) => (
          <StudentNoteItem key={student.id} student={student} />
        ))}
        {students.length === 0 && (
          <p className="text-center text-slate-400 py-10">
            Tidak ada data santri.
          </p>
        )}
      </div>
    </div>
  );
}

function StudentNoteItem({ student }: { student: any }) {
  const [note, setNote] = useState(student.notes || "");
  const updateMutation = useUpdateStudentNotes();

  const handleSaveNote = () => {
    updateMutation.mutate(
      {
        participant_id: student.id,
        notes: note,
      },
      {
        onSuccess: () =>
          toast.success(`Catatan untuk ${student.user?.name} disimpan`),
      },
    );
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-brand-brown/10 flex items-center justify-center text-lg">
          👤
        </div>
        <div>
          <h4 className="font-bold text-[#4A4C70] text-sm">
            {student.user?.name}
          </h4>
          <p className="text-[10px] text-slate-400">{student.user?.email}</p>
        </div>
      </div>
      <div className="flex-2 w-full md:w-auto flex flex-col md:flex-row gap-2 items-center">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Laporan kemajuan, kendala, dll..."
          className="w-full md:w-64 min-h-[40px] px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-brand-gold outline-none resize-none"
        />
        <button
          onClick={handleSaveNote}
          disabled={updateMutation.isPending}
          className="w-full md:w-auto px-4 py-2 bg-brand-brown text-white text-[10px] font-bold rounded-xl hover:bg-brand-brown/90 transition-all disabled:opacity-50"
        >
          {updateMutation.isPending ? "..." : "SIMPAN"}
        </button>
      </div>
    </div>
  );
}
