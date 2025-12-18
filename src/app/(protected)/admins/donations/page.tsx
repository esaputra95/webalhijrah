"use client";
import HeaderModal from "@/components/ui/modals/Header";
import Modal from "@/components/ui/modals/Modal";
import { DonationForm, DonationTable } from "@/features/donations";
import {
  useDeleteDonationMaster,
  useDonations,
} from "@/hooks/masters/useDonations";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DonationType } from "@/types/donationSchema";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import Swal from "sweetalert2";
import TitleContent from "@/components/layouts/TitleContent";

const Donations = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<DonationType>>();
  const { data, isLoading, isError } = useDonations();
  const deleteDonation = useDeleteDonationMaster();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Donasi - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: DonationType) => {
    console.log({ data });

    setIsModalOpen(true);
    setDataSelect(data);
  };

  const onView = (data?: DonationType) => {
    setIsModalOpen(true);
    setDataSelect({
      name: data?.name,
    });
  };

  const onDelete = (id?: string) => {
    if (!id) return;
    Swal.fire({
      title: "Yakin?",
      text: "Data ini akan dihapus!",
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
            deleteDonation.mutate(
              { id },
              {
                onSuccess: () => resolve(),
                onError: (error: unknown) => reject(error),
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
        titleButton="+ Donasi"
        onClickButton={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>Form Donasi</HeaderModal>
        <div className="p-4">
          <DonationForm
            initialValues={dataSelect}
            onCancel={() => setIsModalOpen(false)}
            mode={
              !dataSelect?.name ? "create" : dataSelect?.id ? "update" : "view"
            }
          />
        </div>
      </Modal>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <DonationTable
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

export default Donations;
