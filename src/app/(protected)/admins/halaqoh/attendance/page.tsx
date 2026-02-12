"use client";
import React, { useState } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import { useHalaqohClasses } from "@/hooks/masters/useHalaqohClasses";
import { useHalaqohParticipants } from "@/hooks/masters/useHalaqohParticipants";
import { useHalaqohAttendance } from "@/hooks/masters/useHalaqohAttendance";
import AttendanceMarkingTable from "@/features/halaqoh/attendance/AttendanceMarkingTable";
import { FiCalendar, FiBookOpen } from "react-icons/fi";

const AttendancePage = () => {
  const [selectedHalaqohId, setSelectedHalaqohId] = useState<number | "">("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const { data: halaqohClassesResponse, isLoading: isLoadingClasses } =
    useHalaqohClasses();
  const halaqohClasses = halaqohClassesResponse?.data || [];

  const { data: participantsResponse, isLoading: isLoadingParticipants } =
    useHalaqohParticipants(
      selectedHalaqohId ? { halaqoh_id: Number(selectedHalaqohId) } : undefined,
    );
  const participants = participantsResponse?.data || [];

  const { data: attendance, isLoading: isLoadingAttendance } =
    useHalaqohAttendance(
      selectedHalaqohId ? Number(selectedHalaqohId) : undefined,
      selectedDate,
    );

  return (
    <div className="space-y-6">
      <TitleContent
        title="Absensi Halaqoh"
        subTitle="Catat dan pantau kehadiran jamaah di setiap kelas halaqoh."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiBookOpen className="text-brand-gold" /> Pilih Kelas Halaqoh
          </label>
          <select
            value={selectedHalaqohId}
            onChange={(e) =>
              setSelectedHalaqohId(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all"
          >
            <option value="">-- Pilih Kelas --</option>
            {halaqohClasses.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.category?.title})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiCalendar className="text-brand-gold" /> Pilih Tanggal
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all"
          />
        </div>
      </div>

      {selectedHalaqohId ? (
        <AttendanceMarkingTable
          participants={participants}
          existingAttendance={attendance || []}
          date={selectedDate}
          halaqohId={Number(selectedHalaqohId)}
          isLoading={isLoadingParticipants || isLoadingAttendance}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
          <FiBookOpen size={48} className="mb-4 opacity-50" />
          <p>Silakan pilih kelas halaqoh untuk memulai absensi</p>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
