"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import ImageUpload from "@/components/ui/inputs/ImageUpload";
import SelectInput from "@/components/ui/inputs/SelectInput";
import { useCreateSlider, useUpdateSlider } from "@/hooks/masters/useSliders";
import { toast } from "react-toastify";
import {
  SliderType as FormType,
  SliderSchema as FormSchema,
} from "@/types/masters/silderSchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<FormType>;
  mode?: "create" | "update" | "view";
};

const SliderForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_id: session?.user?.id ? Number(session.user.id) : undefined,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        user_id: session?.user?.id ? Number(session.user.id) : undefined,
      });
    } else if (session?.user?.id) {
      reset({
        user_id: session?.user?.id ? Number(session.user.id) : undefined,
      });
    }
  }, [initialValues, reset, session]);

  const create = useCreateSlider();
  const update = useUpdateSlider();
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");

  const onSubmit = async (values: FormType) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("Slider berhasil ditambahkan");
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
          toast.success("Slider berhasil diupdate");
          onCancel?.();
        },
        onError: (e) => toast.error(handleErrorResponse(e)),
      }
    );
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <SelectInput
        {...register("type")}
        label="Type"
        disabled={mode === "view"}
        errors={errors.type?.message}
        option={[
          { value: "hero-slider", label: "Hero Slider" },
          { value: "banner", label: "Banner" },
          { value: "donation", label: "Donasi" },
          { value: "promo", label: "Promo" },
          { value: "about_us", label: "About Us" },
        ]}
      />
      <div className="mb-4">
        {watch("type") === "about_us" && (
          <div className="flex gap-4 mb-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="upload_mode"
                name="input_mode"
                checked={inputMode === "upload"}
                onChange={() => setInputMode("upload")}
                className="cursor-pointer"
              />
              <label htmlFor="upload_mode" className="cursor-pointer">
                Upload Gambar
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="url_mode"
                name="input_mode"
                checked={inputMode === "url"}
                onChange={() => setInputMode("url")}
                className="cursor-pointer"
              />
              <label htmlFor="url_mode" className="cursor-pointer">
                URL Gambar
              </label>
            </div>
          </div>
        )}

        {inputMode === "url" && watch("type") === "about_us" ? (
          <TextInput
            label="URL Gambar"
            {...register("image")}
            disabled={mode === "view"}
            errors={errors.image?.message}
            placeholder="https://example.com/image.jpg"
          />
        ) : (
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Gambar Slider"
                value={field.value || ""}
                onChange={field.onChange}
                disabled={mode === "view"}
                errors={errors.image?.message}
                required={
                  watch("type") !== "about_us" || inputMode === "upload"
                }
              />
            )}
          />
        )}
      </div>

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

export default SliderForm;
