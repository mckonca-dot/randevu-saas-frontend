import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🚀 İŞTE YENİ SEO VE VİTRİN AYARLARIMIZ
export const metadata: Metadata = {
  title: "Akıllı Randevu | Profesyonel Yönetim Sistemi",
  description: "Erkek kuaförleri ve salonlar için özel olarak tasarlanmış, kesintisiz ve akıllı online randevu ve müşteri yönetim sistemi.",
  keywords: ["kuaför randevu", "berber randevu sistemi", "online randevu", "saas", "müşteri yönetimi"],
  openGraph: {
    title: "Akıllı Randevu | Profesyonel Yönetim Sistemi",
    description: "Müşterileriniz 7/24 online randevu alsın, siz işinize odaklanın.",
    url: "https://randevu-saas-frontend-ghqr.vercel.app", // Senin canlı Vercel linkin
    siteName: "Akıllı Randevu",
    images: [
      {
        url: "/icon-512x512.png", // WhatsApp ve sosyal medya paylaşımlarında çıkacak logo
        width: 512,
        height: 512,
        alt: "Akıllı Randevu Sistemi Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akıllı Randevu | Profesyonel Yönetim Sistemi",
    description: "Müşterileriniz 7/24 online randevu alsın, siz işinize odaklanın.",
    images: ["/icon-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 👇 Arama motorları için dili Türkçe yaptık
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}