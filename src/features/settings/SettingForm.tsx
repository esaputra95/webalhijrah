import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SettingSchema, SettingType } from "@/types/settingSchema";
import { useSaveSetting } from "@/hooks/masters/useSettings";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import Button from "@/components/ui/buttons/Button";
import TextInput from "@/components/ui/inputs/TextInput";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextareaInput from "@/components/ui/inputs/TextareaInput";

interface SettingFormProps {
  initialValues?: Partial<SettingType>;
  onCancel: () => void;
  mode: "create" | "update" | "view";
}

const SettingForm: React.FC<SettingFormProps> = ({
  initialValues,
  onCancel,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingType>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      key: "",
      label: "",
      type: "text",
      value: "",
      ...initialValues,
    },
  });

  const saveMutation = useSaveSetting();

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: SettingType) => {
    try {
      await saveMutation.mutateAsync(data);
      toast.success(
        `Setting berhasil ${mode === "create" ? "dibuat" : "diperbarui"}!`
      );
      onCancel();
    } catch (error) {
      toast.error(handleErrorResponse(error));
    }
  };

  const isView = mode === "view";

  const typeOptions = [
    { label: "Hero", value: "Hero" },
    { label: "About", value: "About" },
    { label: "Contact", value: "Contact" },
    { label: "Blog", value: "Blog" },
    { label: "Testimonial", value: "Testimonial" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <SelectInput
        label="Type"
        {...register("type")}
        option={typeOptions}
        disabled={isView || mode === "update"}
        errors={errors.type?.message}
        required
        allowNull={false}
      />

      <TextInput
        label="Key"
        {...register("key")}
        disabled={isView || mode === "update"}
        errors={errors.key?.message}
        required
      />

      <TextInput
        label="Label"
        {...register("label")}
        disabled={isView}
        errors={errors.label?.message}
        required
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onCancel} type="button" variant="solid" color="error">
          {isView ? "Tutup" : "Batal"}
        </Button>
        {!isView && (
          <Button
            disabled={isSubmitting || saveMutation.isPending}
            variant="solid"
            color="primary"
            type="submit"
          >
            {isSubmitting || saveMutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default SettingForm;
