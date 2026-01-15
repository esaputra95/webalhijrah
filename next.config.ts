import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "markazalhijrah.or.id",
      },
    ],
  },
  // output: "standalone",
};

export default nextConfig;
