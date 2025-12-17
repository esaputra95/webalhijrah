"use client";
import PublicDonationForm from "@/features/donations/PublicDonationForm";
import Carousel from "@/components/ui/swiper/Carousel";
import { SwiperSlide } from "swiper/react";
import { useHeroSliders } from "@/hooks/masters/useSliders";
import { fallbackImages } from "@/utils/defaultImage";

export default function DonasiPage() {
  const { data: slidersData } = useHeroSliders("hero-slider");
  const { data: donationData } = useHeroSliders("donation");

  // Use API data if available, otherwise use fallback images
  const heroImages =
    slidersData?.data && slidersData.data.length > 0
      ? slidersData.data.map((slider) => slider.image || "").filter(Boolean)
      : fallbackImages;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <head>
        <title>Donasi Masjid Alhijrah Nusantara</title>
        <meta name="description" content="Donasi untuk masjid Alhijrah" />
      </head>
      {/* Hero Section with Carousel */}
      <div className="relative overflow-hidden bg-brand-brown text-white min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Carousel
            swiperProps={{
              slidesPerView: 1,
              breakpoints: { 640: { slidesPerView: 1 } },
              autoplay: { delay: 5000, disableOnInteraction: false },
              effect: "fade",
            }}
          >
            {heroImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="w-full h-[600px] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
              </SwiperSlide>
            ))}
          </Carousel>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 pointer-events-none">
          <div className="max-w-4xl mx-auto text-center pointer-events-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-brand-gold/20 border border-brand-gold/30 backdrop-blur-sm rounded-full">
              <span className="text-sm font-bold text-brand-gold tracking-wide uppercase">
                🕌 Markaz Al-Hijrah Nusantara
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              Berdonasi untuk <br className="hidden md:block" />
              <span className="text-brand-gold">Pusat Peradaban Islam</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Insyaa Allah akan menjadi pusat pembelajaran islam berbasis sunnah
              terbesar di Indonesia. Mari bersama wujudkan pembangunan ini.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base font-medium">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20">
                <span className="text-green-400 text-lg">✅</span>
                <span>Aman & Terpercaya</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20">
                <span className="text-yellow-400 text-lg">⚡</span>
                <span>Proses Cepat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full text-gray-50"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-10 relative z-20">
        {/* Info Update Pembangunan */}
        <div className="max-w-6xl mx-auto mb-20 mt-10">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-white z-0"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="inline-block px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold mb-4 border border-yellow-200 shadow-sm">
                  Update Pembangunan
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Prioritas: Tahap 5 <br />
                  <span className="text-brand-gold">Struktur Rooftop</span>
                </h2>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
                  <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-brand-gold pl-4">
                    &quot;Kini pembangunan struktur rooftop Masjid Al Hijrah
                    sedang menjadi prioritas pembangunan. Mari bersama wujudkan
                    selesainya proses ini lebih cepat dengan donasi terbaik
                    Anda.&quot;
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1 font-medium">
                      Kebutuhan
                    </p>
                    <p className="text-2xl font-bold text-gray-900">Rp 8.7 M</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border border-green-200">
                    <p className="text-green-600 text-sm mb-1 font-medium">
                      Terkumpul
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      Rp 739 Jt+
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 w-full">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-500 group">
                  <Carousel
                    swiperProps={{
                      slidesPerView: 1,
                      breakpoints: {
                        640: { slidesPerView: 1 },
                        1024: { slidesPerView: 1 },
                      },
                      autoplay: { delay: 3000, disableOnInteraction: false },
                      // pagination: { clickable: true },
                      effect: "slide",
                    }}
                  >
                    {donationData?.data?.map((slider) => (
                      <SwiperSlide key={slider.id}>
                        <div
                          className="w-full h-full absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: `url(${slider.image})`,
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                          <div className="inline-flex items-center gap-2 text-white/90 mb-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-sm font-bold uppercase tracking-wider">
                              Live Progress
                            </span>
                          </div>
                          <p className="text-white text-xl font-bold">
                            Visualisasi Pembangunan Masjid
                          </p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Form moved below Update Info */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-w-5xl mx-auto transform -translate-y-4">
            <div className="bg-gradient-to-r from-brand-blue to-brand-gold p-1.5 h-3 w-full"></div>
            <div className="p-1">
              <PublicDonationForm />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto mb-20">
          {/* ... existing content ... */}
          {/* Keep benefits section as is, just placeheld here for context in diff if needed, 
              but since I'm replacing a huge chunk, I'll just keep the existing structure 
              and only replace up to before the duplicate Benefits section if it exists, 
              or re-include it if I'm replacing the whole block.
          */}
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-brown mb-4">
              Manfaat <span className="text-brand-gold">Donasi Anda</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Investasi akhirat yang pahalanya terus mengalir
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group">
              <div className="w-16 h-16 bg-yellow-100 text-brand-brown rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🕌</span>
              </div>
              <h3 className="text-xl font-bold text-brand-brown mb-3 group-hover:text-brand-gold transition-colors">
                Rumah di Surga
              </h3>
              <p className="text-gray-600 leading-relaxed">
                “Barangsiapa yang membangun masjid, maka Allah akan bangunkan
                baginya semisalnya di surga.” (HR. Muslim)
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-brand-brown mb-3 group-hover:text-brand-gold transition-colors">
                Pusat Ilmu Sunnah
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Menjadi bagian dari pusat pembelajaran Islam berbasis sunnah
                terbesar yang melahirkan generasi Rabbani.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-brand-brown mb-3 group-hover:text-brand-gold transition-colors">
                Amal Jariyah
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pahala yang tidak terputus meskipun telah meninggal dunia,
                mengalir dari setiap sujud dan ilmu yang diamalkan.
              </p>
            </div>
          </div>
        </div>

        {/* Location & Contact Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-brand-brown text-white p-10 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>📍</span> Lokasi Pembangunan
              </h3>
              <p className="leading-relaxed mb-8 opacity-90 text-lg">
                Jl. Kayu Putih, RT 01 RW 06 <br />
                Kel. Binawidya, Kec. Binawidya <br />
                Kota Pekanbaru, Riau
              </p>

              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>📞</span> Kontak Informasi
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-1 bg-brand-gold rounded-full"></div>
                  <div>
                    <p className="text-brand-gold font-bold text-sm">ADMIN</p>
                    <p className="text-lg">+62 8517 4368 006</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-1 bg-brand-gold rounded-full"></div>
                  <div>
                    <p className="text-brand-gold font-bold text-sm">ADMIN 2</p>
                    <p className="text-lg">+62 8117 550 202</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-100 min-h-[300px] relative">
              {/* Map Placeholder or Construction Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/2024-06-23.webp')" }}
              >
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-6">
                  <a
                    href="https://maps.google.com/?q=Markaz+Al-Hijrah+Nusantara"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/90 backdrop-blur text-brand-brown px-6 py-3 rounded-full font-bold shadow-lg hover:bg-white transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    <span>🗺️</span> Lihat di Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-brown mb-4">
              Pertanyaan <span className="text-brand-gold">Umum</span>
            </h2>
          </div>

          <div className="space-y-4">
            <details className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
              <summary className="px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center list-none">
                <span className="font-bold text-brand-brown text-lg">
                  Apakah donasi saya aman?
                </span>
                <span className="text-brand-gold bg-brand-brown/10 w-8 h-8 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>
              <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50">
                Ya, sangat aman. Kami menggunakan Midtrans Payment Gateway yang
                menggunakan standar keamanan tinggi.
              </div>
            </details>
            {/* Add more FAQs if needed */}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 text-white py-16 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Mari Bersama Membangun{" "}
            <span className="text-brand-gold">Peradaban</span>
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Setiap kontribusi Anda, sekecil apapun, sangat berarti dan akan
            menjadi pahala jariyah yang terus mengalir hingga akhirat.
          </p>
          <div className="text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Markaz Al-Hijrah. Semua hak
              dilindungi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
