import { MetadataRoute } from 'next';

// 🚀 VERCEL İÇİN KESİN ÇÖZÜM: 
// Next.js'e bu sayfanın statik değil, dinamik (sürekli güncellenen) bir sayfa olduğunu söylüyoruz.
// Böylece build alırken dondurmaya çalışmayacak ve hata vermeyecek!
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://planin.com.tr'; // Kendi alan adını yaz

  // Ana sayfa ve sabit sayfalar
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Backend'den tüm aktif dükkanları çekip haritaya ekliyoruz!
  try {
    const res = await fetch(`https://konca-saas-backend.onrender.com/public/shops`, { cache: 'no-store' });
    if (res.ok) {
      const shops = await res.json();
      const shopRoutes = shops.map((shop: any) => ({
        url: `${baseUrl}/book/${shop.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
      return [...routes, ...shopRoutes];
    }
  } catch (error) {
    console.error("Sitemap oluşturulurken hata:", error);
  }

  return routes;
}