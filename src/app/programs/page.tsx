"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { getData } from "@/lib/fatching";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { motion } from "framer-motion";
import { ProgramType } from "@/types/programSchema";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ProgramsPage() {
  const { data, isLoading } = useQuery<BaseApiResponse<ProgramType[]>>({
    queryKey: ["PublicPrograms"],
    queryFn: async () =>
      getData<{ _: "" }, BaseApiResponse<ProgramType[]>>(apiUrl.programs, {
        _: "",
      }),
  });

  const programs = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <head>
        <title>Markaz Alhijrah - Program</title>
        <meta
          name="description"
          content="Lihat berbagai program unggulan dan kegiatan dari Markaz Al-Hijrah"
        />
      </head>
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-brand-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-islamic.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-brand-gold/20 border border-brand-gold/30 backdrop-blur-sm rounded-full">
              <span className="text-sm font-bold text-brand-gold tracking-wide uppercase">
                🚀 Program Kami
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Program <span className="text-brand-gold">Kegiatan</span>
            </h1>
            <p className="text-lg text-gray-200">
              Berbagai program kegiatan dakwah, sosial, dan pendidikan untuk
              ummat
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Belum Ada Program
              </h3>
              <p className="text-gray-600">
                Program akan segera hadir. Nantikan update dari kami!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/programs/${program.slug}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                  >
                    {/* Program Image */}
                    <div className="relative h-60 bg-gray-200 overflow-hidden">
                      {program.image ? (
                        <Image
                          src={program.image}
                          alt={program.title || "Program Image"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue to-gray-700 text-white text-4xl">
                          🚀
                        </div>
                      )}

                      {/* Date Badge over Image */}
                      {program.date && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-blue shadow-lg">
                          {new Date(program.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      )}
                    </div>

                    {/* Program Content */}
                    <div className="p-6 space-y-3 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-brand-gold transition-colors line-clamp-2">
                        {program.title}
                      </h3>

                      {/* Description */}
                      {program.description && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {program.description}
                        </p>
                      )}

                      {/* Spacer to push button down */}
                      <div className="flex-1"></div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                        <span className="text-brand-blue font-semibold text-sm group-hover:text-brand-gold transition-colors">
                          Lihat Detail →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Mulai <span className="text-brand-gold">Investasi Akhirat</span>{" "}
              Anda Hari Ini
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Tidak perlu menunggu kaya untuk bersedekah. Mulailah dari yang
              sedikit namun istiqomah.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/donasi"
                className="inline-block px-10 py-4 bg-brand-gold text-brand-blue font-bold text-lg rounded-full hover:bg-[#d4b035] transition-all shadow-xl"
              >
                Donasi Sekarang
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Markaz Al-Hijrah. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
