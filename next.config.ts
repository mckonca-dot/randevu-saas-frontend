import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚀 1. GÖRSEL SEO VE OPTİMİZASYON (En Önemlisi)
  images: {
    // Fotoğrafları eski hantal JPEG yerine yeni nesil (çok küçük boyutlu) formatlara çevirir
    formats: ['image/avif', 'image/webp'], 
    
    // Fotoğrafların (logo, kapak resmi vb.) gelebileceği domainlere (adreslere) izin veriyoruz.
    // DİKKAT: Kendi backend'inin veya fotoğraf deponun (Supabase vb.) adresini buraya EKLAMELİSİN!
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Örnek resimler için
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google giriş profil fotoğrafları için
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Eğer Cloudinary kullanıyorsan
      },
      // 🔥 PATRON, BURASI ÇOK KRİTİK: Eğer fotoğrafları kendi sunucunda veya Supabase'de tutuyorsan, 
      // o sunucunun domain adresini buraya eklemelisin. Yoksa fotoğraflar X işaretiyle kırık çıkar.
      // Örnek Supabase:
      // {
      //   protocol: 'https',
      //   hostname: 'senin-proje-id.supabase.co', 
      // },
    ],
    // Resimlerin tarayıcıda ne kadar süre (saniye) hafızada kalacağını belirler (1 hafta)
    minimumCacheTTL: 604800, 
  },

  // 🚀 2. GÜVENLİK VE PERFORMANS (X-Powered-By gizleme)
  poweredByHeader: false, // "Bu site Next.js ile yapıldı" bilgisini gizler, hackerlara ipucu vermez.
  
  // 🚀 3. REACT STRICT MODE (Hata Yakalayıcı)
  reactStrictMode: true, // Geliştirme aşamasında potansiyel hataları iki kere çalıştırıp bulur.
};

export default nextConfig;