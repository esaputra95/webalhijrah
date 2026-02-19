import { Column, Table } from "@/components/ui/tables/Table";
import { HalaqohPromotion } from "@/types/halaqoh";
import React, { FC, useMemo } from "react";
import Button from "@/components/ui/buttons/Button";
import { FiRotateCcw } from "react-icons/fi";
import { useDeletePromotion } from "@/hooks/masters/useHalaqohPromotions";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";

type Props = {
  data?: HalaqohPromotion[];
  isLoading: boolean;
  totalPages?: number;
};

const typeLabel: Record<string, string> = {
  PROMOTION: "⬆ Naik Kelas",
  DEMOTION: "⬇ Turun Kelas",
  INITIAL_PLACEMENT: "📍 Penempatan Awal",
};

const PromotionTable: FC<Props> = ({ data, isLoading, totalPages }) => {
  const deletePromotion = useDeletePromotion();

  const handleCancel = (id: number) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin membatalkan perpindahan ini? Status peserta akan dikembalikan ke kelas asal.",
      )
    ) {
      deletePromotion.mutate(id, {
        onSuccess: () => toast.success("Perpindahan berhasil dibatalkan"),
        onError: (err) => toast.error(handleErrorResponse(err)),
      });
    }
  };

  const Columns = useMemo<Column<HalaqohPromotion>[]>(
    () => [
      {
        header: "Peserta",
        accessor: "user_id",
        render: (row: HalaqohPromotion) => (
          <div>
            <p className="font-medium">{row.user?.name || "-"}</p>
            <p className="text-xs text-gray-500">{row.user?.email || ""}</p>
          </div>
        ),
      },
      {
        header: "Kategori",
        accessor: "category_id",
        render: (row: HalaqohPromotion) => row.category?.title || "-",
      },
      {
        header: "Dari",
        accessor: "from_halaqoh_id",
        render: (row: HalaqohPromotion) => (
          <div>
            <p className="text-sm">{row.from_level?.title || "-"}</p>
            <p className="text-xs text-gray-500">
              {row.from_halaqoh?.title || "-"}
            </p>
          </div>
        ),
      },
      {
        header: "Ke",
        accessor: "to_halaqoh_id",
        render: (row: HalaqohPromotion) => (
          <div>
            <p className="text-sm font-medium">{row.to_level?.title || "-"}</p>
            <p className="text-xs text-gray-500">
              {row.to_halaqoh?.title || "-"}
            </p>
          </div>
        ),
      },
      {
        header: "Tipe",
        accessor: "type",
        render: (row: HalaqohPromotion) => (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              row.type === "PROMOTION"
                ? "bg-green-100 text-green-700"
                : row.type === "DEMOTION"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
            }`}
          >
            {typeLabel[row.type] || row.type}
          </span>
        ),
      },
      {
        header: "Nilai",
        accessor: "test_score",
        render: (row: HalaqohPromotion) =>
          row.test_score !== null && row.test_score !== undefined
            ? String(row.test_score)
            : "-",
      },
      {
        header: "Tanggal",
        accessor: "promoted_at",
        render: (row: HalaqohPromotion) =>
          row.promoted_at
            ? new Date(row.promoted_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-",
      },
      {
        header: "Admin",
        accessor: "promoted_by",
        render: (row: HalaqohPromotion) => row.admin?.name || "-",
      },
      {
        header: "Aksi",
        accessor: "id" as any,
        render: (row: HalaqohPromotion) => (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleCancel(row.id)}
            disabled={deletePromotion.isPending}
          >
            <FiRotateCcw className="mr-1" /> Batalkan
          </Button>
        ),
      },
    ],
    [deletePromotion.isPending, handleCancel],
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

export default PromotionTable;
