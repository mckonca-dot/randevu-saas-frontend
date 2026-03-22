import { Metadata } from 'next';
import { ReactNode } from 'react';

// 🎯 Artık id değil, slug bekliyoruz
interface LayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>; 
}

// 1. GOOGLE BOTLARI İÇİN DİNAMİK BAŞLIK VE AÇIKLAMA ÜRETİCİ
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; // 🚀 BURASI KRİTİK: slug'ı bekleyip alıyoruz
  
  try {
    // Backend'e slug gönderiyoruz
    const res = await fetch(`https://konca-saas-backend.onrender.com/public/shop/${slug}`, { cache: 'no-store' });
    
    if (!res.ok) return { title: 'Kuaför Bulunamadı | Planın' };
    
    const shop = await res.json();

    const title = `${shop.shopName} - Randevu Al | Planın`;
    const description = `${shop.city}, ${shop.district} bölgesindeki en iyi kuaförlerden ${shop.shopName} için online randevu alın. ${shop.tagline || ''}`;

    return {
      title,
      description,
      openGraph: {
        title: `${shop.shopName} - Online Randevu`,
        description,
        // 🎯 URL'i /salon/slug olarak güncelledik
        url: `https://planin.com.tr/salon/${slug}`,
        images: [shop.coverImage || shop.logo || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'],
        type: 'website',
      },
    };
  } catch (error) {
    return { title: 'Randevu Al | Planın' };
  }
}

export default async function BookLayout({ children, params }: LayoutProps) {
  const { slug } = await params; // 🚀 BURADA DA slug'ı bekleyip alıyoruz
  
  let schemaData = null;
  try {
    // Backend'e slug gönderiyoruz
    const res = await fetch(`https://konca-saas-backend.onrender.com/public/shop/${slug}`, { cache: 'no-store' });
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
        // 🎯 URL'i /salon/slug olarak güncelledik
        "url": `https://planin.com.tr/salon/${slug}` 
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