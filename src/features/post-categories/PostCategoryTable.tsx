import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { PostCategoryType } from "@/types/postCategorySchema";
import React, { FC, useMemo } from "react";

type Props = {
  data?: PostCategoryType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: PostCategoryType) => void;
  onDelete?: (id?: string) => void;
  onView?: (id?: PostCategoryType) => void;
};
const PostCategoryTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const Columns = useMemo<Column<PostCategoryType>[]>(
    () => [
      { header: "Judul", accessor: "title", sortable: true, filterable: true },
      {
        header: "Type",
        accessor: "type",
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
        header: "Aksi",
        accessor: "id",
        render: (row: PostCategoryType) => (
          <ActionButton
            onUpdate={() => onUpdate?.(row)}
            onDelete={() => onDelete?.(String(row?.id))}
            onView={() => onView?.(row)}
          />
        ),
      },
    ],
    []
  );
  return (
    <>
      <Table
        data={data ?? []}
        columns={Columns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </>
  );
};

export default PostCategoryTable;
