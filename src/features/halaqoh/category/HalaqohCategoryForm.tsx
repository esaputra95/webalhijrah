"use client";
import React, { FC, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import ImageUpload from "@/components/ui/inputs/ImageUpload";
import Button from "@/components/ui/buttons/Button";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import {
  HalaqohCategorySchema,
  HalaqohCategoryType as FormType,
} from "@/types/halaqohSchema";
import {
  useCreateHalaqohCategory,
  useUpdateHalaqohCategory,
} from "@/hooks/masters/useHalaqohCategories";
import { HalaqohCategory } from "@/types/halaqoh";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<HalaqohCategory>;
  mode?: "create" | "update" | "view";
};

const HalaqohCategoryForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(HalaqohCategorySchema) as any,
  });

  useEffect(() => {
    if (initialValues) {
      const formattedValues = { ...initialValues };
      if (initialValues.date_test) {
        // datetime-local input expects YYYY-MM-DDTHH:mm
        const dt = new Date(initialValues.date_test);
        formattedValues.date_test = new Date(
          dt.getTime() - dt.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, 16) as unknown as Date;
      }
      reset(formattedValues as FormType);
    }
  }, [initialValues, reset]);

  const create = useCreateHalaqohCategory();
  const update = useUpdateHalaqohCategory();

  const onSubmit: SubmitHandler<FormType> = async (values) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("Kategori berhasil ditambahkan");
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
            toast.success("Kategori berhasil diperbarui");
            onCancel?.();
            reset();
          },
          onError: (error) => toast.error(handleErrorResponse(error)),
        },
      );
    }
  };

  return (
    <form className="space-y-3 overflow-auto" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Judul"
        {...register("title")}
        disabled={mode === "view"}
        errors={errors.title?.message as string}
        required
      />
      <TextInput
        label="Slug"
        {...register("slug")}
        disabled={mode === "view"}
        errors={errors.slug?.message as string}
        required
      />
      <TextInput
        label="Deskripsi"
        {...register("description")}
        disabled={mode === "view"}
        errors={errors.description?.message as string}
      />
      <TextInput
        label="Tanggal & Waktu Tes (Default)"
        type="datetime-local"
        {...register("date_test")}
        disabled={mode === "view"}
        errors={errors.date_test?.message as string}
      />
      <TextInput
        label="Link Google Meet"
        {...register("link_meet")}
        disabled={mode === "view"}
        errors={errors.link_meet?.message as string}
        placeholder="https://meet.google.com/xxx-xxxx-xxx"
      />

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Gambar Cover
        </label>
        <ImageUpload
          value={watch("image")}
          onChange={(val) => setValue("image", val)}
          disabled={mode === "view"}
          errors={errors.image?.message as string}
        />
      </div>

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

export default HalaqohCategoryForm;
