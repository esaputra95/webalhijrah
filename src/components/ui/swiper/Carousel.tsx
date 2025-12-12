"use client";

import { useRef } from "react";
import { Swiper } from "swiper/react";
import type { SwiperProps } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;
  swiperProps?: SwiperProps;
}

export default function Carousel({ swiperProps, children }: CarouselProps) {
  const swiperRef = useRef<SwiperCore | null>(null);

  // Ambil yang boleh di-override dari luar
  const { breakpoints, spaceBetween, slidesPerView, ...rest } =
    swiperProps || {};

  const defaultBreakpoints: SwiperProps["breakpoints"] = {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 2 },
    1280: { slidesPerView: 2 },
  };

  return (
    <div className="w-full h-full">
      <Swiper
        // simpan instance supaya bisa dipaksa autoplay.start()
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          // 🔥 PAKSA AUTOPLAY MULAI DARI AWAL
          if (swiper.autoplay) {
            try {
              swiper.autoplay.start();
            } catch {
              // ignore error kecil kalau belum siap
            }
          }
        }}
        modules={[Navigation, Pagination, Autoplay, A11y]}
        className="w-full h-full"
        spaceBetween={spaceBetween ?? 16}
        slidesPerView={slidesPerView ?? 1}
        breakpoints={breakpoints ?? defaultBreakpoints}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        a11y={{ enabled: true }}
        loop
        {...rest}
      >
        {children}
      </Swiper>
    </div>
  );
}
