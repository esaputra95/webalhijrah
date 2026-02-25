"use client";

import TitleContent from "@/components/layouts/TitleContent";
import TextInput from "@/components/ui/inputs/TextInput";
import { usePageAnalytics } from "@/hooks/reports/usePageAnalytics";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value || 0);

export default function PageAnalyticsReportPage() {
  const [startDate, setStartDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));
  const [qInput, setQInput] = useState("");

  const [filters, setFilters] = useState({
    startAt: dayjs().startOf("month").format("YYYY-MM-DD"),
    endAt: dayjs().endOf("month").format("YYYY-MM-DD"),
    q: "",
    page: 1,
    limit: 10,
    sortby: "totalViews",
    sort: "desc",
  });

  const { data, isLoading } = usePageAnalytics(filters);
  const rows = data?.data?.rows || [];
  const summary = data?.data?.summary;
  const trends = data?.data?.trends || [];
  const meta = data?.metaData;

  const maxTrend = useMemo(
    () => Math.max(1, ...trends.map((item) => item.totalViews)),
    [trends],
  );

  const handleFilter = () => {
    setFilters((prev) => ({
      ...prev,
      startAt: startDate,
      endAt: endDate,
      q: qInput.trim(),
      page: 1,
    }));
  };

  const handleReset = () => {
    const start = dayjs().startOf("month").format("YYYY-MM-DD");
    const end = dayjs().endOf("month").format("YYYY-MM-DD");
    setStartDate(start);
    setEndDate(end);
    setQInput("");
    setFilters({
      startAt: start,
      endAt: end,
      q: "",
      page: 1,
      limit: 10,
      sortby: "totalViews",
      sort: "desc",
    });
  };

  const onPageChange = (nextPage: number) => {
    if (!meta || nextPage < 1 || nextPage > meta.totalPage) return;
    setFilters((prev) => ({ ...prev, page: nextPage }));
  };

  return (
    <div className="p-4 space-y-4">
      <TitleContent
        title="Analytics Halaman"
        subTitle="Pantau jumlah view dan pengunjung unik per halaman"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
            Total Views
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-2">
            {isLoading ? "..." : formatNumber(summary?.totalViews || 0)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
            Unique Visitors
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-2">
            {isLoading ? "..." : formatNumber(summary?.uniqueVisitors || 0)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
            Unique IP
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-2">
            {isLoading ? "..." : formatNumber(summary?.uniqueIps || 0)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
            Halaman Terdata
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-2">
            {isLoading ? "..." : formatNumber(summary?.totalPages || 0)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
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
            label="Cari Halaman"
            placeholder="/articles atau /donasi"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="h-10 px-5 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Filter
            </button>
            <button
              onClick={handleReset}
              className="h-10 px-5 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Top Halaman</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Path</th>
                  <th className="px-4 py-3 text-left">Route Key</th>
                  <th className="px-4 py-3 text-right">Views</th>
                  <th className="px-4 py-3 text-right">Unique</th>
                  <th className="px-4 py-3 text-left">IP Terakhir</th>
                  <th className="px-4 py-3 text-left">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={6}>
                      Memuat data...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={6}>
                      Belum ada data analytics pada rentang tanggal ini.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={`${row.route_key}-${row.path}`} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-700">{row.path}</td>
                      <td className="px-4 py-3 text-slate-500">{row.route_key}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(row.totalViews)}</td>
                      <td className="px-4 py-3 text-right">
                        {formatNumber(row.uniqueVisitors)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {row.latestIp || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {row.lastVisit
                          ? dayjs(row.lastVisit).format("DD MMM YYYY HH:mm")
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {meta?.page || 1} / {meta?.totalPage || 1}
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded border text-xs"
                onClick={() => onPageChange((meta?.page || 1) - 1)}
              >
                Prev
              </button>
              <button
                className="px-3 py-1.5 rounded border text-xs"
                onClick={() => onPageChange((meta?.page || 1) + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Trend Harian</h3>
          </div>
          <div className="p-4 space-y-3">
            {isLoading ? (
              <p className="text-sm text-slate-500">Memuat trend...</p>
            ) : trends.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada data trend.</p>
            ) : (
              trends.map((trend) => (
                <div key={trend.day || "no-day"}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{trend.day ? dayjs(trend.day).format("DD MMM") : "-"}</span>
                    <span>{formatNumber(trend.totalViews)} views</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded">
                    <div
                      className="h-2 bg-blue-600 rounded"
                      style={{ width: `${Math.max(4, (trend.totalViews / maxTrend) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
