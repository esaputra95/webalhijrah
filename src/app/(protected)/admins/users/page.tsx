"use client";
import React, { Suspense, useEffect, useState } from "react";
import HeaderModal from "@/components/ui/modals/Header";
import Modal from "@/components/ui/modals/Modal";
import TitleContent from "@/components/layouts/TitleContent";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import Swal from "sweetalert2";
import UserTable from "@/features/users/UserTable";
import UserForm from "@/features/users/UserForm";
import { useUsers, useDeleteUser } from "@/hooks/users/useUsers";
import { UserType } from "@/types/userSchema";
import { FiSearch } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";

const UsersContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSelect, setDataSelect] = useState<Partial<UserType>>({});
  const [mode, setMode] = useState<"create" | "update" | "view">("create");

  // Pagination & Search state handled by Table and useGetParams implicitly
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchVal = searchParams.get("q") || searchParams.get("search") || "";
  const { data, isLoading, isError } = useUsers();
  const deleteMutation = useDeleteUser();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Users - " + handleErrorResponse(isError));
    }
  }, [isError]);

  const onAdd = () => {
    setMode("create");
    setDataSelect({});
    setIsModalOpen(true);
  };

  const onUpdate = (user: UserType) => {
    setMode("update");
    setDataSelect(user);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const url = new URL(window.location.href);
    if (val) {
      url.searchParams.set("q", val);
    } else {
      url.searchParams.delete("q");
    }
    url.searchParams.set("page", "1");
    router.replace(url.toString(), { scroll: false });
  };

  return (
    <div className="p-4 space-y-4">
      <TitleContent
        titleButton="+ User"
        title="Daftar Pengguna"
        onClickButton={onAdd}
      />

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama, email, role..."
              className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-sans bg-slate-50 focus:bg-white"
              value={searchVal}
              onChange={handleSearch}
            />
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={onClose}>
          <HeaderModal>
            {mode === "create"
              ? "Tambah"
              : mode === "update"
                ? "Edit"
                : "Detail"}{" "}
            User
          </HeaderModal>
          <div className="p-4">
            <UserForm
              initialValues={dataSelect}
              onCancel={onClose}
              mode={mode}
            />
          </div>
        </Modal>

        <div className="relative overflow-x-auto shadow-sm sm:rounded-lg border border-slate-100">
          <UserTable
            data={data?.data}
            isLoading={isLoading}
            totalPages={data?.metaData?.totalPage}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

const UsersPage = () => {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">Memuat halaman...</div>
      }
    >
      <UsersContent />
    </Suspense>
  );
};

export default UsersPage;
