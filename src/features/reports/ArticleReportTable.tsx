"use client";
import React, { FC, useMemo } from "react";
import { Column, Table } from "@/components/ui/tables/Table";
import { PostType } from "@/types/postSchema";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";

type Props = {
  data?: PostType[];
  isLoading: boolean;
  totalPages?: number;
};

const ArticleReportTable: FC<Props> = ({ data, isLoading, totalPages }) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const columns = useMemo<Column<PostType>[]>(
    () => [
      {
        header: "Judul",
        accessor: "post_title",
        sortable: true,
      },
      {
        header: "Slug",
        accessor: "post_name",
        sortable: true,
      },
      {
        header: "Status",
        accessor: "post_status",
        sortable: true,
        render: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.post_status === "publish"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.post_status}
          </span>
        ),
      },
      {
        header: "Tipe",
        accessor: "post_type",
        sortable: true,
      },
      {
        header: "Tanggal Dibuat",
        accessor: "created_at" as keyof PostType,
        sortable: true,
        render: (row: PostType) =>
          row.created_at && dayjs(row.created_at).format("DD/MM/YYYY HH:mm:ss"),
      },
    ],
    []
  );

  const fetchAllData = async () => {
    try {
      setIsExporting(true);
      const params = Object.fromEntries(searchParams.entries());
      const response = await api.get(apiUrl.posts, {
        params: { ...params, all: "true" },
      });
      return response.data?.data as PostType[];
    } catch (error) {
      toast.error("Gagal mengambil data untuk export");
      console.error(error);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const exportExcel = async () => {
    const dataToExport = await fetchAllData();
    if (!dataToExport || dataToExport.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(
      dataToExport.map((item) => ({
        Judul: item.post_title,
        Slug: item.post_name,
        Status: item.post_status,
        Tipe: item.post_type,
        "Tanggal Dibuat": item.created_at
          ? dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss")
          : "-",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Artikel");
    XLSX.writeFile(
      wb,
      `Laporan_Artikel_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`
    );
  };

  const exportPDF = async () => {
    const dataToExport = await fetchAllData();
    if (!dataToExport || dataToExport.length === 0) return;
    const doc = new jsPDF();
    doc.text("Laporan Artikel", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Judul", "Slug", "Status", "Tipe", "Tanggal Dibuat"]],
      body: dataToExport.map((item) => [
        item.post_title,
        item.post_name,
        item.post_status,
        item.post_type,
        item.created_at
          ? dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss")
          : "-",
      ]),
    });
    doc.save(`Laporan_Artikel_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`);
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={exportExcel}
          disabled={isExporting || !data || data.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? "Exporting..." : "Export Excel"}
        </button>
        <button
          onClick={exportPDF}
          disabled={isExporting || !data || data.length === 0}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? "Exporting..." : "Export PDF"}
        </button>
      </div>
      <Table
        data={data ?? []}
        columns={columns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </div>
  );
};

export default ArticleReportTable;
