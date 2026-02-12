"use client";
import React from "react";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { useHalaqohCategories } from "@/hooks/masters/useHalaqohCategories";
import RegistrationButton from "@/features/halaqoh/registration/RegistrationButton";
import Spinner from "@/components/ui/loading/Spinner";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HalaqohPublicPage() {
  const { data: categoriesData, isLoading } = useHalaqohCategories();
  const categories = categoriesData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#4A4C70] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-islamic.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-[#EFC940]/20 border border-[#EFC940]/30 backdrop-blur-sm rounded-full">
              <span className="text-sm font-bold text-[#d4b035] tracking-wide uppercase">
                📖 Majelis Ilmu
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Program <span className="text-[#EFC940]">Halaqoh Al-Hijrah</span>
            </h1>
            <p className="text-lg text-slate-200">
              Bergabunglah dalam halaqoh rutin kami untuk memperdalam pemahaman
              agama dan memperbaiki bacaan Al-Qur&apos;an.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A4C70]">
              Pilih Program yang Sesuai
            </h2>
            <div className="w-20 h-1.5 bg-[#EFC940] mx-auto mt-4 rounded-full"></div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner size="large" />
              <p className="mt-4 text-slate-500 font-medium">
                Memuat data program...
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🍃</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Halaqoh Belum Tersedia
              </h3>
              <p className="text-slate-500">
                Pendaftaran untuk program halaqoh baru akan segera dibuka.
                Nantikan informasinya!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col h-full bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden"
                >
                  {/* Category Image */}
                  <div className="relative h-56 overflow-hidden bg-slate-200">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A4C70] to-slate-400 text-white text-4xl group-hover:scale-110 transition-transform duration-700">
                        📚
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-[#4A4C70] mb-3 group-hover:text-[#d4b035] transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                      {category.description ||
                        "Pelajari ilmu syar'i dengan bimbingan ustadz berpengalaman dalam lingkungan yang nyaman dan teratur."}
                    </p>

                    <div className="mt-auto">
                      <RegistrationButton category={category} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-[#4A4C70]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-[#EFC940]/10 text-[#d4b035] rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
                👤
              </div>
              <h4 className="font-bold text-[#4A4C70] mb-2 text-lg">
                Mentor Berpengalaman
              </h4>
              <p className="text-sm text-slate-500">
                Dibimbing langsung oleh asatidzah yang ahli di bidangnya.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-[#4A4C70]/10 text-[#4A4C70] rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
                🗓️
              </div>
              <h4 className="font-bold text-[#4A4C70] mb-2 text-lg">
                Jadwal Teratur
              </h4>
              <p className="text-sm text-slate-500">
                Waktu belajar yang fleksibel namun tetap terarah dan terencana.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
                🤝
              </div>
              <h4 className="font-bold text-[#4A4C70] mb-2 text-lg">
                Ukhuwah Terjaga
              </h4>
              <p className="text-sm text-slate-500">
                Membangun persaudaraan sesama penuntut ilmu dalam majelis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A4C70] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-[#EFC940] rounded-full flex items-center justify-center font-bold text-[#4A4C70] mr-2">
              AH
            </div>
            <span className="text-xl font-bold">Markaz Al-Hijrah</span>
          </div>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Membangun generasi berafinitas sunnah, berilmu, dan bermartabat.
          </p>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Markaz Al-Hijrah. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
