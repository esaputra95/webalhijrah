import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { HalaqohCategory } from "@/types/halaqoh";
import React, { FC, useMemo } from "react";

type Props = {
  data?: HalaqohCategory[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: HalaqohCategory) => void;
  onDelete?: (id?: string | number) => void;
  onView?: (data?: HalaqohCategory) => void;
};

const HalaqohCategoryTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const Columns = useMemo<Column<HalaqohCategory>[]>(
    () => [
      { header: "Judul", accessor: "title", sortable: true, filterable: true },
      { header: "Slug", accessor: "slug", sortable: true, filterable: true },
      {
        header: "Deskripsi",
        accessor: "description",
        sortable: true,
        filterable: true,
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: HalaqohCategory) => (
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

export default HalaqohCategoryTable;
