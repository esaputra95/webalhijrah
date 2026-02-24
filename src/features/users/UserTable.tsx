import React, { FC, useMemo } from "react";
import { UserType } from "@/types/userSchema";
import { Column, Table } from "@/components/ui/tables/Table";
import ActionButton from "@/components/ui/buttons/ActionButton";

interface UserTableProps {
  data?: UserType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate: (data: UserType) => void;
  onDelete: (id: number) => void;
}

const UserTable: FC<UserTableProps> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
}) => {
  const Columns = useMemo<Column<UserType>[]>(
    () => [
      {
        header: "Nama",
        accessor: "name",
        sortable: true,
        filterable: true,
      },
      {
        header: "Email",
        accessor: "email",
        sortable: true,
        filterable: true,
      },
      {
        header: "Role",
        accessor: "role",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: [
          { label: "ADMIN", value: "ADMIN" },
          { label: "ADMIN_TAKMIR", value: "ADMIN_TAKMIR" },
          { label: "ADMIN_KESANTRIAN", value: "ADMIN_KESANTRIAN" },
          { label: "MENTOR", value: "MENTOR" },
          { label: "USER", value: "USER" },
        ],
        render: (row) => {
          let badgeColor = "bg-gray-100 text-gray-800";
          if (row.role === "ADMIN") badgeColor = "bg-red-100 text-red-800";
          else if (row.role === "ADMIN_TAKMIR")
            badgeColor = "bg-blue-100 text-blue-800";
          else if (row.role === "ADMIN_KESANTRIAN")
            badgeColor = "bg-green-100 text-green-800";
          else if (row.role === "MENTOR")
            badgeColor = "bg-purple-100 text-purple-800";
          else if (row.role === "USER")
            badgeColor = "bg-orange-100 text-orange-800";

          return (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeColor}`}
            >
              {row.role}
            </span>
          );
        },
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
    [onUpdate, onDelete],
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

export default UserTable;
