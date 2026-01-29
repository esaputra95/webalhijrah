"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useHeroSliders } from "@/hooks/masters/useSliders";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { useGroupedSettings } from "@/hooks/masters/useSettings";

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

const Hero = ({ linkDonasi }: { linkDonasi?: { donasi: string } }) => {
  // Fetch hero sliders from API
  const { data: slidersData } = useHeroSliders("hero-slider");
  const { data: newSettingsData } = useGroupedSettings();

  // Use API data if available, otherwise use fallback images
  const heroImages =
    slidersData?.data && slidersData.data.length > 0
      ? slidersData.data.map((slider) => slider.image || "").filter(Boolean)
      : [];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Swiper Background Slider */}
      <div className="absolute inset-0 z-0 select-none">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {heroImages.map((src, index) => (
            <SwiperSlide key={index} className="relative w-full h-full">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                quality={90}
                priority={index === 0}
              />
              {/* Stronger overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 relative z-10 text-center text-white space-y-6 pointer-events-none"
      >
        <motion.div
          variants={fadeInUp}
          className="inline-block mt-12"
        ></motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto [@media(orientation:landscape)_and_(max-width:1023px)]:pt-8"
          style={{
            textShadow:
              "0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)",
          }}
        >
          {newSettingsData?.Hero?.h1} <br />
          <span
            className="text-brand-gold"
            style={{
              textShadow:
                "0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            {newSettingsData?.Hero?.h2}
          </span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          style={{
            textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,1)",
          }}
        >
          {newSettingsData?.Hero?.description}
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8 pointer-events-auto [@media(orientation:landscape)_and_(max-width:1023px)]:pb-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={linkDonasi?.donasi || "/donasi"}
              className="px-8 py-4 bg-brand-gold hover:bg-[#D3A428] text-brand-brown font-bold text-lg rounded-full transition-all shadow-xl hover:shadow-yellow-500/30 flex items-center justify-center gap-2"
            >
              <span>💝</span> Donasi Sekarang
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold text-lg rounded-full transition-all flex items-center justify-center"
            >
              Pelajari Lebih Lanjut
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 z-20"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
