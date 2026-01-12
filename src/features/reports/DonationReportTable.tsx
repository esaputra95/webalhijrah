"use client";
import React, { FC, useMemo } from "react";
import { Column, Table } from "@/components/ui/tables/Table";
import { DonationType } from "@/types/donationSchema";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";

type Props = {
  data?: DonationType[];
  isLoading: boolean;
  totalPages?: number;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    settled: "bg-green-100 text-green-800",
    expired: "bg-gray-100 text-gray-800",
    failed: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
};

const DonationReportTable: FC<Props> = ({ data, isLoading, totalPages }) => {
  const [isExporting, setIsExporting] = React.useState(false);
  // Get current filter params from URL to use for export
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const columns = useMemo<Column<DonationType>[]>(
    () => [
      {
        header: "No. Invoice",
        accessor: "invoice_number",
        sortable: true,
      },
      { header: "Nama", accessor: "name", sortable: true },
      {
        header: "No. Telepon",
        accessor: "phone_number",
        sortable: true,
      },
      {
        header: "Jumlah",
        accessor: "amount",
        sortable: true,
        render: (row) => formatCurrency(row.amount),
      },
      {
        header: "Status",
        accessor: "status",
        sortable: true,
        render: (row) => statusBadge(row.status),
      },
      {
        header: "Waktu Donasi",
        accessor: "created_at" as keyof DonationType,
        sortable: true,
        render: (row: DonationType) =>
          row.created_at && dayjs(row.created_at).format("DD/MM/YYYY HH:mm:ss"),
      },
    ],
    []
  );

  const fetchAllData = async () => {
    try {
      setIsExporting(true);
      const params = Object.fromEntries(searchParams.entries());
      const response = await api.get(apiUrl.donations, {
        params: { ...params, all: "true" },
      });
      return response.data?.data as DonationType[];
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
        "No. Invoice": item.invoice_number,
        Nama: item.name,
        "No. Telepon": item.phone_number || "-",
        Jumlah: item.amount,
        Status: item.status,
        "Waktu Donasi": item.created_at
          ? dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss")
          : "-",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Donasi");
    XLSX.writeFile(
      wb,
      `Laporan_Donasi_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`
    );
  };

  const exportPDF = async () => {
    const dataToExport = await fetchAllData();
    if (!dataToExport || dataToExport.length === 0) return;
    const doc = new jsPDF();
    doc.text("Laporan Donasi", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [
        [
          "No. Invoice",
          "Nama",
          "No. Telepon",
          "Jumlah",
          "Status",
          "Waktu Donasi",
        ],
      ],
      body: dataToExport.map((item) => [
        item.invoice_number,
        item.name,
        item.phone_number || "-",
        formatCurrency(item.amount),
        item.status,
        item.created_at
          ? dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss")
          : "-",
      ]),
    });
    doc.save(`Laporan_Donasi_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`);
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

export default DonationReportTable;
