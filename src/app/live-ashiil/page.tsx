"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { motion } from "framer-motion";
import Link from "next/link";

const LiveAshiilPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  const [streamUrl, setStreamUrl] = useState(
    "https://ams.juraganstreaming.com:5443/LiveApp/streams/ashiiltv2.m3u8"
  );
  const [lastError, setLastError] = useState<string>("");

  useEffect(() => {
    let hls: Hls | null = null;

    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          manifestLoadingTimeOut: 20000,
          manifestLoadingMaxRetry: 10,
          manifestLoadingRetryDelay: 1000,
          levelLoadingTimeOut: 20000,
          levelLoadingMaxRetry: 10,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 10,
          xhrSetup: function (xhr: XMLHttpRequest, url: string) {
            xhr.withCredentials = false; // Disable credentials for CORS
          },
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsBuffering(false);
          video
            .play()
            .then(() => {
              setIsLive(true);
              setIsPlaying(true);
            })
            .catch(() => {
              setIsLive(true);
              setIsPlaying(false);
            });
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error("HLS Error:", data);
          setLastError(`${data.type}: ${data.details}`);

          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError(
                  "⚠️ Server streaming tidak dapat dihubungi. Silakan coba lagi nanti."
                );
                setTimeout(() => hls?.startLoad(), 3000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError(
                  "⚠️ Data stream tidak valid. Server mungkin sedang offline."
                );
                hls?.recoverMediaError();
                break;
              default:
                setError(
                  "⚠️ Stream tidak dapat diputar. Silakan periksa koneksi server."
                );
                hls?.destroy();
                break;
            }
          } else if (data.details === "fragParsingError") {
            setError(
              "⚠️ Server mengirim data yang rusak. Stream mungkin sedang tidak aktif."
            );
          }
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsBuffering(false);
          video
            .play()
            .then(() => {
              setIsLive(true);
              setIsPlaying(true);
            })
            .catch(() => {
              setIsLive(true);
              setIsPlaying(false);
            });
        });
      } else {
        setError("Browser Anda tidak mendukung pemutaran HLS.");
      }

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleWaiting = () => setIsBuffering(true);
      const handlePlaying = () => setIsBuffering(false);

      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("waiting", handleWaiting);
      video.addEventListener("playing", handlePlaying);

      return () => {
        if (hls) hls.destroy();
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("waiting", handleWaiting);
        video.removeEventListener("playing", handlePlaying);
      };
    }
  }, [streamUrl]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <PublicNavbar withScrolled={false} />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="mb-8 text-center md:text-left">
              {isLive && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4 animate-pulse">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  LIVE STREAMING
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-bold text-brand-brown mb-2">
                Live <span className="text-brand-gold">Ashiil TV</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Saksikan siaran langsung kajian dan program dakwah terbaik dari
                Ashiil TV. Reload halaman jika stream tidak muncul.
              </p>
            </div>

            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-6 text-center z-10">
                  <div>
                    <p className="text-xl font-bold mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 bg-brand-gold text-brand-brown font-bold rounded-full hover:bg-[#D3A428] transition-colors"
                    >
                      Coba Lagi
                    </button>
                  </div>
                </div>
              )}

              {!isPlaying && !error && !isBuffering && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 cursor-pointer group"
                  onClick={() => videoRef.current?.play()}
                >
                  <div className="w-20 h-20 bg-brand-gold text-brand-brown rounded-full flex items-center justify-center pl-2 shadow-2xl transform group-hover:scale-110 transition-transform">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {isBuffering && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white font-medium drop-shadow-md">
                      Memuat siaran...
                    </p>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                className="w-full h-full"
                controls
                playsInline
                autoPlay
                muted
              />
            </div>

            {lastError && (
              <div className="mt-3 text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded border border-gray-200">
                Debug: {lastError}
              </div>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-brand-brown mb-4">
                    Informasi Siaran
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Ashiil TV adalah media dakwah yang menyajikan konten Islami
                    yang mendidik dan menginspirasi. Melalui siaran langsung
                    ini, kami berharap dapat menjangkau lebih banyak jamaah di
                    mana pun berada.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-brand-brown p-8 rounded-3xl text-white shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('/images/pattern-islamic.png')] opacity-5"></div>
                  <h3 className="text-xl font-bold mb-4 relative z-10">
                    Dukung Dakwah Kami
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 relative z-10">
                    Bantu kami terus menyebarkan kebaikan melalui media dan
                    program dakwah.
                  </p>
                  <Link
                    href="/donasi/pembangunan-studio-ashill-tv"
                    className="inline-block w-full py-4 bg-brand-gold text-brand-brown font-bold text-center rounded-2xl hover:bg-[#D3A428] transition-all relative z-10 transform group-hover:scale-[1.02]"
                  >
                    Infaq Sekarang
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer (Simplified from Landing) */}
      <footer className="bg-brand-brown text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white mb-6"
          >
            <div className="w-8 h-8 bg-brand-gold text-brand-brown rounded-full flex items-center justify-center font-bold">
              M
            </div>
            <span className="font-bold text-2xl">Markaz Al-Hijrah</span>
          </Link>
          <p className="text-sm max-w-md mx-auto mb-8">
            Pusat Halaqoh Ilmiah Islam Terbesar di Nusantara. Berkhidmah untuk
            umat melalui dakwah, pendidikan, dan sosial.
          </p>
          <div className="border-t border-gray-800 pt-8 text-xs">
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

export default LiveAshiilPage;
