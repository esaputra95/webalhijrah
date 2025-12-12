"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import ImageUpload from "@/components/ui/inputs/ImageUpload";
import { useCreatePost, useUpdatePost } from "@/hooks/masters/usePosts";
import { usePostCategroyType } from "@/hooks/masters/usePostCategories";
import { toast } from "react-toastify";
import { PostCreateSchema, PostType } from "@/types/postSchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect } from "react";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextareaInput from "@/components/ui/inputs/TextareaInput";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { useState } from "react";

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
  initialValues?: Partial<PostType>;
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

const PostForm: FC<Props> = ({ initialValues, mode }) => {
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
  } = useForm<Partial<PostType>>({
    resolver: zodResolver(PostCreateSchema.partial()) as never,
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        date: initialValues.date
          ? format(new Date(initialValues.date), "yyyy-MM-dd'T'HH:mm")
          : undefined, // Format for datetime-local
      });
      if (initialValues.date) {
        setIsScheduled(true);
      }
    }
  }, [initialValues, reset]);

  // Auto-generate slug from title
  const postTitle = watch("post_title");
  useEffect(() => {
    if (postTitle && mode === "create") {
      const slug = generateSlug(postTitle);
      setValue("post_name", slug);
    }
  }, [postTitle, mode, setValue]);

  const { data: postCategoryArticle } = usePostCategroyType("article");

  const optionsPostCategoryArticle =
    postCategoryArticle?.data?.map((x) => ({
      label: x.title,
      value: x.id as number,
    })) ?? [];

  const create = useCreatePost();
  const update = useUpdatePost();

  const handleCancel = () => {
    router.push("/admins/articles");
  };

  const onSubmit = async (values: Partial<PostType>) => {
    // Add user_id from session
    const payload = {
      ...values,
      user_id: session?.user?.id?.toString(),
    };

    if (mode === "create") {
      create.mutate(payload, {
        onSuccess: () => {
          toast.success("Post berhasil ditambahkan");
          router.push("/masters/articles");
        },
        onError: (error) => {
          const err = handleErrorResponse(error);
          toast.error(err);
        },
      });
      return;
    }

    update.mutate(
      { id: initialValues?.id as string, ...values },
      {
        onSuccess: () => {
          toast.success("Post berhasil diupdate");
          router.push("/masters/articles");
        },
        onError: (e) => toast.error(handleErrorResponse(e)),
      }
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Judul"
          {...register("post_title")}
          disabled={mode === "view"}
          errors={errors.post_title?.message}
          required
        />
        <TextInput
          label="Slug"
          {...register("post_name")}
          disabled={mode === "view"}
          errors={errors.post_name?.message}
          required
        />
      </div>

      <Controller
        name="post_image"
        control={control}
        render={({ field }) => (
          <ImageUpload
            label="Gambar Artikel"
            value={field.value || ""}
            onChange={field.onChange}
            disabled={mode === "view"}
            errors={errors.post_image?.message}
            required
          />
        )}
      />

      <TextareaInput
        label="Excerpt"
        {...register("post_excerpt")}
        disabled={mode === "view"}
        errors={errors.post_excerpt?.message}
      />

      <Controller
        name="post_content"
        control={control}
        render={({ field }) => (
          <RichTextEditor
            label="Konten"
            value={field.value || ""}
            onChange={field.onChange}
            disabled={mode === "view"}
            errors={errors.post_content?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectInput
          {...register("post_status")}
          label="Status"
          required
          disabled={mode === "view"}
          option={[
            { value: "draft", label: "Draft" },
            { value: "publish", label: "Publish" },
            { value: "pending", label: "Pending" },
            { value: "private", label: "Private" },
            { value: "trash", label: "Trash" },
          ]}
        />
        <SelectInput
          {...register("post_type")}
          label="Tipe"
          required
          disabled={mode === "view"}
          option={[
            { value: "post", label: "Post" },
            { value: "page", label: "Page" },
            { value: "attachment", label: "Attachment" },
            { value: "gallery", label: "Gallery" },
          ]}
        />
        <SelectInput
          {...register("post_category_id")}
          label="Kategori"
          disabled={mode === "view"}
          option={optionsPostCategoryArticle ?? []}
        />
      </div>

      <div className="border-t pt-4">
        <label className="flex items-center gap-2 mb-4 cursor-pointer text-sm font-medium text-gray-700 w-fit">
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
          Schedule Post?
        </label>
        {isScheduled && (
          <div className="max-w-xs animate-fade-in-up">
            <TextInput
              label="Waktu Schedule"
              type="datetime-local"
              {...register("date")}
              disabled={mode === "view"}
              errors={errors.date?.message}
            />
          </div>
        )}
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

export default PostForm;
