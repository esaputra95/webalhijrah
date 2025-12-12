"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import { useCreateTerm, useUpdateTerm } from "@/hooks/masters/useTerms";
import { toast } from "react-toastify";
import { TermCreateSchema, TermType } from "@/types/termSchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect } from "react";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<TermType>;
  mode?: "create" | "update" | "view";
};

const TermForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<TermType>>({
    resolver: zodResolver(TermCreateSchema.partial()),
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
      });
    }
  }, [initialValues, reset]);

  const create = useCreateTerm();
  const update = useUpdateTerm();

  const onSubmit = async (values: Partial<TermType>) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("Term berhasil ditambahkan");
          onCancel?.();
        },
        onError: (error) => {
          const err = handleErrorResponse(error);
          toast.error(err);
        },
      });
      return;
    }

    update.mutate(
      { id: values?.id as string, ...values },
      {
        onSuccess: () => {
          toast.success("Term berhasil diupdate");
          onCancel?.();
        },
        onError: (e) => toast.error(handleErrorResponse(e)),
      }
    );
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Nama"
        {...register("name")}
        disabled={mode === "view"}
        errors={errors.name?.message}
        required
      />
      <TextInput
        label="Slug"
        {...register("slug")}
        disabled={mode === "view"}
        errors={errors.slug?.message}
        required
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onCancel} type="button" color="error">
          Batal
        </Button>
        <Button disabled={create.isPending || update.isPending}>
          {create.isPending || update.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
};

export default TermForm;
