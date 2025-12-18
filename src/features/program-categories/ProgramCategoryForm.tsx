import React, { useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  ProgramCategorySchema,
  ProgramCategoryType,
} from "@/types/programCategorySchema";
import {
  useCreateProgramCategory,
  useUpdateProgramCategory,
} from "@/hooks/masters/useProgramCategories";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import Button from "@/components/ui/buttons/Button";
import TextInput from "@/components/ui/inputs/TextInput";

interface ProgramCategoryFormProps {
  initialValues?: Partial<ProgramCategoryType>;
  onCancel: () => void;
  mode: "create" | "update" | "view";
}

const ProgramCategoryForm: React.FC<ProgramCategoryFormProps> = ({
  initialValues,
  onCancel,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProgramCategoryType>({
    resolver: zodResolver(
      ProgramCategorySchema
    ) as Resolver<ProgramCategoryType>,
    defaultValues: {
      title: "",
      description: "",
      ...initialValues,
    },
  });

  const createMutation = useCreateProgramCategory();
  const updateMutation = useUpdateProgramCategory();

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: ProgramCategoryType) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Kategori Program berhasil dibuat!");
      } else if (mode === "update" && initialValues?.id) {
        await updateMutation.mutateAsync({ id: initialValues.id, data });
        toast.success("Kategori Program berhasil diperbarui!");
      }
      onCancel();
    } catch (error) {
      // Error msg handled by interceptor or manually extract if needed
      toast.error(handleErrorResponse(error));
    }
  };

  const isView = mode === "view";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <TextInput
          label="Judul"
          {...register("title")}
          disabled={mode === "view"}
          errors={errors.title?.message}
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Deskripsi
        </label>
        <textarea
          disabled={isView}
          {...register("description")}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Deskripsi singkat"
          rows={3}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {errors.description.message as string}
          </p>
        )}
      </div>

      {/* Hidden fields if needed or handled automatically by backend/default values */}
      {/* userCreate / account could be added here if they are input fields. 
          For now assuming they are optional/backend handled or not critical for this simple form.
          Adjust if specific inputs for them are needed. */}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="solid" color="error">
          {isView ? "Tutup" : "Batal"}
        </Button>
        {!isView && (
          <Button
            disabled={
              isSubmitting ||
              createMutation.isPending ||
              updateMutation.isPending
            }
            variant="solid"
            color="primary"
          >
            {isSubmitting ||
            createMutation.isPending ||
            updateMutation.isPending
              ? "Menyimpan..."
              : "Simpan"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProgramCategoryForm;
