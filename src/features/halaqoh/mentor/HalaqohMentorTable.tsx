import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { HalaqohMentor } from "@/types/halaqoh";
import React, { FC, useMemo } from "react";

type Props = {
  data?: HalaqohMentor[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: HalaqohMentor) => void;
  onDelete?: (id?: string | number) => void;
  onView?: (data?: HalaqohMentor) => void;
};

const HalaqohMentorTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const Columns = useMemo<Column<HalaqohMentor>[]>(
    () => [
      {
        header: "Nama",
        accessor: "user",
        render: (row: HalaqohMentor) => row.user?.name || "N/A",
        sortable: true,
        filterable: true,
      },
      {
        header: "Spesialisasi",
        accessor: "specialization",
        sortable: true,
        filterable: true,
      },
      {
        header: "Status",
        accessor: "is_active",
        render: (row: HalaqohMentor) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${row.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {row.is_active ? "Aktif" : "Non-Aktif"}
          </span>
        ),
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: HalaqohMentor) => (
          <ActionButton
            onUpdate={() => onUpdate?.(row)}
            onDelete={() => onDelete?.(row.id)}
            onView={() => onView?.(row)}
          />
        ),
      },
    ],
    [onUpdate, onDelete, onView],
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

export default HalaqohMentorTable;
