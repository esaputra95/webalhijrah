import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { PostType } from "@/types/postSchema";
import React, { FC, useMemo } from "react";

type Props = {
  data?: PostType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: PostType) => void;
  onDelete?: (id?: string) => void;
  onView?: (id?: PostType) => void;
};

const PostTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const PostColumns = useMemo<Column<PostType>[]>(
    () => [
      {
        header: "Judul",
        accessor: "post_title",
        sortable: true,
        filterable: true,
      },
      {
        header: "Slug",
        accessor: "post_name",
        sortable: true,
        filterable: true,
      },
      {
        header: "Status",
        accessor: "post_status",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: [
          { value: "draft", label: "Draft" },
          { value: "publish", label: "Publish" },
          { value: "pending", label: "Pending" },
          { value: "private", label: "Private" },
          { value: "trash", label: "Trash" },
        ],
      },
      {
        header: "Tipe",
        accessor: "post_type",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: [
          { value: "post", label: "Post" },
          { value: "donation", label: "Donasi" },
        ],
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: PostType) => (
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
        columns={PostColumns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </>
  );
};

export default PostTable;
