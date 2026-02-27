"use client";

import DailyVisitorsChart from "@/components/charts/DailyVisitorsChart";
import TitleContent from "@/components/layouts/TitleContent";
import TextInput from "@/components/ui/inputs/TextInput";
import Button from "@/components/ui/buttons/Button";
import { usePageAnalytics } from "@/hooks/reports/usePageAnalytics";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  HiOutlineEye,
  HiOutlineUsers,
  HiOutlineGlobeAlt,
  HiOutlineDocumentText,
  HiFunnel,
  HiArrowPath,
  HiChartBar,
  HiArrowTrendingUp,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value || 0);

// Fixed 30-day range for the chart (independent of filters)
const CHART_START = dayjs().subtract(29, "day").format("YYYY-MM-DD");
const CHART_END = dayjs().format("YYYY-MM-DD");

export default function PageAnalyticsReportPage() {
  const [startDate, setStartDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("month").format("YYYY-MM-DD"),
  );
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

  // Separate fetch for the 30-day chart
  const { data: chartData, isLoading: chartLoading } = usePageAnalytics({
    startAt: CHART_START,
    endAt: CHART_END,
    limit: 1,
  });

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Views",
            value: summary?.totalViews,
            icon: HiOutlineEye,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Unique Visitors",
            value: summary?.uniqueVisitors,
            icon: HiOutlineUsers,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Unique IP",
            value: summary?.uniqueIps,
            icon: HiOutlineGlobeAlt,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Halaman Terdata",
            value: summary?.totalPages,
            icon: HiOutlineDocumentText,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {isLoading ? (
                  <span className="inline-block w-12 h-6 bg-slate-100 animate-pulse rounded" />
                ) : (
                  formatNumber(item.value || 0)
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 30-Day Visitors Chart ── */}
      <DailyVisitorsChart
        data={chartData?.data?.trends || []}
        isLoading={chartLoading}
      />

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
            <Button onClick={handleFilter} className="w-full md:w-auto">
              <HiFunnel className="w-5 h-5" />
              Filter
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleReset}
              className="w-full md:w-auto"
            >
              <HiArrowPath className="w-5 h-5" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <HiChartBar className="w-5 h-5 text-blue-600" />
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
                    <tr
                      key={`${row.route_key}-${row.path}`}
                      className="border-t border-slate-100"
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {row.path}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {row.route_key}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatNumber(row.totalViews)}
                      </td>
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
              <Button
                size="small"
                variant="outlined"
                onClick={() => onPageChange((meta?.page || 1) - 1)}
                disabled={meta?.page === 1}
              >
                <HiChevronLeft className="w-4 h-4" />
                Prev
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => onPageChange((meta?.page || 1) + 1)}
                disabled={meta?.page === meta?.totalPage}
              >
                Next
                <HiChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <HiArrowTrendingUp className="w-5 h-5 text-emerald-600" />
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
                    <span>
                      {trend.day ? dayjs(trend.day).format("DD MMM") : "-"}
                    </span>
                    <span>{formatNumber(trend.totalViews)} views</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded">
                    <div
                      className="h-2 bg-blue-600 rounded"
                      style={{
                        width: `${Math.max(4, (trend.totalViews / maxTrend) * 100)}%`,
                      }}
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
