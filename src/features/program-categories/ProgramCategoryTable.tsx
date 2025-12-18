import React, { FC, useMemo } from "react";
import { ProgramCategoryType } from "@/types/programCategorySchema";
import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";

interface ProgramCategoryTableProps {
  data?: ProgramCategoryType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate: (data: ProgramCategoryType) => void;
  onDelete: (id: string | undefined) => void;
  onView: (data: ProgramCategoryType) => void;
}

const ProgramCategoryTable: FC<ProgramCategoryTableProps> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const Columns = useMemo<Column<ProgramCategoryType>[]>(
    () => [
      {
        header: "Judul",
        accessor: "title",
        sortable: true,
        filterable: true,
      },
      {
        header: "Deskripsi",
        accessor: "description",
        sortable: true,
        filterable: true,
      },
      {
        header: "Tgl Dibuat",
        accessor: "createdAt",
        sortable: true,
        render: (row) =>
          row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-",
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row) => (
          <ActionButton
            onUpdate={() => onUpdate(row)}
            onDelete={() => onDelete(String(row.id))}
            onView={() => onView(row)}
          />
        ),
      },
    ],
    [onUpdate, onDelete, onView]
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

export default ProgramCategoryTable;
