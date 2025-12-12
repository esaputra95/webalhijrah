// src/app/donasi/terima-kasih/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const transactionStatus = searchParams.get("transaction_status");

  const isSuccess =
    transactionStatus === "settlement" || transactionStatus === "capture";
  const isPending = transactionStatus === "pending";
  const isFailed =
    transactionStatus === "deny" ||
    transactionStatus === "cancel" ||
    transactionStatus === "expire";

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success State */}
        {(isSuccess || !transactionStatus) && (
          <div className="text-center">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                {/* Decorative Circles */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-300 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Jazākumullāhu Khairan!
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6">
              Terima Kasih atas Donasi Anda
            </p>

            {/* Card Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8 border border-emerald-100">
              <div className="mb-6">
                <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full mb-4">
                  <span className="font-semibold">✅ Pembayaran Berhasil</span>
                </div>
              </div>

              {orderId && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Nomor Invoice:</p>
                  <p className="text-lg font-bold text-gray-900 font-mono">
                    {orderId}
                  </p>
                </div>
              )}

              <div className="space-y-4 text-left bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-3 text-center">
                  📖 Doa untuk Donatur
                </h3>
                <p className="text-gray-700 text-center leading-relaxed mb-3 text-lg font-semibold">
                  بَارَكَ اللّٰهُ لَكَ فِي مَالِكَ وَأَهْلِكَ
                </p>
                <p className="text-gray-600 text-center italic">
                  &quot;Semoga Allah memberkahi hartamu dan keluargamu&quot;
                </p>
              </div>

              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>
                  🌟 Donasi Anda telah kami terima dan akan segera disalurkan
                  untuk pembangunan masjid dan kegiatan dakwah.
                </p>
                <p>
                  📧 Bukti pembayaran telah dikirim ke email Anda (jika Anda
                  memasukkan email).
                </p>
                <p className="font-semibold text-emerald-700">
                  💚 Semoga Allah membalas kebaikan Anda dengan pahala yang
                  berlipat ganda!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donasi"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Donasi Lagi
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg border border-gray-200"
              >
                Kembali ke Beranda
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-4">
                Butuh bantuan atau ada pertanyaan?
              </p>
              <p className="text-gray-600">
                Hubungi kami di:{" "}
                <a
                  href="mailto:info@markaz-alhijrah.id"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  info@markaz-alhijrah.id
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Pending State */}
        {isPending && (
          <div className="text-center">
            {/* Pending Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <svg
                  className="w-16 h-16 text-white animate-spin-slow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Menunggu Pembayaran
            </h1>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8">
              <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full mb-6">
                <span className="font-semibold">⏳ Pembayaran Pending</span>
              </div>

              {orderId && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Nomor Invoice:</p>
                  <p className="text-lg font-bold text-gray-900 font-mono">
                    {orderId}
                  </p>
                </div>
              )}

              <p className="text-gray-600 mb-6 leading-relaxed">
                Pembayaran Anda sedang dalam proses. Silakan selesaikan
                pembayaran sesuai instruksi yang telah diberikan. Status akan
                diupdate otomatis setelah pembayaran berhasil.
              </p>

              <Link
                href="/donasi"
                className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
              >
                Kembali
              </Link>
            </div>
          </div>
        )}

        {/* Failed State */}
        {isFailed && (
          <div className="text-center">
            {/* Failed Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pembayaran Gagal
            </h1>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8">
              <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full mb-6">
                <span className="font-semibold">❌ Transaksi Gagal</span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi
                atau gunakan metode pembayaran yang berbeda.
              </p>

              <Link
                href="/donasi"
                className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
              >
                Coba Lagi
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TerimaKasihPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
