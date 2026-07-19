import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["gsap"],
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;