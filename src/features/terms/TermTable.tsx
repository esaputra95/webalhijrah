import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { TermType } from "@/types/termSchema";
import React, { FC, useMemo } from "react";

type Props = {
  data?: TermType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: TermType) => void;
  onDelete?: (id?: string) => void;
  onView?: (id?: TermType) => void;
};

const TermTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const TermColumns = useMemo<Column<TermType>[]>(
    () => [
      { header: "Nama", accessor: "name", sortable: true, filterable: true },
      { header: "Slug", accessor: "slug", sortable: true, filterable: true },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: TermType) => (
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
        columns={TermColumns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </>
  );
};

export default TermTable;
