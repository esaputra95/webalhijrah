"use client";
import HeaderModal from "@/components/ui/modals/Header";
import Modal from "@/components/ui/modals/Modal";
import ProgramCategoryForm from "@/features/program-categories/ProgramCategoryForm";
import ProgramCategoryTable from "@/features/program-categories/ProgramCategoryTable";
import {
  useDeleteProgramCategory,
  useProgramCategories,
} from "@/hooks/masters/useProgramCategories";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProgramCategoryType } from "@/types/programCategorySchema";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import Swal from "sweetalert2";
import TitleContent from "@/components/layouts/TitleContent";

const ProgramCategoriesContent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<ProgramCategoryType>>();
  const { data, isLoading, isError } = useProgramCategories();
  const deleteCategory = useDeleteProgramCategory();

  useEffect(() => {
    if (isError) {
      toast.error(
        "Gagal memuat data Kategori Program - " + handleErrorResponse(isError)
      );
    }
  }, [isError]);

  const onUpdate = (data?: ProgramCategoryType) => {
    setIsModalOpen(true);
    setDataSelect(data);
  };

  const onView = (data?: ProgramCategoryType) => {
    setIsModalOpen(true);
    setDataSelect(data);
  };

  const onDelete = (id?: string) => {
    if (!id) return;
    Swal.fire({
      title: "Yakin?",
      text: "Data ini akan dihapus permanen!",
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
          await new Promise<void>((resolve, reject) => {
            deleteCategory.mutate(
              { id },
              {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
              }
            );
          });
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
        titleButton="+ Kategori"
        title="Kategori Program"
        onClickButton={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>Form Kategori Program</HeaderModal>
        <div className="p-4">
          <ProgramCategoryForm
            initialValues={dataSelect}
            onCancel={onClose}
            mode={
              !dataSelect?.title ? "create" : dataSelect?.id ? "update" : "view"
            }
          />
        </div>
      </Modal>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <ProgramCategoryTable
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

const ProgramCategories = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProgramCategoriesContent />
    </Suspense>
  );
};

export default ProgramCategories;
