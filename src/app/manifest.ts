import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Masjid Markaz Al Hijrah Nusantara",
    short_name: "Markaz Alhijrah",
    description: "Sistem Informasi Panel Masjid Markaz Al Hijrah Nusantara",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/12x12.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
