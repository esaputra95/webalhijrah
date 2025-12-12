"use client";
import { ProgramTable } from "@/features/programs";
import { useDeleteProgram, usePrograms } from "@/hooks/masters/usePrograms";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { ProgramType } from "@/types/programSchema";
import TitleContent from "@/components/layouts/TitleContent";
import { useRouter } from "next/navigation";
import { confirmDelete } from "@/lib/confirmDelete";

const Programs = () => {
  const router = useRouter();
  const { data, isLoading, isError } = usePrograms();
  const deleteProgram = useDeleteProgram();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Program - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: ProgramType) => {
    if (data?.id) {
      router.push(`/admins/programs/${data.id}?mode=update`);
    }
  };

  const onView = (data?: ProgramType) => {
    if (data?.id) {
      router.push(`/admins/programs/${data.id}?mode=view`);
    }
  };

  const onDelete = (id?: number) => {
    if (!id) return;
    confirmDelete(
      () =>
        new Promise<void>((resolve, reject) => {
          deleteProgram.mutate(
            { id },
            {
              onSuccess: () => resolve(),
              onError: (err) => reject(err),
            }
          );
        }),
      {
        text: "Data ini akan dihapus permanen!",
        successMessage: "Data berhasil dihapus!",
      }
    );
  };

  return (
    <div className="p-4">
      <TitleContent
        titleButton="+ Program"
        title="Daftar Program"
        onClickButton={() => router.push("/admins/programs/create")}
      />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <ProgramTable
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

export default Programs;
