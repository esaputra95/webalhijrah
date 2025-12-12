"use client";
import HeaderModal from "@/components/ui/modals/Header";
import Modal from "@/components/ui/modals/Modal";
import { TermForm, TermTable } from "@/features/terms";
import { useDeleteTerm, useTerms } from "@/hooks/masters/useTerms";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TermType } from "@/types/termSchema";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import Swal from "sweetalert2";
import TitleContent from "@/components/layouts/TitleContent";

const Terms = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<TermType>>();
  const { data, isLoading, isError } = useTerms();
  const deleteTerm = useDeleteTerm();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Term - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: TermType) => {
    setIsModalOpen(true);
    setDataSelect(data);
  };

  const onView = (data?: TermType) => {
    setIsModalOpen(true);
    setDataSelect({
      name: data?.name,
    });
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
            deleteTerm.mutate(
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
        titleButton="+ Term"
        onClickButton={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>Form Term</HeaderModal>
        <div className="p-4">
          <TermForm
            initialValues={dataSelect}
            onCancel={() => setIsModalOpen(false)}
            mode={
              !dataSelect?.name ? "create" : dataSelect?.id ? "update" : "view"
            }
          />
        </div>
      </Modal>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <TermTable
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

export default Terms;
