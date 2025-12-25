"use client";
import React, { Suspense, useEffect, useState } from "react";
import HeaderModal from "@/components/ui/modals/Header";
import Modal from "@/components/ui/modals/Modal";
import TitleContent from "@/components/layouts/TitleContent";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import Swal from "sweetalert2";
import SettingTable from "@/features/settings/SettingTable";
import SettingForm from "@/features/settings/SettingForm";
import { useSettings, useDeleteSetting } from "@/hooks/masters/useSettings";
import { SettingType } from "@/types/settingSchema";

const SettingsContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<SettingType>>({});
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const { data, isLoading, isError } = useSettings();
  const deleteMutation = useDeleteSetting();

  useEffect(() => {
    if (isError) {
      toast.error(
        "Gagal memuat data Settings - " + handleErrorResponse(isError)
      );
    }
  }, [isError]);

  const onAdd = () => {
    setMode("create");
    setDataSelect({});
    setIsModalOpen(true);
  };

  const onUpdate = (data: SettingType) => {
    setMode("update");
    setDataSelect(data);
    setIsModalOpen(true);
  };

  const onDelete = (id: number) => {
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
      preConfirm: async () => {
        try {
          await deleteMutation.mutateAsync({ id });
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
        titleButton="+ Setting"
        title="Pengaturan Sistem"
        onClickButton={onAdd}
      />

      <Modal isOpen={isModalOpen} onClose={onClose}>
        <HeaderModal>
          {mode === "create" ? "Tambah" : mode === "update" ? "Edit" : "Detail"}{" "}
          Setting
        </HeaderModal>
        <div className="p-4">
          <SettingForm
            initialValues={dataSelect}
            onCancel={onClose}
            mode={mode}
          />
        </div>
      </Modal>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <SettingTable
          data={data?.data}
          isLoading={isLoading}
          totalPages={data?.metaData?.totalPage}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
};

export default SettingsPage;
