"use client";

import React, { Suspense, useState, useMemo, useEffect } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import { useHalaqohCategories } from "@/hooks/masters/useHalaqohCategories";
import {
  useHalaqohRegistrations,
  useFollowUpHalaqoh,
} from "@/hooks/masters/useHalaqohRegistrations";
import { toast } from "react-toastify";
import { Table, Column } from "@/components/ui/tables/Table";
import { HalaqohRegistration } from "@/types/halaqoh";
import { useSearchParams, useRouter } from "next/navigation";

const FollowUpContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") || "";

  const [message, setMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { data: categoriesData } = useHalaqohCategories();
  const { data: registrationsData, isLoading: isLoadingReg } =
    useHalaqohRegistrations();
  const followUpMutation = useFollowUpHalaqoh();

  // Filter registrations locally to show only PENDING and ACCEPTED
  // and handle category filtering if needed (backend already handles category_id from URL)
  const filteredData = useMemo(() => {
    if (!registrationsData?.data) return [];
    return registrationsData.data.filter(
      (reg) => reg.status === "PENDING" || reg.status === "ACCEPTED",
    );
  }, [registrationsData]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((reg) => reg.id)));
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

  const handleSend = async () => {
    if (selectedIds.size === 0) {
      toast.warning("Pilih minimal satu user");
      return;
    }
    if (!message) {
      toast.warning("Isi pesan terlebih dahulu");
      return;
    }

    const targets = filteredData
      .filter((reg) => selectedIds.has(reg.id))
      .map((reg) => reg.phone_number)
      .filter((phone): phone is string => !!phone);

    if (targets.length === 0) {
      toast.error("User yang dipilih tidak memiliki nomor telepon");
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

  const columns: Column<HalaqohRegistration>[] = [
    {
      header: "#",
      accessor: "id",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.id)}
          onChange={() => toggleSelect(row.id)}
          className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
        />
      ),
    },
    {
      header: "Nama",
      accessor: "user",
      render: (row) => row.user?.name || "N/A",
    },
    {
      header: "Program",
      accessor: "category",
      render: (row) => row.category?.title || "N/A",
    },
    {
      header: "Nomor WA",
      accessor: "phone_number",
      render: (row) => row.phone_number || "-",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const colors = {
          PENDING: "bg-yellow-100 text-yellow-700",
          ACCEPTED: "bg-green-100 text-green-700",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${(colors as any)[row.status]}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <TitleContent title="Follow Up Pendaftaran" />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pesan WhatsApp
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis pesan yang akan dikirim..."
            className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div className="flex justify-between items-end gap-4">
          <div className="w-64">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                const val = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (val) params.set("category_id", val);
                else params.delete("category_id");
                params.set("page", "1");
                router.push(`?${params.toString()}`);
              }}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Semua Kategori</option>
              {categoriesData?.data?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSend}
            disabled={followUpMutation.isPending}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:bg-slate-300"
          >
            {followUpMutation.isPending
              ? "Mengirim..."
              : `Kirim Pesan (${selectedIds.size})`}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">
            Daftar Pendaftar (PENDING & ACCEPTED)
          </h3>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={
                selectedIds.size === filteredData.length &&
                filteredData.length > 0
              }
              onChange={toggleSelectAll}
              className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            {selectedIds.size === filteredData.length && filteredData.length > 0
              ? "Batal Pilih Semua"
              : "Pilih Semua"}
          </label>
        </div>

        <Table
          data={filteredData}
          columns={columns}
          isLoading={isLoadingReg}
          totalPages={registrationsData?.metaData?.totalPage || 0}
        />
      </div>
    </div>
  );
};

export default function FollowUpPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <FollowUpContent />
    </Suspense>
  );
}
