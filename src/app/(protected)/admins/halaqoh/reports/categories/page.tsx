"use client";
import React, { useMemo } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import { Column, Table } from "@/components/ui/tables/Table";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

type CategoryRow = {
  id: number;
  title: string;
  image: string | null;
  totalClasses: number;
  totalParticipants: number;
  totalActive: number;
  totalGraduated: number;
  totalDropped: number;
  totalRegistrations: number;
  totalAccepted: number;
};

export default function CategoryReportPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["halaqoh-report-categories"],
    queryFn: async () => {
      const res = await api.get(apiUrl.halaqohReportCategories);
      return res.data.data;
    },
  });

  const exportExcel = () => {
    const rows = (data?.data || []).map((r: CategoryRow) => ({
      "Nama Kategori": r.title,
      "Jumlah Kelas": r.totalClasses,
      "Total Peserta": r.totalParticipants,
      "Peserta Aktif": r.totalActive,
      "Peserta Graduated": r.totalGraduated,
      "Peserta Dropped": r.totalDropped,
      "Total Registrasi": r.totalRegistrations,
      Diterima: r.totalAccepted,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Per Kategori");
    XLSX.writeFile(
      wb,
      `Laporan_Per_Kategori_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
    );
  };

  const categories: CategoryRow[] = data?.data || [];
  const totalCategories = data?.metaData?.total || 0;
  const totalClasses = data?.metaData?.totalClasses || 0;
  const totalParticipants = data?.metaData?.totalParticipants || 0;

  const columns = useMemo<Column<CategoryRow>[]>(
    () => [
      { header: "Nama Kategori", accessor: "title", sortable: true },
      { header: "Kelas", accessor: "totalClasses", sortable: true },
      {
        header: "Total Peserta",
        accessor: "totalParticipants",
        sortable: true,
      },
      {
        header: "Aktif",
        accessor: "totalActive",
        sortable: true,
        render: (row) => (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {row.totalActive}
          </span>
        ),
      },
      {
        header: "Graduated",
        accessor: "totalGraduated",
        sortable: true,
        render: (row) => (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {row.totalGraduated}
          </span>
        ),
      },
      {
        header: "Dropped",
        accessor: "totalDropped",
        sortable: true,
        render: (row) => (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {row.totalDropped}
          </span>
        ),
      },
      {
        header: "Total Registrasi",
        accessor: "totalRegistrations",
        sortable: true,
      },
      {
        header: "Diterima",
        accessor: "totalAccepted",
        sortable: true,
        render: (row) => (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {row.totalAccepted}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="p-4">
      <TitleContent title="Laporan Per Kategori Halaqoh" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Kategori
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalCategories}
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
            Total Peserta
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
          data={categories}
          columns={columns}
          isLoading={isLoading}
          totalPages={0}
        />
      </div>
    </div>
  );
}
