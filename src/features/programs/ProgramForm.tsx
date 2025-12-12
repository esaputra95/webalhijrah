"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import ImageUpload from "@/components/ui/inputs/ImageUpload";
import {
  useCreateProgram,
  useUpdateProgram,
} from "@/hooks/masters/usePrograms";
import { usePostCategroyType } from "@/hooks/masters/usePostCategories";
import { toast } from "react-toastify";
import { ProgramCreateSchema, ProgramType } from "@/types/programSchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect, useState } from "react";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextareaInput from "@/components/ui/inputs/TextareaInput";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { format } from "date-fns";

// Dynamic import to prevent SSR hydration mismatch
const RichTextEditor = dynamic(
  () => import("@/components/ui/inputs/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[200px] border border-slate-300 rounded-md bg-gray-50 animate-pulse" />
    ),
  }
);

type Props = {
  initialValues?: Partial<ProgramType>;
  mode?: "create" | "update" | "view";
};

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

const ProgramForm: FC<Props> = ({ initialValues, mode }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isScheduled, setIsScheduled] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Partial<ProgramType>>({
    resolver: zodResolver(ProgramCreateSchema.partial()) as never,
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        program_category_id: initialValues.program_category_id,
        date: initialValues.date
          ? format(new Date(initialValues.date), "yyyy-MM-dd'T'HH:mm")
          : undefined,
      });
      if (initialValues.date) {
        setIsScheduled(true);
      }
    }
  }, [initialValues, reset]);

  // Auto-generate slug from title
  const title = watch("title");
  useEffect(() => {
    if (title && mode === "create") {
      const slug = generateSlug(title);
      setValue("slug", slug);
    }
  }, [title, mode, setValue]);

  const { data: postCategory } = usePostCategroyType("program");

  const postCategoryOptions =
    postCategory?.data?.map((item) => ({
      value: item.id as number,
      label: item.title,
    })) || [];

  const create = useCreateProgram();
  const update = useUpdateProgram();

  const handleCancel = () => {
    router.push("/admins/programs");
  };

  const onSubmit = async (values: Partial<ProgramType>) => {
    // Add user_id from session
    const payload = {
      ...values,
      user_id: session?.user?.id
        ? parseInt(session.user.id.toString(), 10)
        : undefined,
    };

    if (mode === "create") {
      create.mutate(payload, {
        onSuccess: () => {
          toast.success("Program berhasil ditambahkan");
          router.push("/admins/programs");
        },
        onError: (error) => {
          const err = handleErrorResponse(error);
          toast.error(err);
        },
      });
      return;
    }

    if (initialValues?.id) {
      update.mutate(
        { id: initialValues.id, ...values },
        {
          onSuccess: () => {
            toast.success("Program berhasil diupdate");
            router.push("/admins/programs");
          },
          onError: (e) => toast.error(handleErrorResponse(e)),
        }
      );
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Judul Program"
          {...register("title")}
          disabled={mode === "view"}
          errors={errors.title?.message}
          required
        />
        <TextInput
          label="Slug"
          {...register("slug")}
          disabled={mode === "view"}
          errors={errors.slug?.message}
          required
        />
      </div>

      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <ImageUpload
            label="Gambar Program"
            value={field.value || ""}
            onChange={field.onChange}
            disabled={mode === "view"}
            errors={errors.image?.message}
            required
          />
        )}
      />

      <TextareaInput
        label="Deskripsi Singkat"
        {...register("description")}
        disabled={mode === "view"}
        errors={errors.description?.message}
      />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <RichTextEditor
            label="Konten Lengkap"
            value={field.value || ""}
            onChange={field.onChange}
            disabled={mode === "view"}
            errors={errors.content?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-4">
        <SelectInput
          {...register("program_category_id")}
          label="Kategori Program"
          disabled={mode === "view"}
          option={postCategoryOptions ?? []}
          required
        />

        <div className="pt-2">
          <label className="flex items-center gap-2 mb-2 cursor-pointer text-sm font-medium text-gray-700 w-fit">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => {
                setIsScheduled(e.target.checked);
                if (!e.target.checked) {
                  setValue("date", null);
                }
              }}
              disabled={mode === "view"}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            Jadwal Pelaksanaan?
          </label>
          {isScheduled && (
            <div className="animate-fade-in-up">
              <TextInput
                label="Waktu Pelaksanaan"
                type="datetime-local"
                {...register("date")}
                disabled={mode === "view"}
                errors={errors.date?.message}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
        <Button onClick={handleCancel} type="button" color="error">
          {mode === "view" ? "Kembali" : "Batal"}
        </Button>
        {mode !== "view" && (
          <Button disabled={create.isPending || update.isPending}>
            {create.isPending || update.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProgramForm;
