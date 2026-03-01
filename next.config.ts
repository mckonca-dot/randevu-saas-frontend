import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Buraya diğer ayarlarınız gelebilir
};

// 👇 "as any" ekleyerek TypeScript hatasını susturuyoruz
export default withPWA(nextConfig as any);