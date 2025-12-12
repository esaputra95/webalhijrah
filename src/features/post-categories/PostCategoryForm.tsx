"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import {
  useCreatePostCategory,
  useUpdatePostCategory,
} from "@/hooks/masters/usePostCategories";
import { toast } from "react-toastify";
import {
  PostCategoryFormType as FormType,
  PostCategoryFormSchema as FormSchema,
} from "@/types/postCategorySchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect } from "react";
import { useSession } from "next-auth/react";
import SelectInput from "@/components/ui/inputs/SelectInput";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<FormType>;
  mode?: "create" | "update" | "view";
};

const PostCategoryForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_id: session?.user?.id ? Number(session.user.id) : undefined,
    },
  });

  useEffect(() => {
    if (initialValues) {
      // eslint-disable-next-line
      const { created_at, updated_at, ...rest } = initialValues;
      reset({
        ...rest,
        user_id: session?.user?.id ? Number(session.user.id) : undefined,
      });
    } else if (session?.user?.id) {
      reset({
        user_id: Number(session.user.id),
      });
    }
  }, [initialValues, reset, session]);

  const create = useCreatePostCategory();
  const update = useUpdatePostCategory();

  const onSubmit = async (values: FormType) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("Kategori berhasil ditambahkan");
          onCancel?.();
          reset({
            user_id: session?.user?.id ? Number(session.user.id) : undefined,
          });
        },
        onError: (error) => {
          const err = handleErrorResponse(error);
          toast.error(err);
        },
      });
      return;
    }

    update.mutate(
      { id: Number(values?.id), ...values },
      {
        onSuccess: () => {
          toast.success("Kategori berhasil diupdate");
          onCancel?.();
          reset({
            user_id: session?.user?.id ? Number(session.user.id) : undefined,
          });
        },
        onError: (e) => toast.error(handleErrorResponse(e)),
      }
    );
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Judul"
        {...register("title")}
        disabled={mode === "view"}
        errors={errors.title?.message}
        required
      />
      <SelectInput
        {...register("type")}
        label="Type"
        disabled={mode === "view"}
        errors={errors.type?.message}
        option={[
          { value: "article", label: "Artikel" },
          { value: "program", label: "Program" },
        ]}
      />
      <TextInput
        label="Deskripsi"
        {...register("description")}
        disabled={mode === "view"}
        errors={errors.description?.message}
      />

      {/* Hidden user_id field, populated from session */}
      <input type="hidden" {...register("user_id")} />

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

export default PostCategoryForm;
