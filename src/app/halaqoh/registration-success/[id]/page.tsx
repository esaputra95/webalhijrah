"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useHalaqohRegistrations } from "@/hooks/masters/useHalaqohRegistrations";
import Spinner from "@/components/ui/loading/Spinner";
import Button from "@/components/ui/buttons/Button";
import { FiCheckCircle, FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export default function RegistrationSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: registrationsData, isLoading } = useHalaqohRegistrations();

  const registration = registrationsData?.data?.find(
    (r) => r.id === Number(id),
  );

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Data pendaftaran tidak ditemukan
        </h2>
        <Button onClick={() => router.push("/halaqoh")}>
          Kembali ke Program
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-emerald-500 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FiCheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Pendaftaran Berhasil!</h1>
            <p className="opacity-90">
              Jazakumullahu Khayran telah mendaftar di program{" "}
              {registration.category?.title}.
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#4A4C70] mb-4 border-b pb-2">
                Informasi Jadwal Tes
              </h2>
              {registration.date_test ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                      <FiCalendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        Tanggal Tes
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        {dayjs(registration.date_test).format(
                          "dddd, D MMMM YYYY",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                      <FiClock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        Waktu Tes
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        {dayjs(registration.date_test).format("HH:mm")} WIB
                      </p>
                    </div>
                  </div>

                  {registration.category?.link_meet && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                        <FiMapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                          Link Google Meet
                        </p>
                        <a
                          href={registration.category.link_meet}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-bold text-emerald-600 hover:underline break-all"
                        >
                          Klik di sini untuk bergabung
                        </a>
                      </div>
                    </div>
                  )}

                  {!registration.category?.link_meet && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                        <FiMapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                          Lokasi/Metode
                        </p>
                        <p className="text-lg font-bold text-slate-800">
                          Online
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
                  <p className="text-amber-800 font-medium">
                    Jadwal tes belum ditentukan.
                  </p>
                  <p className="text-sm text-amber-600 mt-1">
                    Panitia akan menghubungi Anda segera melalui WhatsApp.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 group transition-all">
              <h3 className="font-bold text-slate-800 mb-2">
                Langkah Selanjutnya:
              </h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                <li>Pastikan nomor WhatsApp Anda aktif.</li>
                <li>Siapkan diri untuk mengikuti tes sesuai jadwal di atas.</li>
                <li>Simpan informasi ini sebagai bukti pendaftaran.</li>
                <li>
                  Diharapkan agar nama dan email akun google meet sesuai dengan
                  yang diisi di formulir.
                </li>
                <li>
                  Hubungi Admin di nomor 08117550202 untuk informasi lebih
                  lanjut.
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outlined"
                className="flex-1 h-12 rounded-xl"
                onClick={() => router.push("/dashboard")}
              >
                Ke Dashboard
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl font-bold"
                onClick={() => router.push("/halaqoh")}
              >
                Lihat Program Lain
              </Button>
            </div>
          </div>

          <div className="bg-slate-100 p-4 text-center">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              Al-Hijrah Panel &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
