"use client";
import React, { Suspense, useState, useEffect } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import Modal from "@/components/ui/modals/Modal";
import HeaderModal from "@/components/ui/modals/Header";
import HalaqohCategoryTable from "@/features/halaqoh/category/HalaqohCategoryTable";
import HalaqohCategoryForm from "@/features/halaqoh/category/HalaqohCategoryForm";
import {
  useHalaqohCategories,
  useDeleteHalaqohCategory,
} from "@/hooks/masters/useHalaqohCategories";
import { HalaqohCategory } from "@/types/halaqoh";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { handleErrorResponse } from "@/utils/handleErrorResponse";

const HalaqohCategoriesContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<HalaqohCategory>>();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");

  const { data, isLoading, isError } = useHalaqohCategories();
  const deleteCategory = useDeleteHalaqohCategory();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Kategori - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: HalaqohCategory) => {
    setMode("update");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onView = (data?: HalaqohCategory) => {
    setMode("view");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onDelete = (id?: string | number) => {
    if (!id) return;
    Swal.fire({
      title: "Yakin?",
      text: "Data kategori ini akan dihapus permanen!",
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
          await deleteCategory.mutateAsync({ id });
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
        title="Kategori Halaqoh"
        titleButton="+ Kategori"
        onClickButton={() => {
          setMode("create");
          setDataSelect({});
          setIsModalOpen(true);
        }}
      />

      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>
          {mode === "create" ? "Tambah" : mode === "update" ? "Edit" : "Detail"}{" "}
          Kategori Halaqoh
        </HeaderModal>
        <div className="p-4">
          <HalaqohCategoryForm
            initialValues={dataSelect}
            onCancel={onClose}
            mode={mode}
          />
        </div>
      </Modal>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <HalaqohCategoryTable
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

export default function HalaqohCategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HalaqohCategoriesContent />
    </Suspense>
  );
}
