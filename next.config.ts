/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  // TypeScript hatalarını susturucu
  typescript: {
    ignoreBuildErrors: true,
  },
  // 🚀 İŞTE HAYAT KURTARAN SATIR: Turbopack çakışmasını susturur
  turbopack: {},
};

module.exports = withPWA(nextConfig);