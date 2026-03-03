"use client";

import Link from "next/link";
import {
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
  FiHome,
  FiCoffee,
  FiBookOpen,
  FiHeart,
} from "react-icons/fi";
import PublicNavbar from "@/components/layouts/PublicNavbar";

export default function ItikafSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header Section */}
          <div className="bg-brand-brown p-8 text-center text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FiCheckCircle size={120} />
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <FiCheckCircle size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Pendaftaran Berhasil!</h1>
            <p className="text-slate-200 max-w-sm mx-auto">
              Alhamdulillah, data pendaftaran I&apos;tikaf Anda telah kami
              terima dan tersimpan di sistem kami.
            </p>
          </div>

          <div className="p-8 space-y-10">
            {/* Notification Alert */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <FiInfo className="text-green-600 mt-1 shrink-0" size={20} />
              <div className="text-sm text-green-800">
                <p className="font-bold mb-1">Pesan WhatsApp Telah Dikirim</p>
                <p>
                  Informasi pendaftaran, fasilitas, dan tata tertib telah
                  dikirimkan ke nomor WhatsApp yang Anda daftarkan.
                </p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Facilities */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-brown font-bold border-b pb-2">
                  <FiCoffee size={20} />
                  <h3>FASILITAS YANG DISEDIAKAN</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Ta&apos;jil dan Makan Berbuka</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Makan Sahur & Snack Malam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Pelayanan Kesehatan Ringan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>ID Card Peserta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Safety Box (Penitipan Barang Berharga)</span>
                  </li>
                </ul>
              </div>

              {/* Equipment */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-brown font-bold border-b pb-2">
                  <FiBookOpen size={20} />
                  <h3>PERLENGKAPAN HARUS DIBAWA</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Al Qur&apos;an & Buku Doa/Zikir</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Pakaian Ganti & Peralatan Ibadah</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Peralatan Mandi & Pribadi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Bantal, Selimut & Kasur Lipat</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Rules & Prohibitions */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
                <FiAlertTriangle size={20} />
                <h3>TATA TERTIB & LARANGAN PENTING</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <ul className="space-y-2 text-slate-600 list-disc pl-5">
                  <li>Berpakaian Muslim/Muslimah yang Rapi dan Sopan.</li>
                  <li>
                    Wajib memakai ID Card selama berada di area I&apos;tikaf.
                  </li>
                  <li>
                    Fokus beribadah, dilarang menyibukkan diri dengan
                    gadget/game.
                  </li>
                </ul>
                <ul className="space-y-2 text-slate-600 list-disc pl-5">
                  <li className="text-red-600 font-medium">
                    Batas maksimal tas bawaan adalah 1 (SATU) ransel/tas.
                  </li>
                  <li className="text-red-600 font-medium">
                    Dilarang membawa Laptop/Notebook ke area I&apos;tikaf.
                  </li>
                  <li className="text-red-600 font-medium">
                    Dilarang membawa barang berharga yang berlebihan.
                  </li>
                </ul>
              </div>
            </div>

            {/* Donation CTA */}
            <div className="bg-brand-brown/5 border-2 border-dashed border-brand-brown/20 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-brown/10 rounded-full mb-4">
                <FiHeart className="text-brand-brown" size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-brown mb-2">
                Dukung Dakwah & Operasional Masjid
              </h3>
              <p className="text-slate-600 max-w-lg mx-auto mb-6">
                Infaq dan sedekah Anda sangat berarti untuk mendukung kelancaran
                program I&apos;tikaf dan kegiatan dakwah lainnya di Masjid
                Markaz Al Hijrah Nusantara.
              </p>
              <Link
                href="/donasi"
                className="inline-flex items-center gap-2 px-8 py-3 bg-brand-brown text-white rounded-full font-bold hover:bg-brand-brown/90 transition-all shadow-md hover:shadow-brand-brown/20"
              >
                <FiHeart size={18} />
                Infaq & Sedekah Sekarang
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-8 py-3 bg-brand-brown text-white rounded-full font-bold hover:bg-brand-brown/90 transition-all shadow-lg hover:shadow-brand-brown/20"
              >
                <FiHome size={18} />
                Kembali ke Beranda
              </Link>
              <Link
                href="/itikaf/registration"
                className="px-8 py-3 bg-white border-2 border-brand-brown text-brand-brown rounded-full font-bold hover:bg-slate-50 transition-all"
              >
                Daftarkan Peserta Lain
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          &copy; {new Date().getFullYear()} Masjid Markaz Al Hijrah Nusantara.
          Seluruh Hak Cipta Dilindungi.
        </p>
      </main>
    </div>
  );
}
