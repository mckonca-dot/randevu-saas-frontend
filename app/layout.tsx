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
  title: "Planın | Türkiye'nin Premium Kuaför ve Berber Randevu Sistemi",
  description: "Sıra bekleme derdine son! Şehrindeki en iyi kuaförleri ve berberleri keşfet, hizmetleri incele ve saniyeler içinde online randevu al.",
  keywords: "berber randevu, kuaför randevu, online randevu, saç kesimi, sakal tıraşı, kuaför bul, güzellik salonu randevu",
  authors: [{ name: "Muhammet Konca" }],
  openGraph: {
    title: "Planın | Online Kuaför Randevu Sistemi",
    description: "Tarzına en uygun kuaförü bul ve anında randevu al.",
    type: "website",
    locale: "tr_TR",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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