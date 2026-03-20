import { Metadata } from 'next';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>; // 🎯 Next.js 15: params artık bir Promise!
}

// 1. GOOGLE BOTLARI İÇİN DİNAMİK BAŞLIK VE AÇIKLAMA ÜRETİCİ
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params; // 🚀 BURASI KRİTİK: id'yi bekleyip alıyoruz
  
  try {
    const res = await fetch(`https://konca-saas-backend.onrender.com/public/shop/${id}`, { cache: 'no-store' });
    
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
        url: `https://planin.com.tr/book/${id}`,
        images: [shop.coverImage || shop.logo || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'],
        type: 'website',
      },
    };
  } catch (error) {
    return { title: 'Randevu Al | Planın' };
  }
}

export default async function BookLayout({ children, params }: LayoutProps) {
  const { id } = await params; // 🚀 BURADA DA id'yi bekleyip alıyoruz
  
  let schemaData = null;
  try {
    const res = await fetch(`https://konca-saas-backend.onrender.com/public/shop/${id}`, { cache: 'no-store' });
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
        "url": `https://planin.com.tr/book/${id}` 
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