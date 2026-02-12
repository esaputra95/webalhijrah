import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "markazalhijrah.or.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.markazalhijrah.or.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // output: "standalone",
};

export default nextConfig;
