"use client";
import React, { useEffect, useMemo, useState } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import { Column, Table } from "@/components/ui/tables/Table";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TextInput from "@/components/ui/inputs/TextInput";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

type AttendanceRow = {
  id: number;
  date: string;
  status: string;
  notes: string | null;
  user: { name: string };
  halaqoh: { title: string; category: { title: string } };
};

const statusColors: Record<string, string> = {
  HADIR: "bg-green-100 text-green-800",
  IZIN: "bg-blue-100 text-blue-800",
  SAKIT: "bg-yellow-100 text-yellow-800",
  ALPA: "bg-red-100 text-red-800",
};

export default function AttendanceReportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(
    searchParams.get("startAt") ||
      dayjs().startOf("month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endAt") || dayjs().endOf("month").format("YYYY-MM-DD"),
  );
  const [status, setStatus] = useState(searchParams.get("status") || "");

  const { data, isLoading } = useQuery({
    queryKey: ["halaqoh-report-attendance", searchParams.toString()],
    queryFn: async () => {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get(apiUrl.halaqohReportAttendance, { params });
      return res.data.data;
    },
  });

  useEffect(() => {
    if (!searchParams.get("startAt") && !searchParams.get("endAt")) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("startAt", startDate);
      sp.set("endAt", endDate);
      router.replace(`${pathname}?${sp.toString()}`);
    }
  }, []);

  const handleFilter = () => {
    const sp = new URLSearchParams(searchParams.toString());
    if (startDate) sp.set("startAt", startDate);
    if (endDate) sp.set("endAt", endDate);
    if (status) sp.set("status", status);
    else sp.delete("status");
    sp.set("page", "1");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const handleReset = () => {
    const start = dayjs().startOf("month").format("YYYY-MM-DD");
    const end = dayjs().endOf("month").format("YYYY-MM-DD");
    setStartDate(start);
    setEndDate(end);
    setStatus("");
    const sp = new URLSearchParams();
    sp.set("startAt", start);
    sp.set("endAt", end);
    sp.set("page", "1");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const exportExcel = async () => {
    const params = Object.fromEntries(searchParams.entries());
    const res = await api.get(apiUrl.halaqohReportAttendance, {
      params: { ...params, all: "true" },
    });
    const rows = (res.data?.data?.data || []).map((r: AttendanceRow) => ({
      Tanggal: dayjs(r.date).format("DD/MM/YYYY"),
      Nama: r.user?.name,
      Kelas: r.halaqoh?.title,
      Kategori: r.halaqoh?.category?.title,
      Status: r.status,
      Catatan: r.notes || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Kehadiran");
    XLSX.writeFile(
      wb,
      `Laporan_Kehadiran_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
    );
  };

  const summary = data?.metaData?.summary || {};
  const totalRecords = data?.metaData?.total || 0;

  const columns = useMemo<Column<AttendanceRow>[]>(
    () => [
      {
        header: "Tanggal",
        accessor: "date" as keyof AttendanceRow,
        sortable: true,
        render: (row) => dayjs(row.date).format("DD/MM/YYYY"),
      },
      {
        header: "Nama",
        accessor: "id" as keyof AttendanceRow,
        render: (row) => row.user?.name,
      },
      {
        header: "Kelas",
        accessor: "id" as keyof AttendanceRow,
        render: (row) => row.halaqoh?.title,
      },
      {
        header: "Status",
        accessor: "status" as keyof AttendanceRow,
        sortable: true,
        render: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.status] || "bg-gray-100"}`}
          >
            {row.status}
          </span>
        ),
      },
      {
        header: "Catatan",
        accessor: "notes" as keyof AttendanceRow,
        render: (row) => row.notes || "-",
      },
    ],
    [],
  );

  return (
    <div className="p-4">
      <TitleContent title="Laporan Kehadiran Halaqoh" />

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <TextInput
            label="Tanggal Mulai"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextInput
            label="Tanggal Selesai"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block h-10 w-full px-3 rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm outline-none"
            >
              <option value="">Semua</option>
              <option value="HADIR">Hadir</option>
              <option value="IZIN">Izin</option>
              <option value="SAKIT">Sakit</option>
              <option value="ALPA">Alpa</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition h-10 font-medium"
            >
              Filter
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded shadow transition h-10 font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalRecords}
          </p>
        </div>
        {Object.entries(summary).map(([key, val]) => (
          <div
            key={key}
            className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${key === "HADIR" ? "border-green-600" : key === "IZIN" ? "border-blue-400" : key === "SAKIT" ? "border-yellow-500" : "border-red-600"}`}
          >
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {key}
            </h2>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {val as number}
            </p>
          </div>
        ))}
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
          totalPages={data?.metaData?.totalPage ?? 0}
        />
      </div>
    </div>
  );
}
