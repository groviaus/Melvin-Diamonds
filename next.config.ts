import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Be more specific in production
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "v0.dev" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "mavendiamonds.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "62.72.12.146" },
    ],
  },
};

export default nextConfig;
