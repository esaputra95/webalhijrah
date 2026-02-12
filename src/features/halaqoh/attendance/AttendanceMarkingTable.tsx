"use client";
import React, { FC, useState, useEffect } from "react";
import {
  HalaqohParticipant,
  HalaqohAttendance,
  AttendanceStatus,
} from "@/types/halaqoh";
import { Table, Column } from "@/components/ui/tables/Table";
import { useSaveHalaqohAttendance } from "@/hooks/masters/useHalaqohAttendance";

type Props = {
  participants: HalaqohParticipant[];
  existingAttendance: HalaqohAttendance[];
  date: string;
  halaqohId: number;
  isLoading: boolean;
};

const AttendanceMarkingTable: FC<Props> = ({
  participants,
  existingAttendance,
  date,
  halaqohId,
  isLoading,
}) => {
  const [attendanceData, setAttendanceData] = useState<{
    [userId: number]: Partial<HalaqohAttendance>;
  }>({});
  const saveMutation = useSaveHalaqohAttendance();

  useEffect(() => {
    const initialData: { [userId: number]: Partial<HalaqohAttendance> } = {};
    participants.forEach((p) => {
      const existing = existingAttendance.find((a) => a.user_id === p.user_id);
      initialData[p.user_id] = existing
        ? { ...existing, date: new Date(existing.date) }
        : {
            halaqoh_id: halaqohId,
            user_id: p.user_id,
            date: new Date(date),
            status: "HADIR" as AttendanceStatus,
            notes: "",
          };
    });
    setAttendanceData(initialData);
  }, [participants, existingAttendance, date, halaqohId]);

  const handleStatusChange = (userId: number, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], status },
    }));
  };

  const handleNoteChange = (userId: number, notes: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], notes },
    }));
  };

  const handleSave = () => {
    const payload = Object.values(attendanceData);
    saveMutation.mutate(payload);
  };

  const Columns: Column<HalaqohParticipant>[] = [
    {
      header: "Nama Jamaah",
      accessor: "user",
      render: (row) => row.user?.name || "N/A",
    },
    {
      header: "Status Kehadiran",
      accessor: "id",
      render: (row) => {
        const current = attendanceData[row.user_id];
        return (
          <div className="flex gap-2">
            {(["HADIR", "IZIN", "SAKIT", "ALPA"] as AttendanceStatus[]).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(row.user_id, s)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    current?.status === s
                      ? "bg-brand-gold text-white border-brand-gold"
                      : "bg-white text-gray-500 border-gray-200 hover:border-brand-gold hover:text-brand-gold"
                  }`}
                >
                  {s}
                </button>
              ),
            )}
          </div>
        );
      },
    },
    {
      header: "Catatan",
      accessor: "id",
      render: (row) => (
        <input
          type="text"
          value={attendanceData[row.user_id]?.notes || ""}
          onChange={(e) => handleNoteChange(row.user_id, e.target.value)}
          placeholder="Tambahkan catatan..."
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:border-brand-gold focus:outline-none"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          data={participants}
          columns={Columns}
          isLoading={isLoading}
          totalPages={0}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending || participants.length === 0}
          className="px-6 py-2 bg-brand-gold text-white rounded-lg font-semibold hover:bg-brand-gold/90 transition-all disabled:opacity-50"
        >
          {saveMutation.isPending ? "Menyimpan..." : "Simpan Absensi"}
        </button>
      </div>
    </div>
  );
};

export default AttendanceMarkingTable;
