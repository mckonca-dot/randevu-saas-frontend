import { Metadata } from 'next';

// 1. GOOGLE BOTLARI İÇİN DİNAMİK BAŞLIK VE AÇIKLAMA ÜRETİCİ
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`https://konca-saas-backend.onrender.com/public/shop/${params.id}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Kuaför Bulunamadı | Berberim' };
    
    const shop = await res.json();

    return {
      title: `${shop.shopName} - Randevu Al | Berberim`,
      description: `${shop.city}, ${shop.district} bölgesindeki en iyi kuaförlerden ${shop.shopName} için sıra beklemeden online randevu alın. ${shop.tagline || ''}`,
      openGraph: {
        title: `${shop.shopName} - Online Randevu`,
        description: `${shop.city}, ${shop.district} bölgesinde profesyonel hizmet. Hemen randevunu oluştur!`,
        images: [shop.coverImage || shop.logo || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'],
      },
    };
  } catch (error) {
    return { title: 'Randevu Al | Berberim' };
  }
}

export default async function BookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  
  // 2. GOOGLE "ZENGİN SONUÇLAR" (RICH SNIPPETS) KODU
  // Bu kod sayesinde Google aramalarında dükkanın adı altında yıldızlar ve "Kuaför Salonu" ibaresi çıkar!
  let schemaData = null;
  try {
    const res = await fetch(`https://konca-saas-backend.onrender.com/public/shop/${params.id}`, { cache: 'no-store' });
    if (res.ok) {
      const shop = await res.json();
      schemaData = {
        "@context": "https://schema.org",
        "@type": "HairSalon",
        "name": shop.shopName,
        "image": shop.coverImage || shop.logo,
        "telephone": shop.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": shop.fullAddress || shop.addressTitle,
          "addressLocality": shop.district,
          "addressRegion": shop.city,
          "addressCountry": "TR"
        },
        "priceRange": "₺₺",
        "url": `https://seninsiteninadresi.com/book/${shop.id}`
      };
    }
  } catch (e) {}

  return (
    <>
      {/* Şemayı sayfaya gizlice enjekte ediyoruz (Sadece Google okur) */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      {/* Mevcut sayfanın bozulmadan render edilmesi */}
      {children}
    </>
  );
}