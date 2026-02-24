import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import Button from "@/components/ui/buttons/Button";
import { UserType, UserSchema } from "@/types/userSchema";
import { useCreateUser, useUpdateUser } from "@/hooks/users/useUsers";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";

interface UserFormProps {
  initialValues?: Partial<UserType>;
  onCancel: () => void;
  mode: "create" | "update" | "view";
}

export default function UserForm({
  initialValues,
  onCancel,
  mode,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
      ...initialValues,
    },
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        password: "", // Jangan tampilkan hash password
      });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: UserType) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("User berhasil dibuat");
      } else if (mode === "update" && initialValues?.id) {
        // Hapus field password jika kosong agar tidak diupdate
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        await updateMutation.mutateAsync({
          id: initialValues.id,
          data: updateData,
        });
        toast.success("User berhasil diupdate");
      }
      onCancel();
    } catch (error) {
      toast.error(handleErrorResponse(error));
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isViewOnly = mode === "view";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextInput
        label="Nama"
        {...register("name")}
        errors={errors.name?.message}
        placeholder="Masukkan nama lengkap"
        disabled={isViewOnly}
      />
      <TextInput
        label="Email"
        type="email"
        {...register("email")}
        errors={errors.email?.message}
        placeholder="contoh@email.com"
        disabled={isViewOnly}
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          {...register("role")}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2 border bg-white disabled:bg-slate-100 disabled:text-slate-500"
          disabled={isViewOnly}
        >
          <option value="">Pilih Role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="ADMIN_TAKMIR">ADMIN_TAKMIR</option>
          <option value="ADMIN_KESANTRIAN">ADMIN_KESANTRIAN</option>
          <option value="MENTOR">MENTOR</option>
          <option value="USER">USER</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
        )}
      </div>

      <TextInput
        label={
          mode === "update"
            ? "Password (Kosongkan jika tidak diubah)"
            : "Password"
        }
        type="password"
        {...register("password")}
        errors={errors.password?.message}
        placeholder="Masukkan password"
        disabled={isViewOnly}
      />

      {!isViewOnly && (
        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
          <Button
            type="button"
            color="warning"
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="solid"
            isLoading={isSubmitting}
          >
            {mode === "create" ? "Simpan" : "Update"}
          </Button>
        </div>
      )}
    </form>
  );
}
