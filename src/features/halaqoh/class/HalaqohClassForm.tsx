"use client";
import React, { FC, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import SelectInput from "@/components/ui/inputs/SelectInput";
import Button from "@/components/ui/buttons/Button";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { HalaqohSchema, HalaqohType as FormType } from "@/types/halaqohSchema";
import {
  useCreateHalaqohClass,
  useUpdateHalaqohClass,
} from "@/hooks/masters/useHalaqohClasses";
import { useHalaqohCategories } from "@/hooks/masters/useHalaqohCategories";
import { useHalaqohMentors } from "@/hooks/masters/useHalaqohMentors";
import { Halaqoh } from "@/types/halaqoh";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<Halaqoh>;
  mode?: "create" | "update" | "view";
};

const HalaqohClassForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(HalaqohSchema) as any,
    defaultValues: {
      location_type: "ONLINE",
      status: "OPEN",
    },
  });

  const { data: categoryData } = useHalaqohCategories();
  const { data: mentorData } = useHalaqohMentors();

  const categoryOptions = React.useMemo(() => {
    return (categoryData?.data || []).map((c) => ({
      label: c.title,
      value: c.id,
    }));
  }, [categoryData]);

  const mentorOptions = React.useMemo(() => {
    return (mentorData?.data || []).map((m) => ({
      label: m.user?.name || `Mentor #${m.id}`,
      value: m.id,
    }));
  }, [mentorData]);

  useEffect(() => {
    if (initialValues) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { category, mentor, ...rest } = initialValues;
      reset(rest as FormType);
    }
  }, [initialValues, reset]);

  const create = useCreateHalaqohClass();
  const update = useUpdateHalaqohClass();

  const onSubmit: SubmitHandler<FormType> = async (values) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("Halaqoh berhasil dibuat");
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
            toast.success("Halaqoh berhasil diperbarui");
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
      <TextInput
        label="Judul Kelas"
        {...register("title")}
        disabled={mode === "view"}
        errors={errors.title?.message}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SelectInput
          label="Kategori"
          {...register("category_id")}
          disabled={mode === "view"}
          errors={errors.category_id?.message}
          option={categoryOptions}
          required
        />
        <SelectInput
          label="Pembimbing"
          {...register("mentor_id")}
          disabled={mode === "view"}
          errors={errors.mentor_id?.message}
          option={mentorOptions}
          required
        />
      </div>

      <TextInput
        label="Informasi Jadwal"
        placeholder="Contoh: Setiap Sabtu, 08:00 - 10:00"
        {...register("schedule_info")}
        disabled={mode === "view"}
        errors={errors.schedule_info?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SelectInput
          label="Tipe Lokasi"
          {...register("location_type")}
          disabled={mode === "view"}
          errors={errors.location_type?.message}
          option={[
            { label: "ONLINE", value: "ONLINE" },
            { label: "OFFLINE", value: "OFFLINE" },
          ]}
        />
        <SelectInput
          label="Status Pendaftaran"
          {...register("status")}
          disabled={mode === "view"}
          errors={errors.status?.message}
          option={[
            { label: "OPEN", value: "OPEN" },
            { label: "CLOSED", value: "CLOSED" },
          ]}
        />
      </div>

      <TextInput
        label="Link Meeting (GMeet/Zoom)"
        {...register("meeting_link")}
        disabled={mode === "view"}
        errors={errors.meeting_link?.message}
      />

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

export default HalaqohClassForm;
