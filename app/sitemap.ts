import { MetadataRoute } from 'next';

// 🛠️ SEO Link Temizleyici (URL'leri Jilet Gibi Yapar)
const slugify = (text: string) => {
  return text.toString().toLowerCase().trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://planin.com.tr';

  try {
    // 1. Backend'den tüm dükkan verilerini taze taze çek
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/shops/all-slugs`, {
        next: { revalidate: 3600 } // Her saat başı haritayı tazele
    });

    if (!res.ok) throw new Error('Slugs fetch failed');
    const allShops = await res.json();

    // 2. Şehir Sayfaları (Benzersiz olanları ayıkla)
    const uniqueCities = Array.from(new Set(allShops.map((s: any) => s.city.toLowerCase())));
    const cityUrls = uniqueCities.map((city: any) => ({
      url: `${baseUrl}/${slugify(city)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6, // Şehirler genel kategoridir
    }));

    // 3. İlçe Sayfaları (Şehir + İlçe kombinasyonunu benzersiz yap)
    const uniqueDistricts = Array.from(new Set(allShops.map((s: any) => `${s.city}|${s.district}`)));
    const districtUrls = uniqueDistricts.map((pair: any) => {
      const [city, district] = pair.split('|');
      return {
        url: `${baseUrl}/${slugify(city)}/${slugify(district)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8, // İlçeler yerel aramada çok önemlidir
      };
    });

    // 4. Dükkan Detay Sayfaları (Asıl Para Getiren Sayfalar)
    const shopUrls = allShops.map((shop: any) => ({
      url: `${baseUrl}/${slugify(shop.city)}/${slugify(shop.district)}/${shop.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0, // Google her gün buralara baksın
    }));

    // 5. Final Haritasını Birleştir
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 }, // Crawl budget tasarrufu
      { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
      ...cityUrls,
      ...districtUrls,
      ...shopUrls,
    ];

  } catch (error) {
    // 🛡️ Fail-Safe: Backend çökerse sadece ana sayfaları gönder
    console.error("Sitemap Hatası:", error);
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${baseUrl}/login`, lastModified: new Date(), priority: 0.3 },
    ];
  }
}