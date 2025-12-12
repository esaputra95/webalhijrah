import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { SliderType } from "@/types/masters/silderSchema";
import React, { FC, useMemo } from "react";
import Image from "next/image";

type Props = {
  data?: SliderType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: SliderType) => void;
  onDelete?: (id?: string) => void;
  onView?: (id?: SliderType) => void;
};

const SliderTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const Columns = useMemo<Column<SliderType>[]>(
    () => [
      {
        header: "Image",
        accessor: "image",
        sortable: false,
        filterable: false,
        render: (row: SliderType) =>
          row.image ? (
            <div className="relative h-12 w-20">
              <Image
                src={row.image}
                alt={row.description || "Slider"}
                fill
                className="object-cover rounded"
              />
            </div>
          ) : (
            <span className="text-gray-400">No Image</span>
          ),
      },
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
        render: (row: SliderType) => (
          <ActionButton
            onUpdate={() => onUpdate?.(row)}
            onDelete={() => onDelete?.(String(row?.id))}
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
        columns={Columns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </>
  );
};

export default SliderTable;
