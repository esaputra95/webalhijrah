"use client";
import React, { Suspense, useState, useEffect } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import Modal from "@/components/ui/modals/Modal";
import HeaderModal from "@/components/ui/modals/Header";
import HalaqohClassTable from "@/features/halaqoh/class/HalaqohClassTable";
import HalaqohClassForm from "@/features/halaqoh/class/HalaqohClassForm";
import {
  useHalaqohClasses,
  useDeleteHalaqohClass,
} from "@/hooks/masters/useHalaqohClasses";
import { Halaqoh } from "@/types/halaqoh";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { handleErrorResponse } from "@/utils/handleErrorResponse";

const HalaqohClassesContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<Halaqoh>>();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");

  const { data, isLoading, isError } = useHalaqohClasses();
  const deleteHalaqoh = useDeleteHalaqohClass();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Kelas - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: Halaqoh) => {
    setMode("update");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onView = (data?: Halaqoh) => {
    setMode("view");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onDelete = (id?: string | number) => {
    if (!id) return;
    Swal.fire({
      title: "Yakin?",
      text: "Data kelas ini akan dihapus permanen!",
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
          await deleteHalaqoh.mutateAsync({ id });
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
      <TitleContent
        title="Grup Kelas Halaqoh"
        titleButton="+ Grup Kelas"
        onClickButton={() => {
          setMode("create");
          setDataSelect({});
          setIsModalOpen(true);
        }}
      />

      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>
          {mode === "create" ? "Tambah" : mode === "update" ? "Edit" : "Detail"}{" "}
          Grup Kelas Halaqoh
        </HeaderModal>
        <div className="p-4">
          <HalaqohClassForm
            initialValues={dataSelect}
            onCancel={onClose}
            mode={mode}
          />
        </div>
      </Modal>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <HalaqohClassTable
          data={data?.data}
          isLoading={isLoading}
          totalPages={data?.metaData?.totalPage}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onView={onView}
        />
      </div>
    </div>
  );
};

export default function HalaqohClassesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HalaqohClassesContent />
    </Suspense>
  );
}
