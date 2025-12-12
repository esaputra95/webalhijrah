"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import {
  useCreateDonation,
  useUpdateDonation,
} from "@/hooks/masters/useDonations";
import { toast } from "react-toastify";
import { DonationCreateSchema, DonationType } from "@/types/donationSchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect } from "react";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextareaInput from "@/components/ui/inputs/TextareaInput";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<DonationType>;
  mode?: "create" | "update" | "view";
};

const DonationForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<DonationType>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(DonationCreateSchema.partial()) as any,
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
      });
    }
  }, [initialValues, reset]);

  const create = useCreateDonation();
  const update = useUpdateDonation();

  const onSubmit = async (values: Partial<DonationType>) => {
    if (mode === "create") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      create.mutate(values as any, {
        onSuccess: () => {
          toast.success("Donasi berhasil ditambahkan");
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
          toast.success("Donasi berhasil diupdate");
          onCancel?.();
        },
        onError: (e) => toast.error(handleErrorResponse(e)),
      }
    );
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="No. Invoice"
        {...register("invoice_number")}
        disabled={mode === "view"}
        errors={errors.invoice_number?.message}
        required
      />
      <TextInput
        label="Nama Donatur"
        {...register("name")}
        disabled={mode === "view"}
        errors={errors.name?.message}
        required
      />
      <TextInput
        label="No. Telepon"
        {...register("phone_number")}
        disabled={mode === "view"}
        errors={errors.phone_number?.message}
      />
      <TextInput
        label="Jumlah"
        type="number"
        {...register("amount", { valueAsNumber: true })}
        disabled={mode === "view"}
        errors={errors.amount?.message}
        required
      />
      <TextInput
        label="Link Pembayaran"
        {...register("payment_link")}
        disabled={mode === "view"}
        errors={errors.payment_link?.message}
      />
      <SelectInput
        {...register("status")}
        label="Status"
        required
        option={[
          { value: "pending", label: "Pending" },
          { value: "settled", label: "Settled" },
          { value: "expired", label: "Expired" },
          { value: "failed", label: "Failed" },
        ]}
      />
      <TextareaInput
        label="Catatan"
        {...register("note")}
        disabled={mode === "view"}
        errors={errors.note?.message}
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

export default DonationForm;
