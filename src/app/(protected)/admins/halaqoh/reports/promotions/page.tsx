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

type PromotionRow = {
  id: number;
  type: string;
  test_score: number | null;
  notes: string | null;
  promoted_at: string;
  user: { name: string };
  admin: { name: string };
  category: { title: string };
  from_halaqoh: { title: string } | null;
  to_halaqoh: { title: string };
  from_level: { title: string } | null;
  to_level: { title: string };
};

const typeColors: Record<string, string> = {
  PROMOTION: "bg-green-100 text-green-800",
  DEMOTION: "bg-red-100 text-red-800",
  INITIAL_PLACEMENT: "bg-blue-100 text-blue-800",
};

export default function PromotionReportPage() {
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
  const [type, setType] = useState(searchParams.get("type") || "");

  const { data, isLoading } = useQuery({
    queryKey: ["halaqoh-report-promotions", searchParams.toString()],
    queryFn: async () => {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get(apiUrl.halaqohReportPromotions, { params });
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
    if (type) sp.set("type", type);
    else sp.delete("type");
    sp.set("page", "1");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const handleReset = () => {
    const start = dayjs().startOf("month").format("YYYY-MM-DD");
    const end = dayjs().endOf("month").format("YYYY-MM-DD");
    setStartDate(start);
    setEndDate(end);
    setType("");
    const sp = new URLSearchParams();
    sp.set("startAt", start);
    sp.set("endAt", end);
    sp.set("page", "1");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const exportExcel = async () => {
    const params = Object.fromEntries(searchParams.entries());
    const res = await api.get(apiUrl.halaqohReportPromotions, {
      params: { ...params, all: "true" },
    });
    const rows = (res.data?.data?.data || []).map((r: PromotionRow) => ({
      Nama: r.user?.name,
      Kategori: r.category?.title,
      "Dari Kelas": r.from_halaqoh?.title || "-",
      "Ke Kelas": r.to_halaqoh?.title,
      "Dari Level": r.from_level?.title || "-",
      "Ke Level": r.to_level?.title,
      Tipe: r.type,
      "Skor Tes": r.test_score ?? "-",
      "Oleh Admin": r.admin?.name,
      Tanggal: dayjs(r.promoted_at).format("DD/MM/YYYY"),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Kenaikan Level");
    XLSX.writeFile(
      wb,
      `Laporan_Kenaikan_Level_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
    );
  };

  const summary = data?.metaData?.summary || {};
  const avgTestScore = data?.metaData?.avgTestScore || 0;

  const columns = useMemo<Column<PromotionRow>[]>(
    () => [
      {
        header: "Nama",
        accessor: "id" as keyof PromotionRow,
        render: (row) => row.user?.name,
      },
      {
        header: "Dari Kelas",
        accessor: "id" as keyof PromotionRow,
        render: (row) => row.from_halaqoh?.title || "-",
      },
      {
        header: "Ke Kelas",
        accessor: "id" as keyof PromotionRow,
        render: (row) => row.to_halaqoh?.title,
      },
      {
        header: "Dari Level",
        accessor: "id" as keyof PromotionRow,
        render: (row) => row.from_level?.title || "-",
      },
      {
        header: "Ke Level",
        accessor: "id" as keyof PromotionRow,
        render: (row) => row.to_level?.title,
      },
      {
        header: "Tipe",
        accessor: "type" as keyof PromotionRow,
        sortable: true,
        render: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[row.type] || "bg-gray-100"}`}
          >
            {row.type}
          </span>
        ),
      },
      {
        header: "Skor Tes",
        accessor: "test_score" as keyof PromotionRow,
        render: (row) => (row.test_score !== null ? row.test_score : "-"),
      },
      {
        header: "Tanggal",
        accessor: "promoted_at" as keyof PromotionRow,
        sortable: true,
        render: (row) => dayjs(row.promoted_at).format("DD/MM/YYYY"),
      },
    ],
    [],
  );

  return (
    <div className="p-4">
      <TitleContent title="Laporan Kenaikan Level Halaqoh" />

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
            <label className="text-sm font-medium text-gray-700">Tipe</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="block h-10 w-full px-3 rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm outline-none"
            >
              <option value="">Semua</option>
              <option value="PROMOTION">Promotion</option>
              <option value="DEMOTION">Demotion</option>
              <option value="INITIAL_PLACEMENT">Initial Placement</option>
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
            Promotion
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {summary.PROMOTION || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Demotion
          </h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {summary.DEMOTION || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-600">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Rata-rata Skor
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
