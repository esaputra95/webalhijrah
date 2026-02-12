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
  HalaqohMentorSchema,
  HalaqohMentorType as FormType,
} from "@/types/halaqohSchema";
import {
  useCreateHalaqohMentor,
  useUpdateHalaqohMentor,
} from "@/hooks/masters/useHalaqohMentors";
import { useUsers } from "@/hooks/masters/useUsers";
import { HalaqohMentor } from "@/types/halaqoh";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<HalaqohMentor>;
  mode?: "create" | "update" | "view";
};

const HalaqohMentorForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(HalaqohMentorSchema) as any,
    defaultValues: {
      is_active: true,
    },
  });

  const { data: userData } = useUsers();
  const userOptions = React.useMemo(() => {
    return (userData?.data || []).map((u) => ({
      label: `${u.name} (${u.email})`,
      value: u.id!,
    }));
  }, [userData]);

  useEffect(() => {
    if (initialValues) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, ...rest } = initialValues;
      reset(rest as FormType);
    }
  }, [initialValues, reset]);

  const create = useCreateHalaqohMentor();
  const update = useUpdateHalaqohMentor();

  const onSubmit: SubmitHandler<FormType> = async (values) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("Pembimbing berhasil ditambahkan");
          onCancel?.();
          reset();
        },
        onError: (error) => toast.error(handleErrorResponse(error)),
      });
      return;
    }

    if (values.id) {
      update.mutate(
        { ...values, id: values.id },
        {
          onSuccess: () => {
            toast.success("Pembimbing berhasil diperbarui");
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
      <SelectInput
        label="Pilih User"
        {...register("user_id")}
        disabled={mode !== "create"}
        errors={errors.user_id?.message}
        option={userOptions}
        required
      />
      <TextInput
        label="Spesialisasi"
        placeholder="Contoh: Tahsin, Tahfidz"
        {...register("specialization")}
        disabled={mode === "view"}
        errors={errors.specialization?.message}
      />
      <TextInput
        label="Bio Singkat"
        {...register("bio")}
        disabled={mode === "view"}
        errors={errors.bio?.message}
      />

      <div className="flex items-center gap-2 py-2">
        <input
          type="checkbox"
          id="is_active"
          {...register("is_active")}
          disabled={mode === "view"}
          className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
        />
        <label
          htmlFor="is_active"
          className="text-sm font-medium text-gray-700"
        >
          Akun Aktif
        </label>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onCancel} type="button" color="error">
          {mode === "view" ? "Tutup" : "Batal"}
        </Button>
        {mode !== "view" && (
          <Button type="submit" disabled={create.isPending || update.isPending}>
            {create.isPending || update.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default HalaqohMentorForm;
