"use client";
import React, { useMemo } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import { Column, Table } from "@/components/ui/tables/Table";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

type MentorRow = {
  id: number;
  name: string;
  email: string;
  specialization: string | null;
  totalClasses: number;
  totalParticipants: number;
  totalGraduated: number;
  attendanceRate: number;
};

export default function MentorReportPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["halaqoh-report-mentors"],
    queryFn: async () => {
      const res = await api.get(apiUrl.halaqohReportMentors);
      return res.data.data;
    },
  });

  const exportExcel = () => {
    const rows = (data?.data || []).map((r: MentorRow) => ({
      "Nama Mentor": r.name,
      Email: r.email,
      Spesialisasi: r.specialization || "-",
      "Jumlah Kelas": r.totalClasses,
      "Jumlah Peserta Aktif": r.totalParticipants,
      "Jumlah Graduated": r.totalGraduated,
      "Rata-rata Kehadiran (%)": r.attendanceRate,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Per Mentor");
    XLSX.writeFile(
      wb,
      `Laporan_Per_Mentor_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
    );
  };

  const mentors: MentorRow[] = data?.data || [];
  const totalMentors = mentors.length;
  const totalClasses = mentors.reduce((s, m) => s + m.totalClasses, 0);
  const totalParticipants = mentors.reduce(
    (s, m) => s + m.totalParticipants,
    0,
  );

  const columns = useMemo<Column<MentorRow>[]>(
    () => [
      { header: "Nama Mentor", accessor: "name", sortable: true },
      { header: "Email", accessor: "email" },
      {
        header: "Spesialisasi",
        accessor: "specialization" as keyof MentorRow,
        render: (row) => row.specialization || "-",
      },
      { header: "Jumlah Kelas", accessor: "totalClasses", sortable: true },
      {
        header: "Peserta Aktif",
        accessor: "totalParticipants",
        sortable: true,
      },
      { header: "Graduated", accessor: "totalGraduated", sortable: true },
      {
        header: "Kehadiran (%)",
        accessor: "attendanceRate",
        sortable: true,
        render: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${row.attendanceRate >= 80 ? "bg-green-100 text-green-800" : row.attendanceRate >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
          >
            {row.attendanceRate}%
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="p-4">
      <TitleContent title="Laporan Per Mentor" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Mentor
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalMentors}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Kelas
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalClasses}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Peserta Aktif
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalParticipants}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={exportExcel}
          disabled={!data?.data?.length}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition disabled:opacity-50"
        >
          Export Excel
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <Table
          data={data?.data ?? []}
          columns={columns}
          isLoading={isLoading}
          totalPages={0}
        />
      </div>
    </div>
  );
}
