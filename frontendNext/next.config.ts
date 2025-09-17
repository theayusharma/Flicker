import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["example.com", "images.unsplash.com"],
  },
};

export default nextConfig;
