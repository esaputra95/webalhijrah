import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { DonationType } from "@/types/donationSchema";
import dayjs from "dayjs";
import Image from "next/image";
import React, { FC, useMemo } from "react";

type Props = {
  data?: DonationType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: DonationType) => void;
  onDelete?: (id?: string) => void;
  onView?: (id?: DonationType) => void;
};

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    settled: "bg-green-100 text-green-800",
    expired: "bg-gray-100 text-gray-800",
    failed: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const DonationTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const DonationColumns = useMemo<Column<DonationType>[]>(
    () => [
      {
        header: "No. Invoice",
        accessor: "invoice_number",
        sortable: true,
        filterable: true,
      },
      { header: "Nama", accessor: "name", sortable: true, filterable: true },
      {
        header: "No. Telepon",
        accessor: "phone_number",
        sortable: true,
        filterable: true,
      },
      {
        header: "Jumlah",
        accessor: "amount",
        sortable: true,
        render: (row: DonationType) => formatCurrency(row.amount),
      },
      {
        header: "Status",
        accessor: "status",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: [
          { value: "pending", label: "Pending" },
          { value: "settled", label: "Settled" },
          { value: "expired", label: "Expired" },
          { value: "failed", label: "Failed" },
        ],
        render: (row: DonationType) => statusBadge(row.status),
      },
      {
        header: "Waktu Donasi",
        accessor: "created_at",
        sortable: true,
        render: (row: DonationType) =>
          row.created_at && dayjs(row.created_at).format("DD/MM/YYYY HH:mm:ss"),
      },
      {
        header: "Bukti Donasi",
        accessor: "image",
        render: (row: DonationType) =>
          row?.image ? (
            <Image
              src={row?.image || ""}
              alt="Bukti Donasi"
              width={100}
              height={100}
            />
          ) : (
            "-"
          ),
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: DonationType) => (
          <ActionButton
            onUpdate={() => onUpdate?.(row)}
            onDelete={() => onDelete?.(row?.id)}
            onView={() => onView?.(row)}
          />
        ),
      },
    ],
    [onUpdate, onDelete, onView]
  );

  return (
    <>
      <Table
        data={data ?? []}
        columns={DonationColumns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </>
  );
};

export default DonationTable;
