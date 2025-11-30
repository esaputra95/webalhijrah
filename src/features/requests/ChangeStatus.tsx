"use client";
import Button from "@/components/ui/buttons/Button";
import DropzoneImages from "@/components/ui/inputs/FileInputMultiple";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextInput from "@/components/ui/inputs/TextInput";
import HeaderModal from "@/components/ui/modals/Header";
import Modal from "@/components/ui/modals/Modal";
import { useUpdateRequest } from "@/hooks/submissions/useRequests";
import { RequestDetailTable } from "@/types/requestDetailSchema";
import {
  RequestChangeStatus,
  RequestChangeStatusType,
} from "@/types/requestSchema";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Props = {
  visible: boolean;
  onClose: () => void;
  data: RequestChangeStatusType & {
    details?: RequestDetailTable[];
  };
};

const ChangeStatus: FC<Props> = ({ visible, onClose, data }) => {
  const update = useUpdateRequest();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<RequestChangeStatusType>({
    resolver: zodResolver(RequestChangeStatus),
  });

  useFieldArray({
    control,
    name: "requestDetails", // harus sama dengan key di FormValues
  });

  console.log({ errors });

  useEffect(() => {
    if (data) {
      reset({ ...data, requestDetails: data.details });
    }
    console.log({ data });
  }, [data, reset]);

  const onSubmit = (data: RequestChangeStatusType) => {
    update.mutate(
      {
        ...data,
        id: data.id as string,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          const err = handleErrorResponse(error);
          toast.error(err);
        },
      }
    );
  };

  return (
    <Modal
      classNameChildren="w-full lg:w-4/12"
      isOpen={visible}
      onClose={onClose}
    >
      <HeaderModal>Ubah Status</HeaderModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4">
          <SelectInput
            label="Status Pengajuan"
            {...register("status")}
            option={[
              { label: "PENDING", value: "PENDING" },
              { label: "APPROVE", value: "APPROVED" },
              { label: "SELESAI", value: "FINISH" },
            ]}
          />
        </div>
        {watch("status") === "FINISH" && (
          <div className="p-4">
            <DropzoneImages
              onUploaded={(files) => {
                toast.success("Gambar berhasil di upload");
                const data = files.map((e) => ({
                  name: e.url,
                }));
                reset({
                  ...watch(),
                  images: data,
                });
              }}
            />
          </div>
        )}
        {watch("status") === "APPROVED" && (
          <div className="w-full px-4 text-left text-sm">
            <table className="table w-full ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="p-2">Nama</th>
                  <th className="p-2">Permintaan</th>
                  <th className="p-2">Setujui</th>
                </tr>
              </thead>
              <tbody>
                {}
                {data?.details?.map((val, i) => (
                  <tr
                    className="bg-white border-b border-gray-200"
                    key={val.id}
                  >
                    <td className="p-2">{val.service?.name}</td>
                    <td className="p-2">{val.requestedQty}</td>
                    <td className="p-2">
                      <TextInput
                        {...register(`requestDetails.${i}.approvedQty`, {
                          valueAsNumber: true,
                        })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-row justify-end space-x-4 mt-4 p-4 border-gray-200 border-t">
          <Button type="button" onClick={onClose} color="error">
            Batal
          </Button>
          <Button isLoading={update.isPending}>Simpan</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeStatus;
