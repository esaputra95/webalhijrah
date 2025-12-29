"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import * as z from "zod";
import { useCreateDonation } from "@/hooks/masters/useDonations";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiCreditCard, FiCopy } from "react-icons/fi";
import { FaMoneyBillWave, FaQrcode } from "react-icons/fa";
import Image from "next/image";
import { track } from "@/lib/pixel";
import { bankAccount } from "@/const/bankAccount";

// Schema validasi
const PublicDonationFormSchema = z.object({
  amount: z
    .number({
      error: "Nominal donasi harus berupa angka",
    })
    .min(10000, "Minimal donasi adalah Rp 10.000"),
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone_number: z.string().optional(),
  note: z.string().optional(),
});

type PublicDonationFormValues = z.infer<typeof PublicDonationFormSchema>;

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 5000000];

// Animation Variants
const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function PublicDonationForm({
  account,
  type,
}: // _code,
{
  account?: number;
  type?: boolean;
  // _code?: string;
}) {
  const [activeTab, setActiveTab] = useState<"automatic" | "manual" | "qris">(
    "manual"
  );
  const { mutate: createDonation, isPending } = useCreateDonation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<PublicDonationFormValues>({
    resolver: zodResolver(PublicDonationFormSchema),
    defaultValues: {
      amount: 0,
      name: "Hamba Allah",
      phone_number: "",
      note: "",
    },
  });

  const selectedAmount = watch("amount");

  const onSubmit = (data: PublicDonationFormValues) => {
    // Track Purchase event
    track("Purchase", {
      currency: "IDR",
      value: data.amount,
      content_name: "Donation",
    });

    createDonation(data, {
      onSuccess: (response) => {
        if (response?.data?.redirect_url) {
          window.location.href = response.data.redirect_url;
        }
        reset();
      },
      onError: (error) => {
        console.error("Donation submission error:", error);
      },
    });
  };

  const handleAmountSelect = (amount: number) => {
    setValue("amount", amount, { shouldValidate: true });
  };

  const bank = useMemo(() => {
    return bankAccount.find((bank) => bank.id === account);
  }, [account]);

  return (
    <div className="w-full bg-white">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row border-b border-gray-200">
        <button
          onClick={() => setActiveTab("manual")}
          className={`flex-1 py-4 px-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 relative ${
            activeTab === "manual"
              ? "text-brand-brown"
              : "text-gray-500 hover:text-brand-brown hover:bg-gray-50"
          }`}
        >
          <FaMoneyBillWave className="text-lg" />
          <span>Transfer Bank</span>
          {activeTab === "manual" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold rounded-t-full"
            />
          )}
        </button>
        {bank?.type === "alhijrah" && (
          <button
            onClick={() => setActiveTab("automatic")}
            className={`flex-1 py-4 px-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 relative ${
              activeTab === "automatic"
                ? "text-brand-brown"
                : "text-gray-500 hover:text-brand-brown hover:bg-gray-50"
            }`}
          >
            <FiCreditCard className="text-lg" />
            <span>Sistem Otomatis</span>
            {activeTab === "automatic" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold rounded-t-full"
              />
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab("qris")}
          className={`flex-1 py-4 px-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 relative ${
            activeTab === "qris"
              ? "text-brand-brown"
              : "text-gray-500 hover:text-brand-brown hover:bg-gray-50"
          }`}
        >
          <FaQrcode className="text-lg" />
          <span>Scan QRIS</span>
          {activeTab === "qris" && bank?.qris && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold rounded-t-full"
            />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* TAB 1: AUTOMATIC SYSTEM */}
          {activeTab === "automatic" && (
            <motion.div
              key="automatic"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Preset Amounts */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pilih Nominal Donasi
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          selectedAmount === amt
                            ? "border-brand-gold bg-brand-gold text-brand-brown shadow-md transform scale-[1.02]"
                            : "border-gray-200 text-gray-600 hover:border-brand-gold hover:text-brand-brown bg-white"
                        }`}
                      >
                        Rp {amt.toLocaleString("id-ID")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nominal Lainnya
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      Rp
                    </span>
                    <input
                      type="text"
                      {...register("amount", { valueAsNumber: true })}
                      placeholder="Masukan nominal donasi (min. 10.000)"
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all font-semibold text-gray-800 placeholder:font-normal ${
                        errors.amount
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Donor Info */}
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Nama Lengkap
                    </label>
                    <input
                      {...register("name")}
                      placeholder="Nama Anda"
                      onFocus={() => {
                        setValue("name", "");
                      }}
                      className={`w-full text-gray-600 px-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all ${
                        errors.name ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Nomor WhatsApp (Opsional)
                    </label>
                    <input
                      {...register("phone_number")}
                      placeholder="08xxxxxxxxxx"
                      type="tel"
                      className={`w-full text-gray-600 px-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all ${
                        errors.phone_number
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-sm">
                        {errors.phone_number.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pesan / Doa (Opsional)
                  </label>
                  <textarea
                    {...register("note")}
                    rows={3}
                    placeholder="Tuliskan doa atau pesan untuk kami..."
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isPending}
                  type="submit"
                  className="w-full py-4 bg-brand-gold text-brand-brown text-lg font-bold rounded-xl shadow-lg hover:bg-[#e6c035] hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    "Lanjut Pembayaran →"
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* TAB 2: MANUAL TRANSFER */}
          {activeTab === "manual" && (
            <motion.div
              key="manual"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-xl font-bold text-gray-800">
                  Transfer Manual
                </h3>
                <p className="text-gray-500 text-sm">
                  Silakan transfer ke salah satu rekening di bawah ini a.n{" "}
                  <strong>Yayasan Markaz Al Hijrah</strong>
                </p>
              </div>

              <div className="grid gap-4">
                {/* Bank Item 1 */}
                {bank?.accounts?.map((account) => (
                  <div
                    key={account.code}
                    className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-100 font-bold text-xs text-brand-brown shadow-sm">
                        {account.code}
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {account.name}
                        </p>
                        <p className="text-lg font-bold text-gray-800 font-mono">
                          {account.labelNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          a.n {account.owner}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        track("Purchase", {
                          currency: "IDR",
                          content_name: "Donation",
                        });

                        navigator.clipboard.writeText(account.number);
                        toast.success("No. Rekening Disalin!");
                      }}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-brand-brown hover:border-brand-blue hover:bg-brand-brown/5 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <FiCopy /> Salin
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mt-6 flex gap-3 items-start">
                <span className="text-xl">�</span>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Penting:</p>
                  <p>
                    Setelah melakukan transfer manual, mohon konfirmasi bukti
                    transfer ke WhatsApp Admin agar donasi Anda dapat kami
                    catat.
                  </p>
                  <a
                    href="https://wa.me/6285174368006"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-brand-brown font-bold hover:underline"
                  >
                    Konfirmasi via WhatsApp &rarr;
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: QRIS */}
          {activeTab === "qris" && bank?.qris && (
            <motion.div
              key="qris"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="mb-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 relative">
                {/* QRIS Placeholder Image */}
                <div className="w-72 h-96 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 relative overflow-hidden">
                  <Image
                    src={`${bank?.urlQris}`}
                    alt="QRIS"
                    width={285}
                    height={320}
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-bold text-gray-800">Markaz Al-Hijrah</p>
                  <p className="text-xs text-gray-500">NMID: ID1234567890</p>
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <p className="text-gray-600">
                  Scan QRIS di atas menggunakan aplikasi E-Wallet (GoPay, OVO,
                  Dana, LinkAja) atau Mobile Banking apa saja.
                </p>
                <a
                  href={`${bank?.urlQris}`}
                  target="_blank"
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Download QRIS Image ⬇️
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
