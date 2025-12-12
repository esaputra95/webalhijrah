"use client";
import HeaderModal from "@/components/ui/modals/Header";
import Modal from "@/components/ui/modals/Modal";
import SliderForm from "@/features/sliders/SliderForm";
import SliderTable from "@/features/sliders/SliderTable";
import { useDeleteSlider, useSliders } from "@/hooks/masters/useSliders";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SliderType } from "@/types/masters/silderSchema";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import Swal from "sweetalert2";
import TitleContent from "@/components/layouts/TitleContent";

const SlidersContent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<SliderType>>();
  const { data, isLoading, isError } = useSliders();
  const deleteSlider = useDeleteSlider();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Slider - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: SliderType) => {
    setIsModalOpen(true);
    setDataSelect(data);
  };

  const onView = (data?: SliderType) => {
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
            deleteSlider.mutate(
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
        titleButton="+ Slider"
        title="Sliders"
        onClickButton={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>Form Slider</HeaderModal>
        <div className="p-4">
          <SliderForm
            initialValues={dataSelect}
            onCancel={onClose}
            mode={
              !dataSelect?.type && !dataSelect?.description
                ? "create"
                : dataSelect?.id
                ? "update"
                : "view"
            }
          />
        </div>
      </Modal>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <SliderTable
          data={data?.data}
          isLoading={isLoading}
          totalPages={0}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onView={onView}
        />
      </div>
    </div>
  );
};

const Sliders = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SlidersContent />
    </Suspense>
  );
};

export default Sliders;
