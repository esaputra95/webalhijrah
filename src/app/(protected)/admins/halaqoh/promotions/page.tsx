"use client";
import React, { Suspense, useState, FC } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import PromotionTable from "@/features/halaqoh/promotion/PromotionTable";
import PromotionForm from "@/features/halaqoh/promotion/PromotionForm";
import { useHalaqohPromotions } from "@/hooks/masters/useHalaqohPromotions";
import Button from "@/components/ui/buttons/Button";
import { FiUsers, FiArrowLeft, FiUserPlus } from "react-icons/fi";
import BulkPromotionForm from "@/features/halaqoh/promotion/BulkPromotionForm";

const PromotionsContent = () => {
  const [mode, setMode] = useState<"list" | "single" | "bulk">("list");
  const { data, isLoading } = useHalaqohPromotions();

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between border-b border-slate-100 items-end py-2">
        <TitleContent
          title={
            mode === "list"
              ? "Riwayat Perpindahan Kelas"
              : mode === "single"
                ? "Proses Perpindahan Individual"
                : "Proses Perpindahan Massal"
          }
          subTitle={
            mode === "list"
              ? "Kelola perpindahan antar kelas dan kenaikan tingkatan materi peserta."
              : "Silakan pilih asal kelas dan tentukan tujuan perpindahan."
          }
        />
        <div className="pb-2">
          {mode === "list" ? (
            <div className="flex gap-2">
              <Button
                size="small"
                variant="outlined"
                onClick={() => setMode("single")}
              >
                <FiUserPlus className="mr-1" /> Individual
              </Button>
              <Button size="small" onClick={() => setMode("bulk")}>
                <FiUsers className="mr-1" /> Proses Massal
              </Button>
            </div>
          ) : (
            <Button
              size="small"
              variant="outlined"
              onClick={() => setMode("list")}
            >
              <FiArrowLeft className="mr-1" /> Kembali
            </Button>
          )}
        </div>
      </div>

      {mode === "list" && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
          <PromotionTable
            data={data?.data}
            isLoading={isLoading}
            totalPages={data?.metaData?.totalPage}
          />
        </div>
      )}

      {mode === "single" && (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 max-w-2xl mx-auto shadow-sm">
          <PromotionForm onCancel={() => setMode("list")} />
        </div>
      )}

      {mode === "bulk" && (
        <BulkPromotionForm onCancel={() => setMode("list")} />
      )}
    </div>
  );
};

export default function PromotionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromotionsContent />
    </Suspense>
  );
}
