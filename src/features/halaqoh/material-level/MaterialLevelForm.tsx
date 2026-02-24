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
  HalaqohMaterialLevelSchema,
  HalaqohMaterialLevelType as FormType,
} from "@/types/halaqohSchema";
import {
  useCreateHalaqohMaterialLevel,
  useUpdateHalaqohMaterialLevel,
} from "@/hooks/masters/useHalaqohMaterialLevels";
import { useHalaqohCategories } from "@/hooks/masters/useHalaqohCategories";
import { HalaqohMaterialLevel } from "@/types/halaqoh";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<HalaqohMaterialLevel>;
  mode?: "create" | "update" | "view";
};

const MaterialLevelForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(HalaqohMaterialLevelSchema) as any,
  });

  const { data: categoryData } = useHalaqohCategories();

  const categoryOptions = React.useMemo(() => {
    return (categoryData?.data || []).map((c) => ({
      label: c.title,
      value: c.id,
    }));
  }, [categoryData]);

  useEffect(() => {
    if (initialValues) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { category, ...rest } = initialValues;
      reset(rest as FormType);
    }
  }, [initialValues, reset]);

  const create = useCreateHalaqohMaterialLevel();
  const update = useUpdateHalaqohMaterialLevel();

  const onSubmit: SubmitHandler<FormType> = async (values) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("Tingkatan materi berhasil ditambahkan");
          onCancel?.();
          reset();
        },
        onError: (error) => toast.error(handleErrorResponse(error)),
      });
      return;
    }

    if (values.id) {
      update.mutate(
        { ...values, id: Number(values.id) },
        {
          onSuccess: () => {
            toast.success("Tingkatan materi berhasil diperbarui");
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
        label="Kategori"
        {...register("category_id")}
        disabled={mode === "view" || mode === "update"}
        errors={errors.category_id?.message}
        option={categoryOptions}
        required
      />
      <TextInput
        label="Judul Tingkatan"
        placeholder="Contoh: Buku A, Juz 30"
        {...register("title")}
        disabled={mode === "view"}
        errors={errors.title?.message as string}
        required
      />
      <TextInput
        label="Urutan Level"
        type="number"
        placeholder="1, 2, 3..."
        {...register("level_order")}
        disabled={mode === "view"}
        errors={errors.level_order?.message as string}
        required
      />
      <TextInput
        label="Deskripsi"
        {...register("description")}
        disabled={mode === "view"}
        errors={errors.description?.message as string}
      />

      <div className="mt-4 flex justify-end gap-2">
        <Button
          onClick={onCancel}
          type="button"
          color="error"
          variant="outlined"
        >
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

export default MaterialLevelForm;
