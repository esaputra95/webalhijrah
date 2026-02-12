"use client";
import React, { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HalaqohRegistrationSchema,
  HalaqohRegistrationType,
} from "@/types/halaqohSchema";
import { useCreateHalaqohRegistration } from "@/hooks/masters/useHalaqohRegistrations";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { HalaqohCategory } from "@/types/halaqoh";
import Button from "@/components/ui/buttons/Button";
import TextInput from "@/components/ui/inputs/TextInput";
import TextareaInput from "@/components/ui/inputs/TextareaInput";
import SelectInput from "@/components/ui/inputs/SelectInput";
import { useRouter } from "next/navigation";

type Props = {
  category: HalaqohCategory;
};

const HalaqohRegistrationDetailForm: FC<Props> = ({ category }) => {
  const router = useRouter();
  const create = useCreateHalaqohRegistration();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HalaqohRegistrationType>({
    resolver: zodResolver(HalaqohRegistrationSchema) as any,
    defaultValues: {
      category_id: category.id,
      status: "PENDING",
      gender: "IKHWAN",
    },
  });

  const onSubmit: SubmitHandler<HalaqohRegistrationType> = (values) => {
    create.mutate(values, {
      onSuccess: (data) => {
        toast.success(
          `Pendaftaran program ${category.title} berhasil dikirim. Mohon tunggu informasi selanjutnya.`,
        );
        router.push(`/halaqoh/registration-success/${data.data.id}`);
      },
      onError: (error) => {
        console.error("Registration Error:", error);
        toast.error(handleErrorResponse(error));
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#4A4C70] mb-2">
          Formulir Pendaftaran
        </h2>
        <p className="text-slate-500">
          Lengkapi data diri Anda untuk mendaftar di program{" "}
          <span className="font-semibold text-[#4A4C70]">{category.title}</span>
          .
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <TextInput
          label="Nomor WhatsApp"
          placeholder="Contoh: 08123456789"
          {...register("phone_number")}
          errors={errors.phone_number?.message}
          required
        />

        <SelectInput
          label="Jenis Kelamin"
          value={watch("gender")}
          allowNull={false}
          onChange={(val) =>
            setValue("gender", (val.target as HTMLSelectElement).value as any)
          }
          option={[
            { label: "Ikhwan (Laki-laki)", value: "IKHWAN" },
            { label: "Akhwat (Perempuan)", value: "AKHWAT" },
          ]}
          errors={errors.gender?.message}
          required
        />

        <TextareaInput
          label="Alamat Lengkap"
          placeholder="Masukkan alamat domisili Anda"
          {...register("address")}
          errors={errors.address?.message}
          required
        />

        <TextareaInput
          label="Catatan Tambahan (Opsional)"
          placeholder="Ada informasi tambahan untuk panitia?"
          {...register("notes")}
          errors={errors.notes?.message}
        />

        <div className="pt-4 flex gap-4">
          <Button
            type="button"
            variant="outlined"
            className="flex-1 h-12 rounded-xl"
            onClick={() => router.back()}
          >
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={create.isPending}
            className="flex-[2] h-12 rounded-xl font-bold"
          >
            Kirim Pendaftaran
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HalaqohRegistrationDetailForm;
