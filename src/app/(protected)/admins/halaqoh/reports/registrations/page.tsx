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

type RegistrationRow = {
  id: number;
  status: string;
  phone_number: string | null;
  gender: string | null;
  test_score: number | null;
  notes: string | null;
  created_at: string | null;
  user: { name: string; email: string };
  category: { title: string };
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  TESTING: "bg-purple-100 text-purple-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};

export default function RegistrationReportPage() {
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
    queryKey: ["halaqoh-report-registrations", searchParams.toString()],
    queryFn: async () => {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get(apiUrl.halaqohReportRegistrations, { params });
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
    const res = await api.get(apiUrl.halaqohReportRegistrations, {
      params: { ...params, all: "true" },
    });
    const rows = (res.data?.data?.data || []).map((r: RegistrationRow) => ({
      Nama: r.user?.name,
      Email: r.user?.email,
      Kategori: r.category?.title,
      "No. HP": r.phone_number || "-",
      Gender: r.gender || "-",
      Status: r.status,
      "Skor Tes": r.test_score ?? "-",
      "Tanggal Daftar": r.created_at
        ? dayjs(r.created_at).format("DD/MM/YYYY")
        : "-",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Registrasi");
    XLSX.writeFile(
      wb,
      `Laporan_Registrasi_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
    );
  };

  const summary = data?.metaData?.summary || {};
  const totalRecords = data?.metaData?.total || 0;
  const avgTestScore = data?.metaData?.avgTestScore || 0;

  const columns = useMemo<Column<RegistrationRow>[]>(
    () => [
      {
        header: "Nama",
        accessor: "id" as keyof RegistrationRow,
        render: (row) => row.user?.name,
      },
      {
        header: "Kategori",
        accessor: "id" as keyof RegistrationRow,
        render: (row) => row.category?.title,
      },
      {
        header: "No. HP",
        accessor: "phone_number" as keyof RegistrationRow,
        render: (row) => row.phone_number || "-",
      },
      {
        header: "Gender",
        accessor: "gender" as keyof RegistrationRow,
        render: (row) => row.gender || "-",
      },
      {
        header: "Status",
        accessor: "status" as keyof RegistrationRow,
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
        header: "Skor Tes",
        accessor: "test_score" as keyof RegistrationRow,
        sortable: true,
        render: (row) => (row.test_score !== null ? row.test_score : "-"),
      },
      {
        header: "Tanggal Daftar",
        accessor: "created_at" as keyof RegistrationRow,
        sortable: true,
        render: (row) =>
          row.created_at ? dayjs(row.created_at).format("DD/MM/YYYY") : "-",
      },
    ],
    [],
  );

  return (
    <div className="p-4">
      <TitleContent title="Laporan Registrasi Halaqoh" />

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
              <option value="PENDING">Pending</option>
              <option value="TESTING">Testing</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Pendaftar
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalRecords}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Accepted
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {summary.ACCEPTED || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Pending
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {summary.PENDING || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Rata-rata Skor Tes
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {Number(avgTestScore).toFixed(1)}
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
          totalPages={data?.metaData?.totalPage ?? 0}
        />
      </div>
    </div>
  );
}
