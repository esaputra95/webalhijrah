"use client";
import React, { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import SelectInput from "@/components/ui/inputs/SelectInput";
import Button from "@/components/ui/buttons/Button";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { useHalaqohClasses } from "@/hooks/masters/useHalaqohClasses";
import { useAssignHalaqohClass } from "@/hooks/masters/useHalaqohParticipants";
import { HalaqohRegistration } from "@/types/halaqoh";

type Props = {
  onCancel?: () => void;
  registration: HalaqohRegistration;
};

type FormValues = {
  halaqoh_id: string;
};

const HalaqohClassPlacementForm: FC<Props> = ({ onCancel, registration }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // Fetch classes for this category
  // NOTE: This usually depends on global useGetParams, but we can pass a temporary override if needed
  // In our system, useHalaqohClasses uses useGetParams.
  // Let's assume we want to see classes for this category specifically.
  const { data: classesData, isLoading: isLoadingClasses } =
    useHalaqohClasses();

  // Filter classes by category locally for safety, although the hook might already filter if search params are set
  const filteredClasses = (classesData?.data || []).filter(
    (c) => c.category_id === registration.category_id,
  );

  const assign = useAssignHalaqohClass();

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    assign.mutate(
      {
        user_id: registration.user_id,
        halaqoh_id: Number(values.halaqoh_id),
      },
      {
        onSuccess: () => {
          toast.success("Jamaah berhasil ditempatkan ke kelas");
          onCancel?.();
        },
        onError: (error) => toast.error(handleErrorResponse(error)),
      },
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-blue-50 p-4 rounded-xl mb-4">
        <h4 className="font-bold text-blue-800 text-sm mb-1">
          Informasi Pendaftar
        </h4>
        <p className="text-xs text-blue-600">Nama: {registration.user?.name}</p>
        <p className="text-xs text-blue-600">
          Program: {registration.category?.title}
        </p>
      </div>

      <SelectInput
        label="Pilih Kelas / Halaqoh"
        {...register("halaqoh_id", { required: "Pilih kelas terlebih dahulu" })}
        errors={errors.halaqoh_id?.message}
        option={[
          { label: "-- Pilih Kelas --", value: "" },
          ...filteredClasses.map((c) => ({
            label: `${c.title} (${c.mentor?.user?.name || "Belum ada mentor"})`,
            value: String(c.id),
          })),
        ]}
        required
      />

      {filteredClasses.length === 0 && !isLoadingClasses && (
        <p className="text-xs text-red-500 italic">
          * Belum ada kelas yang tersedia untuk kategori ini. Silakan buat kelas
          baru di menu Masters.
        </p>
      )}

      <div className="mt-6 flex justify-end gap-2 text-sm">
        <Button
          onClick={onCancel}
          type="button"
          color="error"
          variant="outlined"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={assign.isPending || filteredClasses.length === 0}
        >
          {assign.isPending ? "Memproses..." : "Simpan Penempatan"}
        </Button>
      </div>
    </form>
  );
};

export default HalaqohClassPlacementForm;
