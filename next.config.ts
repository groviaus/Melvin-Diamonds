import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "v0.dev" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "opkhandelwal.com" }, // Added to allow images from opkhandelwal.com
    ],
  },
};

export default nextConfig;
