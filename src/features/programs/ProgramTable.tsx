import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { ProgramType } from "@/types/programSchema";
import React, { FC, useMemo } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type Props = {
  data?: ProgramType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: ProgramType) => void;
  onDelete?: (id?: number) => void;
  onView?: (data?: ProgramType) => void;
};

const ProgramTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const ProgramColumns = useMemo<Column<ProgramType>[]>(
    () => [
      {
        header: "Judul Program",
        accessor: "title",
        sortable: true,
        filterable: true,
      },
      {
        header: "Slug",
        accessor: "slug",
        sortable: true,
        filterable: true,
      },
      {
        header: "Tanggal",
        accessor: "date",
        sortable: true,
        render: (row) =>
          row.date
            ? format(new Date(row.date), "dd MMMM yyyy HH:mm", {
                locale: idLocale,
              })
            : "-",
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: ProgramType) => (
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
        columns={ProgramColumns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </>
  );
};

export default ProgramTable;
