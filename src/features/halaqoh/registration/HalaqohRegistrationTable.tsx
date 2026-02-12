import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { HalaqohRegistration } from "@/types/halaqoh";
import React, { FC, useMemo } from "react";

type Props = {
  data?: HalaqohRegistration[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: HalaqohRegistration) => void;
  onDelete?: (id?: string | number) => void;
  onView?: (data?: HalaqohRegistration) => void;
  onPlacement?: (data: HalaqohRegistration) => void;
};

const HalaqohRegistrationTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
  onPlacement,
}) => {
  const Columns = useMemo<Column<HalaqohRegistration>[]>(
    () => [
      {
        header: "Nama Jamaah",
        accessor: "user",
        render: (row: HalaqohRegistration) => row.user?.name || "N/A",
      },
      {
        header: "Program",
        accessor: "category",
        render: (row: HalaqohRegistration) => row.category?.title || "N/A",
      },
      {
        header: "Nilai Tes",
        accessor: "test_score",
        render: (row: HalaqohRegistration) => row.test_score ?? "-",
      },
      {
        header: "Status",
        accessor: "status",
        render: (row: HalaqohRegistration) => {
          const colors = {
            PENDING: "bg-yellow-100 text-yellow-700",
            TESTING: "bg-blue-100 text-blue-700",
            ACCEPTED: "bg-green-100 text-green-700",
            REJECTED: "bg-red-100 text-red-700",
            COMPLETED: "bg-purple-100 text-purple-700",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs ${colors[row.status]}`}
            >
              {row.status === "COMPLETED" ? "SELESAI" : row.status}
            </span>
          );
        },
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: HalaqohRegistration) => (
          <div className="flex items-center gap-2">
            <ActionButton
              onUpdate={() => onUpdate?.(row)}
              onDelete={() => onDelete?.(row.id)}
              onView={() => onView?.(row)}
            />
            {row.status === "ACCEPTED" && (
              <button
                onClick={() => onPlacement?.(row)}
                className="text-[10px] font-bold text-brand-gold hover:underline bg-brand-gold/10 px-2 py-1 rounded"
              >
                Penempatan
              </button>
            )}
            {row.status === "COMPLETED" && (
              <span className="text-[10px] font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                Sudah mendapatkan kelas
              </span>
            )}
          </div>
        ),
      },
    ],
    [onUpdate, onDelete, onView, onPlacement],
  );

  return (
    <Table
      data={data ?? []}
      columns={Columns}
      isLoading={isLoading}
      totalPages={totalPages ?? 0}
    />
  );
};

export default HalaqohRegistrationTable;
