import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // 🎯 SEO ve Hız: Üçüncü parti scriptler için eklendi
import "./globals.css";

// 🚀 FONT OPTİMİZASYONU: display: 'swap' eklendi.
// Bu sayede font yüklenirken sayfa beyaz kalmaz (FOIT engellenir), 
// Core Web Vitals (LCP ve CLS) puanları tavan yapar.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', 
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// 🚀 SEO VE VİTRİN AYARLARIMIZ (Senin kodların, mükemmel durumda)
export const metadata: Metadata = {
  metadataBase: new URL('https://planin.com.tr'),
  title: {
    default: 'Planın | Akıllı Randevu Sistemi',
    template: '%s | Planın' // Alt sayfalar için otomatik ek (Örn: Ahmet Kuaför | Planın)
  },
  description: 'Türkiye\'nin en hızlı ve kolay randevu yönetim platformu.',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://planin.com.tr',
    siteName: 'Planın',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Planın Randevu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planın | Randevu Sistemi',
    description: 'Sıra beklemeden randevunu al!',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 👇 Arama motorları için dil zaten Türkçe (Harika!)
    <html lang="tr">
      <head>
         {/* İleride PWA eklediğinde manifest buraya otomatik bağlanır ama meta theme-color vermek hız puanını ufak da olsa artırır */}
         <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {children}

        {/* 🚀 SCRIPT OPTİMİZASYONU (Örnek Google Analytics Kullanımı)
            strategy="afterInteractive" veya "lazyOnload" sayesinde 
            Analytics kodları sayfanın açılış hızını ASLA yavaşlatmaz! 
            (Kendi G- kodunu girdiğinde yorum satırlarını kaldırabilirsin)
        */}
        
        {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-SENIN-KODUN" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SENIN-KODUN', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        */}

      </body>
    </html>
  );
}