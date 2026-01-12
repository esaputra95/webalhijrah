"use client";
import React, { useEffect, useState } from "react";
import TitleContent from "@/components/layouts/TitleContent";
import { DonationReportTable } from "@/features/reports";
import { useDonations } from "@/hooks/masters/useDonations";
import { toast } from "react-toastify";
import TextInput from "@/components/ui/inputs/TextInput";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import dayjs from "dayjs";

const DonationReportPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(
    searchParams.get("startAt") || dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endAt") || dayjs().endOf("month").format("YYYY-MM-DD")
  );
  const [invoiceNumber, setInvoiceNumber] = useState(
    searchParams.get("invoice_number") || ""
  );
  const [name, setName] = useState(searchParams.get("name") || "");
  const [phone, setPhone] = useState(searchParams.get("phone_number") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  const { data, isLoading, isError } = useDonations();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Laporan - " + isError);
    }
  }, [isError]);

  // Sync initial defaults to URL if not present
  useEffect(() => {
    if (!searchParams.get("startAt") && !searchParams.get("endAt")) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("startAt", startDate);
      sp.set("endAt", endDate);
      router.replace(`${pathname}?${sp.toString()}`);
    }
  }, [searchParams, startDate, endDate, pathname, router]);

  const handleFilter = () => {
    const sp = new URLSearchParams(searchParams.toString());
    if (startDate) sp.set("startAt", startDate);
    else sp.delete("startAt");

    if (endDate) sp.set("endAt", endDate);
    else sp.delete("endAt");

    if (invoiceNumber) sp.set("invoice_number", invoiceNumber);
    else sp.delete("invoice_number");

    if (name) sp.set("name", name);
    else sp.delete("name");

    if (phone) sp.set("phone_number", phone);
    else sp.delete("phone_number");

    if (status) sp.set("status", status);
    else sp.delete("status");

    sp.set("page", "1");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const handleReset = () => {
    const start = dayjs().startOf("month").format("YYYY-MM-DD");
    const end = dayjs().endOf("month").format("YYYY-MM-DD");
    setStartDate(start);
    setEndDate(end);
    setInvoiceNumber("");
    setName("");
    setPhone("");
    setStatus("");

    const sp = new URLSearchParams();
    sp.set("startAt", start);
    sp.set("endAt", end);
    sp.set("page", "1");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="p-4">
      <TitleContent title="Laporan Donasi" />

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <TextInput
            label="Tanggal Mulai"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextInput
            label="Tanggal Selesai"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <TextInput
            label="No. Invoice"
            placeholder="Cari No. Invoice"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <TextInput
            label="Nama"
            placeholder="Cari Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label="No. Telepon"
            placeholder="Cari No. Telepon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block h-10 w-full px-3 rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 outline-none"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="settled">Settled</option>
              <option value="expired">Expired</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="flex gap-2 lg:col-span-2">
            <button
              onClick={handleFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition h-10 font-medium"
            >
              Filter
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded shadow transition h-10 font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border-l-4 border-blue-600">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Total Donasi
        </h2>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(data?.metaData?.total_amount || 0)}
        </p>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <DonationReportTable
          data={data?.data}
          isLoading={isLoading}
          totalPages={data?.metaData?.totalPage}
        />
      </div>
    </div>
  );
};

export default DonationReportPage;
