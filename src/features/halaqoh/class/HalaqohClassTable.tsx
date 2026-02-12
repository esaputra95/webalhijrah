import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { Halaqoh } from "@/types/halaqoh";
import React, { FC, useMemo } from "react";

type Props = {
  data?: Halaqoh[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: Halaqoh) => void;
  onDelete?: (id?: string | number) => void;
  onView?: (data?: Halaqoh) => void;
};

const HalaqohClassTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const Columns = useMemo<Column<Halaqoh>[]>(
    () => [
      {
        header: "Judul Kelas",
        accessor: "title",
        sortable: true,
        filterable: true,
      },
      {
        header: "Kategori",
        accessor: "category",
        render: (row: Halaqoh) => row.category?.title || "N/A",
      },
      {
        header: "Pembimbing",
        accessor: "mentor",
        render: (row: Halaqoh) => row.mentor?.user?.name || "N/A",
      },
      { header: "Jadwal", accessor: "schedule_info" },
      {
        header: "Lokasi",
        accessor: "location_type",
        render: (row: Halaqoh) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${row.location_type === "ONLINE" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
          >
            {row.location_type}
          </span>
        ),
      },
      {
        header: "Status",
        accessor: "status",
        render: (row: Halaqoh) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${row.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
          >
            {row.status}
          </span>
        ),
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: Halaqoh) => (
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

export default HalaqohClassTable;
