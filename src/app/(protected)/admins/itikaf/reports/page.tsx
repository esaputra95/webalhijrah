"use client";

import React, { Suspense, useState } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import { toast } from "react-toastify";
import { Table, Column } from "@/components/ui/tables/Table";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { FiDownload } from "react-icons/fi";
import TextInput from "@/components/ui/inputs/TextInput";
import Button from "@/components/ui/buttons/Button";
import { HiFunnel } from "react-icons/hi2";
import { HiX } from "react-icons/hi";

interface Itikaf {
  id: number;
  name: string;
  phone: string;
  gender: string;
  umur: number;
  address: string;
  createdAt: string;
}

interface MetaData {
  total: number;
  ikhwan: number;
  akhwat: number;
  page: number;
  limit: number;
  totalPage: number;
  summary: {
    total: number;
    ikhwan: number;
    akhwat: number;
  };
}

interface ReportResponse {
  ok: boolean;
  data: {
    data: Itikaf[];
    metaData: MetaData;
  };
}

const ReportContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const gender = searchParams.get("gender") || "";
  const [startDate, setStartDate] = useState(searchParams.get("startAt") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endAt") || "");

  const { data: reportData, isLoading } = useQuery<ReportResponse["data"]>({
    queryKey: ["itikaf-report-page", searchParams.toString()],
    queryFn: async () => {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get(apiUrl.itikafReport, { params });
      return res.data.data;
    },
  });

  const participants = reportData?.data || [];
  const summary = reportData?.metaData?.summary || {
    total: 0,
    ikhwan: 0,
    akhwat: 0,
  };

  const handleFilter = () => {
    const sp = new URLSearchParams(searchParams.toString());
    if (startDate) sp.set("startAt", startDate);
    else sp.delete("startAt");

    if (endDate) sp.set("endAt", endDate);
    else sp.delete("endAt");

    sp.set("page", "1");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    router.replace(pathname);
  };

  const exportExcel = async () => {
    try {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get(apiUrl.itikafReport, {
        params: { ...params, all: "true" },
      });
      const allData: Itikaf[] = res.data.data.data;

      const rows = allData.map((r, index) => ({
        No: index + 1,
        Nama: r.name,
        Gender: r.gender === "Laki-laki" ? "Ikhwan" : "Akhwat",
        WhatsApp: r.phone,
        Usia: r.umur + " Tahun",
        Alamat: r.address,
        Tanggal: dayjs(r.createdAt).format("DD/MM/YYYY HH:mm"),
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Itikaf");
      XLSX.writeFile(
        wb,
        `Laporan_Itikaf_${dayjs().format("YYYYMMDD_HHmm")}.xlsx`,
      );
      toast.success("Excel berhasil diunduh");
    } catch (error) {
      console.error(error);
      toast.error("Gagal export excel");
    }
  };

  const columns: Column<Itikaf>[] = [
    {
      header: "TANGGAL",
      accessor: "createdAt",
      sortable: true,
      render: (row) => dayjs(row.createdAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      header: "NAMA",
      accessor: "name",
      sortable: true,
    },
    {
      header: "JK",
      accessor: "gender",
      render: (row) => (row.gender === "Laki-laki" ? "Ikhwan" : "Akhwat"),
    },
    {
      header: "WHATSAPP",
      accessor: "phone",
    },
    {
      header: "USIA",
      accessor: "umur",
      render: (row) => `${row.umur} Thn`,
    },
    {
      header: "ALAMAT",
      accessor: "address",
      className: "max-w-[200px] truncate",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <TitleContent title="Laporan Pendaftar Itikaf" />
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={exportExcel}
            className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition shadow-sm"
          >
            <FiDownload />
            Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-brand-brown">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Total Pendaftar
          </p>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {summary.total}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Ikhwan
          </p>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {summary.ikhwan}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pink-500">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Akhwat
          </p>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {summary.akhwat}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Filter Gender
            </label>
            <select
              value={gender}
              onChange={(e) => {
                const val = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (val) params.set("gender", val);
                else params.delete("gender");
                params.set("page", "1");
                router.push(`?${params.toString()}`);
              }}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white outline-none h-10 focus:ring-2 focus:ring-brand-brown/20"
            >
              <option value="">Semua Gender</option>
              <option value="Laki-laki">Ikhwan</option>
              <option value="Perempuan">Akhwat</option>
            </select>
          </div>
          <div className="flex gap-2 h-10">
            <Button onClick={handleFilter}>
              <HiFunnel className="w-5 h-5" />
              Filter
            </Button>
            <Button onClick={handleReset}>
              <HiX className="w-5 h-5" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table<Itikaf>
          data={participants}
          columns={columns}
          isLoading={isLoading}
          totalPages={reportData?.metaData?.totalPage || 0}
        />
      </div>
    </div>
  );
};

export default function ReportItikafPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}
