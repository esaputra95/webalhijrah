import React, { FC, useMemo } from "react";
import { SettingType } from "@/types/settingSchema";
import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";

interface SettingTableProps {
  data?: SettingType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate: (data: SettingType) => void;
  onDelete: (id: number) => void;
}

const SettingTable: FC<SettingTableProps> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
}) => {
  const Columns = useMemo<Column<SettingType>[]>(
    () => [
      {
        header: "Type",
        accessor: "type",
        sortable: true,
        filterable: true,
      },
      {
        header: "Key",
        accessor: "key",
        sortable: true,
        filterable: true,
      },
      {
        header: "Label",
        accessor: "label",
        sortable: true,
        filterable: true,
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row) => (
          <ActionButton
            onUpdate={() => onUpdate(row)}
            onDelete={() => onDelete(row?.id ?? 0)}
          />
        ),
      },
    ],
    [onUpdate, onDelete]
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

export default SettingTable;
