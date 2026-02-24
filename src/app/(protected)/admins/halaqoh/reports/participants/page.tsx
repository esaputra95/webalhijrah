"use client";
import React, { useMemo, useState } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import { Column, Table } from "@/components/ui/tables/Table";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

type ParticipantRow = {
  id: number;
  status: string;
  joined_at: string | null;
  user: { name: string; email: string };
  halaqoh: { title: string; category: { title: string } };
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  GRADUATED: "bg-blue-100 text-blue-800",
  DROPPED: "bg-red-100 text-red-800",
};

export default function ParticipantReportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(searchParams.get("status") || "");

  const { data, isLoading } = useQuery({
    queryKey: ["halaqoh-report-participants", searchParams.toString()],
    queryFn: async () => {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get(apiUrl.halaqohReportParticipants, { params });
      return res.data.data;
    },
  });

  const handleFilter = () => {
    const sp = new URLSearchParams(searchParams.toString());
    if (status) sp.set("status", status);
    else sp.delete("status");
    sp.set("page", "1");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const handleReset = () => {
    setStatus("");
    router.replace(pathname);
  };

  const exportExcel = async () => {
    const params = Object.fromEntries(searchParams.entries());
    const res = await api.get(apiUrl.halaqohReportParticipants, {
      params: { ...params, all: "true" },
    });
    const rows = (res.data?.data?.data || []).map((r: ParticipantRow) => ({
      Nama: r.user?.name,
      Email: r.user?.email,
      Kelas: r.halaqoh?.title,
      Kategori: r.halaqoh?.category?.title,
      Status: r.status,
      "Tanggal Bergabung": r.joined_at
        ? dayjs(r.joined_at).format("DD/MM/YYYY")
        : "-",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Peserta");
    XLSX.writeFile(
      wb,
      `Laporan_Peserta_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
    );
  };

  const summary = data?.metaData?.summary || {};

  const columns = useMemo<Column<ParticipantRow>[]>(
    () => [
      {
        header: "Nama",
        accessor: "id" as keyof ParticipantRow,
        render: (row) => row.user?.name,
      },
      {
        header: "Email",
        accessor: "id" as keyof ParticipantRow,
        render: (row) => row.user?.email,
      },
      {
        header: "Kelas",
        accessor: "id" as keyof ParticipantRow,
        render: (row) => row.halaqoh?.title,
      },
      {
        header: "Kategori",
        accessor: "id" as keyof ParticipantRow,
        render: (row) => row.halaqoh?.category?.title,
      },
      {
        header: "Status",
        accessor: "status" as keyof ParticipantRow,
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
        header: "Tanggal Bergabung",
        accessor: "joined_at" as keyof ParticipantRow,
        sortable: true,
        render: (row) =>
          row.joined_at ? dayjs(row.joined_at).format("DD/MM/YYYY") : "-",
      },
    ],
    [],
  );

  return (
    <div className="p-4">
      <TitleContent title="Laporan Peserta Halaqoh" />

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block h-10 w-full px-3 rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm outline-none"
            >
              <option value="">Semua</option>
              <option value="ACTIVE">Active</option>
              <option value="GRADUATED">Graduated</option>
              <option value="DROPPED">Dropped</option>
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
            Total
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {data?.metaData?.total || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Active
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {summary.ACTIVE || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-400">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Graduated
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {summary.GRADUATED || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Dropped
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {summary.DROPPED || 0}
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
