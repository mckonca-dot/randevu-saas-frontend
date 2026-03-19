import { Metadata } from 'next';

// 1. GOOGLE BOTLARI İÇİN DİNAMİK BAŞLIK VE AÇIKLAMA ÜRETİCİ
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`https://konca-saas-backend.onrender.com/public/shop/${params.id}`, { cache: 'no-store' });
    
    // 🛡️ BURAYI DA GÜNCELLEDİM (Berberim -> Planın)
    if (!res.ok) return { title: 'Kuaför Bulunamadı | Planın' };
    
    const shop = await res.json();

    return {
      title: `${shop.shopName} - Randevu Al | Planın`,
      description: `${shop.city}, ${shop.district} bölgesindeki en iyi kuaförlerden ${shop.shopName} için online randevu alın. ${shop.tagline || ''}`,
      openGraph: {
        title: `${shop.shopName} - Online Randevu`,
        description: `${shop.city}, ${shop.district} bölgesinde profesyonel hizmet. Hemen randevunu oluştur!`,
        images: [shop.coverImage || shop.logo || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'],
      },
    };
  } catch (error) {
    // 🛡️ HATA DURUMUNDA GÖRÜNECEK BAŞLIK
    return { title: 'Randevu Al | Planın' };
  }
}

export default async function BookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  
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
        // 🎯 İŞTE BURASI: Kendi linkini buraya yapıştırdım
        "url": `https://planin.com.tr/book/${shop.id}` 
      };
    }
  } catch (e) {}

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      {children}
    </>
  );
}