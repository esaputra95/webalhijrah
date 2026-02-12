"use client";
import React, { FC, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import SelectInput from "@/components/ui/inputs/SelectInput";
import Button from "@/components/ui/buttons/Button";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import {
  HalaqohRegistrationSchema,
  HalaqohRegistrationType as FormType,
} from "@/types/halaqohSchema";
import { useUpdateHalaqohRegistration } from "@/hooks/masters/useHalaqohRegistrations";
import { HalaqohRegistration } from "@/types/halaqoh";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<HalaqohRegistration>;
  mode?: "create" | "update" | "view";
};

const HalaqohRegistrationForm: FC<Props> = ({
  onCancel,
  initialValues,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(HalaqohRegistrationSchema) as any,
  });

  useEffect(() => {
    if (initialValues) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, category, ...rest } = initialValues;
      reset(rest as FormType);
    }
  }, [initialValues, reset]);

  const update = useUpdateHalaqohRegistration();

  const onSubmit: SubmitHandler<FormType> = async (values) => {
    if (values.id) {
      update.mutate(
        { ...values, id: values.id },
        {
          onSuccess: () => {
            toast.success("Pendaftaran berhasil diperbarui");
            onCancel?.();
            reset();
          },
          onError: (error) => toast.error(handleErrorResponse(error)),
        },
      );
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-slate-50 p-3 rounded-lg mb-4">
        <p className="text-sm font-semibold text-slate-700">
          Detail Pendaftar:
        </p>
        <p className="text-xs text-slate-600">
          Nama: {initialValues?.user?.name || "N/A"}
        </p>
        <p className="text-xs text-slate-600">
          Email: {initialValues?.user?.email || "N/A"}
        </p>
        <p className="text-xs text-slate-600">
          Program: {initialValues?.category?.title || "N/A"}
        </p>
      </div>

      <SelectInput
        label="Status Pendaftaran"
        {...register("status")}
        disabled={mode === "view"}
        errors={errors.status?.message}
        option={[
          { label: "PENDING", value: "PENDING" },
          { label: "TESTING", value: "TESTING" },
          { label: "ACCEPTED", value: "ACCEPTED" },
          { label: "REJECTED", value: "REJECTED" },
        ]}
        required
      />

      <TextInput
        label="Nilai Tes"
        type="number"
        placeholder="0-100"
        {...register("test_score")}
        disabled={mode === "view"}
        errors={errors.test_score?.message}
      />

      <TextInput
        label="Catatan / Notes"
        {...register("notes")}
        disabled={mode === "view"}
        errors={errors.notes?.message}
      />

      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onCancel} type="button" color="error">
          {mode === "view" ? "Tutup" : "Batal"}
        </Button>
        {mode !== "view" && (
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default HalaqohRegistrationForm;
