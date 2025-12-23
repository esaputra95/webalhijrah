"use client";

import Image from "next/image";
import Link from "next/link";
import PublicDonationForm from "@/features/donations/PublicDonationForm";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { motion, Variants, useInView } from "framer-motion";
import { useRef } from "react";
import { useHeroSliders } from "@/hooks/masters/useSliders";
import { usePublicPosts } from "@/hooks/masters/usePosts";
import Hero from "@/components/home/Hero";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleUp: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

function getYouTubeId(url: string | undefined | null) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const LandingPage = () => {
  // Fetch hero sliders from API
  const { data: aboutData } = useHeroSliders("about_us");
  const { data: donationPosts } = usePublicPosts({
    post_type: "donation",
    post_status: "publish",
  });

  const aboutItem = aboutData?.data?.[0];
  const youtubeId = getYouTubeId(aboutItem?.image);

  // Ref for about video autoplay
  const aboutVideoRef = useRef(null);
  const isAboutVideoInView = useInView(aboutVideoRef, {
    amount: 0.5,
    once: true,
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <Hero />

      {/* Stats Section (Quick Numbers) */}
      <div className="bg-brand-brown py-12 relative z-20 -mt-2">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white"
          >
            {[
              { label: "Jamaah", value: "5000+" },
              { label: "Santri", value: "120+" },
              { label: "Kegiatan/Bulan", value: "45+" },
              { label: "Program", value: "10+" },
            ].map((stat, i) => (
              <motion.div key={i} variants={scaleUp} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-brand-gold">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm md:text-base font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* About Section */}
      <section
        id="about"
        className="py-20 md:py-28 bg-white relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-50 rounded-full opacity-50 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-brand-gold rounded-tl-3xl z-10" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-brand-gold rounded-br-3xl z-10" />
              <div
                ref={aboutVideoRef}
                className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-0 transition-transform hover:rotate-1 duration-500"
              >
                {youtubeId ? (
                  <div className="w-full h-full aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${
                        isAboutVideoInView ? 1 : 0
                      }&mute=1&loop=1&playlist=${youtubeId}`}
                      title="About Markaz Sunnah Nusantara Al Hijrah"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <>
                    <Image
                      src={
                        aboutItem?.image ||
                        "/images/kegiatan-masjid-markaz-alhijrah-1.webp"
                      }
                      alt={
                        aboutItem?.description ||
                        "About Markaz Sunnah Nusantara Al Hijrah"
                      }
                      width={800}
                      height={800}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white text-left">
                      <p className="font-bold text-xl">
                        Markaz Sunnah Nusantara Al Hijrah
                      </p>
                      <p className="text-sm opacity-90">
                        Pusat Peradaban & Ilmu
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-6 text-center lg:text-left"
            >
              <div className="inline-block px-3 py-1 bg-yellow-100 text-brand-brown rounded-full text-sm font-semibold mb-2">
                Tentang Kami
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-brown leading-tight">
                Membangun Peradaban Melalui{" "}
                <span className="text-brand-gold">Masjid & Ilmu</span>
              </h2>
              <div className="w-20 h-1.5 bg-brand-gold rounded-full mx-auto lg:mx-0" />
              <p className="text-lg text-gray-600 leading-relaxed">
                Markaz Sunnah Nusantara Al Hijrah adalah Pusat Halaqoh Ilmiah
                Islam Terbesar di Nusantara. Kami berdedikasi untuk menjadi
                wadah bagi kaum muslimin dalam menuntut ilmu, beribadah, dan
                mempererat ukhuwah islamiyah.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">
                  &quot;Dari Kaum Muslimin, Untuk Kaum Muslimin, dan Milik Kaum
                  Musikin&quot;
                </span>
                . Slogan ini menjadi ruh perjuangan kami untuk terus memberikan
                manfaat seluas-luasnya bagi umat.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
                {[
                  "Kajian Rutin Harian",
                  "Pendidikan Tahfidz",
                  "Program Sosial Kemasyarakatan",
                  "Fasilitas Ibadah Nyaman",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-yellow-100 text-brand-brown flex items-center justify-center text-xs">
                      ✓
                    </span>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Link
                  href="/about"
                  className="text-brand-brown font-semibold hover:text-brand-gold flex items-center justify-center lg:justify-start gap-2 group"
                >
                  Baca Selengkapnya
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              Program Donasi
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-brown">
              Salurkan <span className="text-brand-gold">Kebaikan Anda</span>
            </h2>
            <p className="text-lg text-gray-600">
              Pilih program kebaikan yang ingin Anda dukung. Bersama kita
              wujudkan manfaat yang lebih luas.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {donationPosts?.data?.slice(0, 4)?.map((program, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group flex flex-col items-start"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {/* Default Icon or Dynamic if available */}
                  <Image
                    src={program.post_image}
                    alt={program.post_title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <h3 className="text-xl font-bold text-brand-brown mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                  {program.post_title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 text-sm flex-grow">
                  {program.post_excerpt || "Mari berdonasi untuk program ini."}
                </p>
                <Link
                  href={`/donasi/${program.post_name}`}
                  className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-brand-gold uppercase tracking-wider transition-colors mt-auto"
                >
                  Donasi Sekarang <span className="ml-2">→</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Direct Donation Section */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-5/12 space-y-8 lg:sticky top-28"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-brand-brown leading-tight">
                Mulai <span className="text-brand-gold">Investasi Akhirat</span>{" "}
                Anda Hari Ini
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Tidak perlu menunggu kaya untuk bersedekah. Mulailah dari yang
                sedikit namun istiqomah. Allah Maha Melihat setiap butir
                kebaikan yang kita tanam.
              </p>

              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <h4 className="font-bold text-brand-brown mb-2 flex items-center gap-2">
                  <span className="text-xl">💡</span> Tahukah Anda?
                </h4>
                <p className="text-brand-brown text-sm italic">
                  &quot;Barangsiapa membangun masjid karena mengharap ridha
                  Allah, maka Allah akan membangunkan untuknya (rumah) seperti
                  itu di surga.&quot; (HR. Bukhari)
                </p>
              </div>

              {/* <div className="space-y-4 pt-4">
                <p className="font-semibold text-gray-900">Transfer Manual:</p>
                <div className="flex gap-4">
                  <div className="bg-white border rounded-lg p-3 flex-1 text-center shadow-sm">
                    <div className="text-xs text-gray-500 uppercase">
                      Bank Syariah Indonesia
                    </div>
                    <div className="font-mono font-bold text-lg text-gray-800">
                      300 0500 045
                    </div>
                    <div className="text-xs text-gray-500">
                      a.n Markaz Al Hijrah
                    </div>
                  </div>
                </div>
              </div> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-7/12 w-full"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-[1.01] transition-transform duration-500">
                <div className="bg-gradient-to-r from-brand-brown to-gray-600 p-6 text-white text-center">
                  <h3 className="text-2xl font-bold">Form Donasi Online</h3>
                  <p className="text-gray-300 opacity-90">
                    Aman, Cepat & Terpercaya via Midtrans
                  </p>
                </div>
                <div className="p-6 md:p-8">
                  <PublicDonationForm account={1} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-brown to-gray-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-islamic.png')] opacity-5"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto">
            &quot;Harta tidak akan berkurang karena sedekah. Dan tidaklah Allah
            menambah bagi hamba yang pemaaf kecuali kemuliaan.&quot;
          </h2>
          <p className="text-xl text-brand-gold mb-10 italic font-medium">
            (HR. Muslim)
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/donasi"
              className="inline-block px-10 py-5 bg-brand-gold text-brand-brown font-bold text-xl rounded-full hover:bg-[#D3A428] transition-all shadow-2xl hover:shadow-white/20 transform hover:-translate-y-1"
            >
              Ayo Berdonasi
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-brown text-gray-400 py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-brand-gold text-brand-brown rounded-full flex items-center justify-center font-bold">
                  M
                </div>
                <span className="font-bold text-2xl">Markaz Al-Hijrah</span>
              </Link>
              <p className="text-gray-200 leading-relaxed max-w-sm">
                Pusat Halaqoh Ilmiah Islam Terbesar di Nusantara. Berkhidmah
                untuk umat melalui dakwah, pendidikan, dan sosial.
              </p>
              <div className="flex gap-4 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#EFC940",
                      color: "#4A4C70",
                    }}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="text-sm">Sos</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg">Tautan Cepat</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-gold text-gray-200 transition-colors"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="hover:text-brand-gold text-gray-200 transition-colors"
                  >
                    Tentang
                  </Link>
                </li>
                <li>
                  <Link
                    href="/programs"
                    className="hover:text-brand-gold text-gray-200 transition-colors"
                  >
                    Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles"
                    className="hover:text-brand-gold text-gray-200 transition-colors"
                  >
                    Artikel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donasi"
                    className="hover:text-brand-gold text-gray-200 transition-colors"
                  >
                    Donasi
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg">Kontak Kami</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold mt-1">📍</span>
                  <span className="text-gray-300">
                    Jl. Kayu Putih, RT 01 RW 06 Kel. Binawidya Kec. Binawidya
                    Kota Pekanbaru, Riau
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-brand-gold">📞</span>
                  <span className="text-gray-300">+62 851 7436 8006</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-brand-gold">📞</span>
                  <span className="text-gray-300">+62 8117 550 202</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-brand-gold">✉️</span>
                  <span className="text-gray-300">info@markaz-alhijrah.id</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Markaz Al-Hijrah Nusantara. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
