"use client";
import Wizard, { WizardHandle } from "@/components/ui/form/FormWizard";
import { Uploaded } from "@/components/ui/inputs/FileInput";
import FormStep1 from "@/features/requests/FormStep1";
import FormStep2 from "@/features/requests/FormStep2";
import FormStep3 from "@/features/requests/FormStep3";
import FormStep4 from "@/features/requests/FormStep4";
import {
  useCreateRequest,
  useUpdateRequest,
  useGetDetailRequests,
} from "@/hooks/submissions/useRequests";
import {
  RequestFormStep1Type,
  RequestFormStep2Type,
  RequestFormStep3Type,
} from "@/types/requestSchema";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useRef, useState, useEffect } from "react";
import { FaEdit, FaUser, FaFileArchive } from "react-icons/fa";
import { FiCheckSquare } from "react-icons/fi";
import { toast } from "react-toastify";
import { RequestTableType } from "@/features/requests/RequestTable";
import { toDatetimeLocal } from "@/utils/dateTime";
import Spinner from "@/components/ui/loading/Spinner";

export type RequestPost = RequestFormStep1Type &
  RequestFormStep2Type &
  RequestFormStep3Type &
  Uploaded & { id?: string };

const toDate = (v?: unknown) =>
  v instanceof Date ? v : v ? new Date(String(v)) : undefined;

const RequestForm: FC = () => {
  const [dataPost, setDataPost] = useState<Partial<RequestPost>>();
  const wizRef = useRef<WizardHandle>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: fetchedData, isFetching } = useGetDetailRequests(
    id ?? undefined
  );
  const create = useCreateRequest();
  const update = useUpdateRequest();

  useEffect(() => {
    if (fetchedData?.data && id) {
      const data = fetchedData.data as RequestTableType;
      const services = data?.services.map((e) => ({
        id: e.id as string,
        serviceId: e.serviceId,
        quantity: e.requestedQty,
      }));
      setDataPost({
        id: data?.id,
        title: data?.title,
        startAt: toDatetimeLocal(data.startAt),
        endAt: toDatetimeLocal(data.endAt),
        roomId: data?.roomId,
        borrowerName: data?.borrowerName ?? "",
        borrowerEmail: data?.borrowerEmail ?? "",
        borrowerOrganization: data?.borrowerOrganization ?? "",
        borrowerPhone: data?.borrowerPhone ?? "",
        services: services,
        url: data?.purpose ?? "",
      });
    }
  }, [fetchedData, id]);

  const handleNext = (
    e:
      | RequestFormStep1Type
      | RequestFormStep2Type
      | RequestFormStep3Type
      | Uploaded
  ) => {
    setDataPost((state) => ({ ...state, ...e }));
    wizRef.current?.next();
  };

  const handleBack = (
    e?:
      | RequestFormStep1Type
      | RequestFormStep2Type
      | RequestFormStep3Type
      | Uploaded
  ) => {
    setDataPost((state) => ({ ...state, ...e }));
    wizRef.current?.prev();
  };

  const handleOnSave = (
    data?:
      | RequestFormStep1Type
      | RequestFormStep2Type
      | RequestFormStep3Type
      | Uploaded
  ) => {
    const dataSend = { ...dataPost, ...data };
    const requestDetailData = dataSend?.services?.map((e) => ({
      requestedQty: e.quantity,
      serviceId: e.serviceId ?? "",
      id: e.id,
    }));

    const dataFinal = {
      id: dataSend?.id,
      startAt: toDate(dataSend.startAt)!,
      endAt: toDate(dataSend.endAt)!,
      title: dataSend?.title ?? "",
      roomId: dataSend?.roomId ?? "",
      borrowerName: dataSend?.borrowerName,
      borrowerEmail: dataSend?.borrowerEmail,
      borrowerPhone: dataSend?.borrowerPhone,
      borrowerOrganization: dataSend?.borrowerOrganization,
      purpose: dataSend?.url,
      requestDetails: requestDetailData ?? [],
    };
    if (!dataSend.id) {
      create.mutate(
        { ...dataFinal },
        {
          onSuccess: () => {
            toast.success("Pengajuan ruangan berhasil disimpan");
            router.push("/submissions/requests");
          },
          onError: (error) => {
            const err = handleErrorResponse(error);
            toast.error(err);
          },
        }
      );
      return;
    }
    update.mutate(
      {
        ...dataFinal,
        id: dataSend.id as string,
      },
      {
        onSuccess: () => {
          toast.success("Pengajuan ruangan berhasil diupdate");
          router.push("/submissions/requests");
        },
        onError: (error) => {
          const err = handleErrorResponse(error);
          toast.error(err);
        },
      }
    );
  };

  if (isFetching && id) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="py-4">
        <Wizard
          withButton={false}
          ref={wizRef}
          steps={[
            {
              label: "Informasi Kegiatan",
              icon: FaEdit,
              content: (
                <FormStep1 initialValue={dataPost} onNext={handleNext} />
              ),
            },
            {
              label: "Penaggung Jawab",
              icon: FaUser,
              content: (
                <FormStep2
                  initialValue={dataPost}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              ),
            },
            {
              label: "Layanan Kegiatan",
              icon: FiCheckSquare,
              content: (
                <FormStep3
                  initialValue={dataPost}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              ),
            },
            {
              label: "Dokument Pendukung",
              icon: FaFileArchive,
              content: (
                <FormStep4
                  initialValue={dataPost}
                  onBack={handleBack}
                  onNext={handleOnSave}
                  isLoading={create.isPending || update.isPending}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RequestForm;
