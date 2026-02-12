"use client";
import React, { Suspense, useState, useEffect } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import Modal from "@/components/ui/modals/Modal";
import HeaderModal from "@/components/ui/modals/Header";
import HalaqohMentorTable from "@/features/halaqoh/mentor/HalaqohMentorTable";
import HalaqohMentorForm from "@/features/halaqoh/mentor/HalaqohMentorForm";
import {
  useHalaqohMentors,
  useDeleteHalaqohMentor,
} from "@/hooks/masters/useHalaqohMentors";
import { HalaqohMentor } from "@/types/halaqoh";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { handleErrorResponse } from "@/utils/handleErrorResponse";

const HalaqohMentorsContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<HalaqohMentor>>();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");

  const { data, isLoading, isError } = useHalaqohMentors();
  const deleteMentor = useDeleteHalaqohMentor();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Pembimbing - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: HalaqohMentor) => {
    setMode("update");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onView = (data?: HalaqohMentor) => {
    setMode("view");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onDelete = (id?: string | number) => {
    if (!id) return;
    Swal.fire({
      title: "Yakin?",
      text: "Data pembimbing ini akan dihapus permanen!",
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
          await deleteMentor.mutateAsync({ id });
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
        title="Pembimbing Halaqoh"
        titleButton="+ Pembimbing"
        onClickButton={() => {
          setMode("create");
          setDataSelect({});
          setIsModalOpen(true);
        }}
      />

      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>
          {mode === "create" ? "Tambah" : mode === "update" ? "Edit" : "Detail"}{" "}
          Pembimbing Halaqoh
        </HeaderModal>
        <div className="p-4">
          <HalaqohMentorForm
            initialValues={dataSelect}
            onCancel={onClose}
            mode={mode}
          />
        </div>
      </Modal>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <HalaqohMentorTable
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

export default function HalaqohMentorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HalaqohMentorsContent />
    </Suspense>
  );
}
