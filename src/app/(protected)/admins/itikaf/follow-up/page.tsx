"use client";

import React, { Suspense, useState } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import { toast } from "react-toastify";
import { Table, Column } from "@/components/ui/tables/Table";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  createdAt: string;
}

interface ReportResponse {
  ok: boolean;
  data: {
    data: Itikaf[];
    metaData: {
      total: number;
      totalPage: number;
    };
  };
}

const FollowUpContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const gender = searchParams.get("gender") || "";
  const [startDate, setStartDate] = useState(searchParams.get("startAt") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endAt") || "");

  const [message, setMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { data: reportData, isLoading } = useQuery<ReportResponse["data"]>({
    queryKey: ["itikaf-report-followup", searchParams.toString()],
    queryFn: async () => {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get(apiUrl.itikafReport, {
        params: { ...params, limit: 1000 },
      });
      return res.data.data;
    },
  });

  const followUpMutation = useMutation({
    mutationFn: async (payload: { targets: string[]; message: string }) =>
      (await api.post(apiUrl.itikafFollowUp, payload)).data,
  });

  const participants = reportData?.data || [];

  const toggleSelectAll = () => {
    if (selectedIds.size === participants.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(participants.map((p) => p.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
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

  const handleSend = async () => {
    if (selectedIds.size === 0) {
      toast.warning("Pilih minimal satu pendaftar");
      return;
    }
    if (!message) {
      toast.warning("Isi pesan terlebih dahulu");
      return;
    }

    const targets = participants
      .filter((p) => selectedIds.has(p.id))
      .map((p) => p.phone)
      .filter((phone) => !!phone);

    if (targets.length === 0) {
      toast.error("Pendaftar yang dipilih tidak memiliki nomor WhatsApp");
      return;
    }

    try {
      await followUpMutation.mutateAsync({ targets, message });
      toast.success("Pesan sedang dikirim!");
      setMessage("");
      setSelectedIds(new Set());
    } catch (error) {
      toast.error("Gagal mengirim pesan");
      console.error(error);
    }
  };

  const columns: Column<Itikaf>[] = [
    {
      header: "#",
      accessor: "id",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.id)}
          onChange={() => toggleSelect(row.id)}
          className="rounded border-gray-300 text-brand-brown focus:ring-brand-brown"
        />
      ),
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
  ];

  return (
    <div className="p-6 space-y-6">
      <TitleContent title="Follow Up Pendaftar Itikaf" />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pesan WhatsApp Massal
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis pesan yang akan dikirim ke pendaftar yang dipilih..."
            className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <TextInput
            label="Mulai Dari"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextInput
            label="Sampai Dengan"
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
              className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white outline-none h-10 focus:ring-2 focus:ring-brand-gold/50"
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

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSend}
            disabled={followUpMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition disabled:bg-slate-300 shadow-md"
          >
            {followUpMutation.isPending
              ? "Mengirim..."
              : `Kirim ke ${selectedIds.size} Pendaftar`}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">
            Daftar Pendaftar ({participants.length})
          </h3>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={
                selectedIds.size === participants.length &&
                participants.length > 0
              }
              onChange={toggleSelectAll}
              className="rounded border-gray-300 text-brand-brown focus:ring-brand-brown"
            />
            {selectedIds.size === participants.length && participants.length > 0
              ? "Batal Pilih Semua"
              : "Pilih Semua Pendaftar"}
          </label>
        </div>

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

export default function FollowUpItikafPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <FollowUpContent />
    </Suspense>
  );
}
