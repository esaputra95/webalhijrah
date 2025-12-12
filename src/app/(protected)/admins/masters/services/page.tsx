"use client";
import HeaderModal from "@/components/ui/modals/Header";
import Modal from "@/components/ui/modals/Modal";
import { ServiceForm, ServiceTable } from "@/features/services";
import { useDeleteService, useServices } from "@/hooks/masters/useServices";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ServiceType as PublicType } from "@/types/serviceSchema";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import Swal from "sweetalert2";
import TitleContent from "@/components/layouts/TitleContent";

const Services = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<PublicType>>();
  const { data, isLoading, isError } = useServices();
  const deleteService = useDeleteService();

  console.log("render Services");

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Service - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: PublicType) => {
    setIsModalOpen(true);
    setDataSelect(data);
  };

  const onView = (data?: PublicType) => {
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
      showLoaderOnConfirm: true, // ← loader di tombol confirm
      allowOutsideClick: () => !Swal.isLoading(), // ← kunci modal saat loading
      preConfirm: async () => {
        try {
          // bungkus mutate ke Promise biar SweetAlert tunggu sampai selesai
          await new Promise<void>((resolve, reject) => {
            deleteService.mutate(
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
        titleButton="+ Layanan"
        onClickButton={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>Form Pengguna</HeaderModal>
        <div className="p-4">
          <ServiceForm
            initialValues={dataSelect}
            onCancel={() => setIsModalOpen(false)}
            mode={
              !dataSelect?.name ? "create" : dataSelect?.id ? "update" : "view"
            }
          />
        </div>
      </Modal>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <ServiceTable
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

export default Services;
