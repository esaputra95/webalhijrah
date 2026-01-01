"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useGroupedSettings } from "@/hooks/masters/useSettings";

type FormValues = { email: string; password: string };
const DEFAULT_AFTER_LOGIN = "/";

export default function LoginClient() {
  const { data: newSettingsData } = useGroupedSettings();

  const herodesc = [
    { label: "Jamaah", value: newSettingsData?.Hero?.jamaah },
    { label: "Santri", value: newSettingsData?.Hero?.santri },
    { label: "Kegiatan/Bulan", value: newSettingsData?.Hero?.kegiatan },
    { label: "Program", value: newSettingsData?.Hero?.program },
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const { status } = useSession();

  // jika sudah login dan nyasar ke /login → lempar ke dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(DEFAULT_AFTER_LOGIN);
    }
  }, [status, router]);

  // (opsional) bersihkan ?callbackUrl= (kosong) jika masih ada
  useEffect(() => {
    const raw = sp.get("callbackUrl");
    if (raw !== null && raw.trim() === "") {
      router.replace("/login");
    }
  }, [sp, router]);

  const callbackUrl = useMemo(() => {
    const raw = sp.get("callbackUrl");
    if (!raw || raw.trim() === "") return DEFAULT_AFTER_LOGIN;

    try {
      const url = raw.startsWith("http")
        ? new URL(raw)
        : new URL(raw, window.location.origin);
      const sameOrigin = url.origin === window.location.origin;
      const bad =
        !sameOrigin ||
        url.pathname === "/login" ||
        url.pathname.startsWith("/api/auth");
      if (bad) return DEFAULT_AFTER_LOGIN;

      url.searchParams.delete("callbackUrl"); // buang nesting
      const qs = url.searchParams.toString();
      return qs ? `${url.pathname}?${qs}` : url.pathname;
    } catch {
      if (raw.startsWith("/") && !raw.startsWith("/login")) return raw;
      return DEFAULT_AFTER_LOGIN;
    }
  }, [sp]);

  const onSubmit = async (v: FormValues) => {
    setErr(null);
    setLoading(true);
    const res = await signIn("credentials", {
      ...v,
      redirect: false, // kontrol manual
      callbackUrl,
    });
    setLoading(false);

    if (!res) return setErr("Unexpected error");
    if (res.error) return setErr("Email atau password salah");

    router.replace(res.url ?? callbackUrl);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EFC940] to-[#d4b035] text-[#4A4C70] rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                M
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-[#4A4C70]">
              Selamat Datang
            </h1>
            <p className="text-gray-600">
              Masuk ke panel admin Markaz Al-Hijrah
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {err}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@markaz-alhijrah.id"
                className={`w-full text-gray-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EFC940] focus:border-transparent transition-all ${
                  errors.email
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300"
                }`}
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format email tidak valid",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full text-gray-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EFC940] focus:border-transparent transition-all ${
                  errors.password
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300"
                }`}
                {...register("password", {
                  required: "Password wajib diisi",
                  minLength: {
                    value: 6,
                    message: "Password minimal 6 karakter",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#4A4C70] to-gray-800 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-sm text-gray-600">
            <Link
              href="/"
              className="text-[#4A4C70] hover:text-[#EFC940] font-medium transition-colors"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image with Overlay */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#4A4C70] to-gray-900">
        <div className="absolute inset-0 bg-[url('/images/hero-mosque.png')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              Markaz Al-Hijrah <br />
              <span className="text-[#EFC940]">Nusantara</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-md">
              Pusat Halaqoh Ilmiah Islam Terbesar di Nusantara
            </p>
          </div>

          <div className="mt-12 grid grid-cols-4 gap-8 max-w-2xl">
            {herodesc?.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="text-3xl font-bold text-[#EFC940]">
                  {item.value}
                </div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-sm text-gray-400 italic max-w-lg">
            &quot;Dari Kaum Muslimin, Untuk Kaum Muslimin, dan Milik Kaum
            Muslimin&quot;
          </div>
        </div>
      </div>
    </div>
  );
}
