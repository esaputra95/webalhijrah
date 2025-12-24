"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import {
  useCreateDonationMaster,
  useUpdateDonationMaster,
} from "@/hooks/masters/useDonations";
import { toast } from "react-toastify";
import { DonationCreateSchema, DonationType } from "@/types/donationSchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect } from "react";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextareaInput from "@/components/ui/inputs/TextareaInput";
import ImageUpload from "@/components/ui/inputs/ImageUpload";

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
    control,
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
    } else {
      reset({ amount: 0 });
    }
  }, [initialValues, reset]);

  const create = useCreateDonationMaster();
  const update = useUpdateDonationMaster();

  const onSubmit = async (values: Partial<DonationType>) => {
    if (mode === "create") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      create.mutate(values as any, {
        onSuccess: () => {
          toast.success("Donasi berhasil ditambahkan (Manual)");
          onCancel?.();
        },
        onError: (error: unknown) => {
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
          toast.success("Donasi berhasil diupdate (Manual)");
          onCancel?.();
        },
        onError: (e: unknown) => toast.error(handleErrorResponse(e)),
      }
    );
  };

  return (
    <form
      className="space-y-3 max-h-[calc(100vh-200px)] overflow-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-2 gap-4">
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
      </div>
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <ImageUpload
            label="Bukti Transaksi"
            value={field.value || ""}
            onChange={field.onChange}
            disabled={mode === "view"}
            errors={errors.image?.message}
            required
          />
        )}
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
