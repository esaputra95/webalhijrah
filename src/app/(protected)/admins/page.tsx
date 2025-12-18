"use client";

import React from "react";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import {
  FiFileText,
  FiPackage,
  FiHeart,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import dayjs from "dayjs";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";

const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  loading?: boolean;
}) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
    <div className={cn("p-3 rounded-lg flex-shrink-0", colorClass)}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider truncate">
        {title}
      </p>
      {loading ? (
        <div className="h-6 w-20 bg-gray-100 animate-pulse rounded mt-1" />
      ) : (
        <h3 className="text-lg lg:text-xl font-extrabold text-gray-800 mt-0.5 truncate leading-tight">
          {value}
        </h3>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  const { data, isLoading, isError } = useDashboard();

  React.useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data dashboard");
    }
  }, [isError]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const dashboardData = data?.data;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang kembali. Berikut adalah ringkasan data terbaru hari
          ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Artikel"
          value={dashboardData?.stats.totalArticles ?? 0}
          icon={FiFileText}
          colorClass="bg-blue-500"
          loading={isLoading}
        />
        <StatCard
          title="Total Program"
          value={dashboardData?.stats.totalPrograms ?? 0}
          icon={FiPackage}
          colorClass="bg-purple-500"
          loading={isLoading}
        />
        <StatCard
          title="Donasi Masuk"
          value={dashboardData?.stats.totalDonations ?? 0}
          icon={FiHeart}
          colorClass="bg-rose-500"
          loading={isLoading}
        />
        <StatCard
          title="Total Dana"
          value={formatCurrency(dashboardData?.stats.totalRevenue ?? 0)}
          icon={FiDollarSign}
          colorClass="bg-emerald-500"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FiTrendingUp className="text-rose-500" />
              Donasi Terbaru
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center gap-4 animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : dashboardData?.recentDonations.length ? (
              dashboardData.recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                      <FiHeart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {donation.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {donation.invoice_number} •{" "}
                        {donation.created_at
                          ? dayjs(donation.created_at).format(
                              "DD MMM YYYY, HH:mm"
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {formatCurrency(Number(donation.amount))}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                        donation.status === "settled"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-gray-400">Belum ada donasi.</p>
            )}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FiClock className="text-blue-500" />
              Artikel Terbaru
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center gap-4 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : dashboardData?.recentArticles.length ? (
              dashboardData.recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500">
                    {article.post_image ? (
                      /* eslint-disable @next/next/no-img-element */
                      <img
                        src={article.post_image}
                        alt={article.post_title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FiFileText className="w-6 h-6" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 truncate">
                      {article.post_title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {article.created_at
                        ? dayjs(article.created_at).format("DD MMM YYYY")
                        : "-"}{" "}
                      • Admin
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                      article.post_status === "publish"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {article.post_status}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-gray-400">
                Belum ada artikel.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
