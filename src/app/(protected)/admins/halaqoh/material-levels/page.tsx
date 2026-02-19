"use client";
import React, { Suspense, useState, useEffect } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import Modal from "@/components/ui/modals/Modal";
import HeaderModal from "@/components/ui/modals/Header";
import MaterialLevelTable from "@/features/halaqoh/material-level/MaterialLevelTable";
import MaterialLevelForm from "@/features/halaqoh/material-level/MaterialLevelForm";
import {
  useHalaqohMaterialLevels,
  useDeleteHalaqohMaterialLevel,
} from "@/hooks/masters/useHalaqohMaterialLevels";
import { HalaqohMaterialLevel } from "@/types/halaqoh";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { handleErrorResponse } from "@/utils/handleErrorResponse";

const MaterialLevelsContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<HalaqohMaterialLevel>>();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");

  const { data, isLoading, isError } = useHalaqohMaterialLevels();
  const deleteLevel = useDeleteHalaqohMaterialLevel();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Tingkatan Materi - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: HalaqohMaterialLevel) => {
    setMode("update");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onView = (data?: HalaqohMaterialLevel) => {
    setMode("view");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onDelete = (id?: string | number) => {
    if (!id) return;
    Swal.fire({
      title: "Yakin?",
      text: "Data tingkatan ini akan dihapus permanen!",
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
          await deleteLevel.mutateAsync({ id });
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
        title="Tingkatan Materi"
        titleButton="+ Tingkatan"
        onClickButton={() => {
          setMode("create");
          setDataSelect({});
          setIsModalOpen(true);
        }}
      />

      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>
          {mode === "create" ? "Tambah" : mode === "update" ? "Edit" : "Detail"}{" "}
          Tingkatan Materi
        </HeaderModal>
        <div className="p-4">
          <MaterialLevelForm
            initialValues={dataSelect}
            onCancel={onClose}
            mode={mode}
          />
        </div>
      </Modal>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <MaterialLevelTable
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

export default function MaterialLevelsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MaterialLevelsContent />
    </Suspense>
  );
}
