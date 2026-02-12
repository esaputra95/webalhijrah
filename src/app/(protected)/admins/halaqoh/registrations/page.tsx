"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TitleContent from "@/components/layouts/TitleContent";
import Modal from "@/components/ui/modals/Modal";
import HeaderModal from "@/components/ui/modals/Header";
import HalaqohRegistrationTable from "@/features/halaqoh/registration/HalaqohRegistrationTable";
import HalaqohRegistrationForm from "@/features/halaqoh/registration/HalaqohRegistrationForm";
import HalaqohClassPlacementForm from "@/features/halaqoh/registration/HalaqohClassPlacementForm";
import {
  useHalaqohRegistrations,
  useDeleteHalaqohRegistration,
} from "@/hooks/masters/useHalaqohRegistrations";
import { HalaqohRegistration } from "@/types/halaqoh";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { handleErrorResponse } from "@/utils/handleErrorResponse";

const HalaqohRegistrationsContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<HalaqohRegistration>>();
  const [mode, setMode] = useState<"update" | "view">("view");

  const { data, isLoading, isError } = useHalaqohRegistrations();
  const deleteRegistration = useDeleteHalaqohRegistration();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPlaced = searchParams.get("is_placed") || "";

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Pendaftaran - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: HalaqohRegistration) => {
    setMode("update");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onView = (data?: HalaqohRegistration) => {
    setMode("view");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onPlacement = (data: HalaqohRegistration) => {
    setDataSelect(data);
    setIsPlacementModalOpen(true);
  };

  const onDelete = (id?: string | number) => {
    if (!id) return;
    Swal.fire({
      title: "Yakin?",
      text: "Data pendaftaran ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e42c2c",
      cancelButtonColor: "#3278A0",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          await deleteRegistration.mutateAsync({ id });
        } catch (err) {
          Swal.showValidationMessage(handleErrorResponse(err));
        }
      },
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    });
  };

  const onClose = () => {
    setIsModalOpen(false);
    setDataSelect({});
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <TitleContent title="Pendaftaran Halaqoh" />
        <div className="flex gap-2">
          <select
            className="text-sm border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-brand-gold/50"
            onChange={(e) => {
              const val = e.target.value;
              const params = new URLSearchParams(searchParams.toString());
              if (val) {
                params.set("is_placed", val);
              } else {
                params.delete("is_placed");
              }
              router.push(`?${params.toString()}`);
            }}
            value={isPlaced}
          >
            <option value="">Semua Penempatan</option>
            <option value="false">Belum Ditempatkan</option>
            <option value="true">Sudah Ditempatkan</option>
          </select>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>
          {mode === "update" ? "Edit" : "Detail"} Pendaftaran Halaqoh
        </HeaderModal>
        <div className="p-4">
          <HalaqohRegistrationForm
            initialValues={dataSelect}
            onCancel={onClose}
            mode={mode}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isPlacementModalOpen}
        onClose={() => setIsPlacementModalOpen(false)}
      >
        <HeaderModal>Penempatan Kelas Halaqoh</HeaderModal>
        <div className="p-4">
          {dataSelect && (
            <HalaqohClassPlacementForm
              registration={dataSelect as HalaqohRegistration}
              onCancel={() => setIsPlacementModalOpen(false)}
            />
          )}
        </div>
      </Modal>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <HalaqohRegistrationTable
          data={data?.data}
          isLoading={isLoading}
          totalPages={data?.metaData?.totalPage}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onView={onView}
          onPlacement={onPlacement}
        />
      </div>
    </div>
  );
};

export default function HalaqohRegistrationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HalaqohRegistrationsContent />
    </Suspense>
  );
}
