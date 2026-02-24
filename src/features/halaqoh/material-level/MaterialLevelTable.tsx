import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { HalaqohMaterialLevel } from "@/types/halaqoh";
import React, { FC, useMemo } from "react";

type Props = {
  data?: HalaqohMaterialLevel[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: HalaqohMaterialLevel) => void;
  onDelete?: (id?: string | number) => void;
  onView?: (data?: HalaqohMaterialLevel) => void;
};

const MaterialLevelTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const Columns = useMemo<Column<HalaqohMaterialLevel>[]>(
    () => [
      {
        header: "Kategori",
        accessor: "category_id",
        render: (row: HalaqohMaterialLevel) => row.category?.title || "-",
      },
      { header: "Tingkatan", accessor: "title", sortable: true },
      { header: "Urutan", accessor: "level_order", sortable: true },
      {
        header: "Deskripsi",
        accessor: "description",
        render: (row: HalaqohMaterialLevel) => row.description || "-",
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: HalaqohMaterialLevel) => (
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

export default MaterialLevelTable;
