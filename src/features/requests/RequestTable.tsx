"use client";
import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import {
  RequestType as PublicType,
  RequestStatusType,
} from "@/types/requestSchema";
import { ServiceType } from "@/types/serviceSchema";
import React, { FC, useMemo } from "react";
import dayjs from "dayjs";
import { RequestDetailTable } from "@/types/requestDetailSchema";
import { BsDownload, BsPencil } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export type RequestTableType = PublicType & {
  rooms: ServiceType;
  services: RequestDetailTable[];
};

type Props = {
  data?: RequestTableType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (id?: string) => void;
  onDelete?: (id?: string) => void;
  onView?: (id?: string) => void;
  onChangeStatus?: (
    id?: string,
    status?: RequestStatusType,
    details?: RequestDetailTable[],
  ) => void;
  onDeleteImage?: (id: string) => void;
};

const RequestTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onChangeStatus,
  onDeleteImage,
}) => {
  const { data: session } = useSession();
  const RequestColumns = useMemo<Column<RequestTableType>[]>(
    () => [
      {
        header: "Judul",
        accessor: "title",
        sortable: true,
        filterable: true,
      },
      {
        header: "PM",
        accessor: "borrowerName",
        sortable: true,
        filterable: true,
      },
      {
        header: "Hp PM",
        accessor: "borrowerPhone",
        sortable: true,
        filterable: true,
      },
      {
        header: "Nama Organisasi",
        accessor: "borrowerOrganization",
        sortable: true,
        filterable: true,
      },
      {
        header: "Nama Organisasi",
        accessor: "borrowerEmail",
        sortable: true,
        filterable: true,
      },
      {
        header: "Mulai",
        accessor: "startAt",
        sortable: true,
        filterable: true,
        render: (raw) => {
          return dayjs(raw.startAt).format("DD/MM/YYYY hh:mm");
        },
      },
      {
        header: "Selesai",
        accessor: "endAt",
        sortable: true,
        filterable: true,
        render: (raw) => {
          return dayjs(raw.endAt).format("DD/MM/YYYY hh:mm");
        },
      },
      {
        header: "Status",
        accessor: "status",
        sortable: true,
        filterable: true,
      },
      {
        header: "Aksi",
        accessor: "id",
        sticky: "left",
        render: (row: RequestTableType) => (
          <ActionButton
            onUpdate={() => onUpdate?.(row.id)}
            onDelete={() => onDelete?.(row?.id)}
            allowedEditRoles={["ADMIN", "ADMIN_TAKMIR"]}
            allowedDeleteRoles={["ADMIN", "ADMIN_TAKMIR"]}
          >
            {(session?.user.role === "APPROVER" ||
              session?.user.role === "ADMIN" ||
              session?.user.role === "ADMIN_TAKMIR") && (
              <button
                onClick={() =>
                  onChangeStatus?.(row?.id, row?.status, row?.services)
                }
                className="w-full text-cyan-600 text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <BsPencil /> Ubah Status
              </button>
            )}
            {(session?.user.role === "APPROVER" ||
              session?.user.role === "ADMIN" ||
              session?.user.role === "ADMIN_TAKMIR") && (
              <Link
                className="w-full text-indigo-700 text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                href={row?.purpose ?? ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsDownload /> Download Dokumen
              </Link>
            )}
          </ActionButton>
        ),
      },
    ],
    [],
  );
  return (
    <>
      <Table
        data={data ?? []}
        columns={RequestColumns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
        renderDetail={(raw) => (
          <div className="w-full space-y-2">
            <div>
              <label className="font-semibold">
                Daftar Layanan yang diajukan
              </label>
            </div>
            <div className="w-full grid grid-cols-3 border-y border-gray-200 py-2">
              <div>Layanan</div>
              <div>Jumlah pengajuan</div>
              <div>Jumlah disetujui</div>
            </div>
            {raw.services?.map((data) => (
              <div
                key={data.id}
                className="w-full grid grid-cols-3 border-b border-gray-200 py-2"
              >
                <div>{data?.service?.name}</div>
                <div>{data?.requestedQty}</div>
                <div>{data?.approvedQty}</div>
              </div>
            ))}
            <div>
              <label className="font-semibold">Foto bukti kegiatan</label>
            </div>
            <div className="w-full grid grid-cols-10 border-b border-gray-200 py-2 gap-2">
              {raw?.attachments?.map((e) => (
                <div className="relative" key={e.id}>
                  <button
                    onClick={() => onDeleteImage?.(e.id as string)}
                    className="h-8 w-full bg-red-700 p-2 rounded-t-md text-white"
                  >
                    Hapus
                  </button>
                  <Image
                    className="rounded-b-md"
                    height={100}
                    width={100}
                    src={e.url ?? "/"}
                    alt={""}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      />
    </>
  );
};

export default RequestTable;
