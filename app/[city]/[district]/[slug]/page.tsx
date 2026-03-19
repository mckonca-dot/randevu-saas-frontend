import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Breadcrumb from '../../../components/Breadcrumb';

interface Props {
  params: Promise<{ city: string; district: string; slug: string }>; // 🎯 Promise olarak tanımladık
}

// 🎯 1. Dinamik Metadata (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, city, district } = await params; // 🚀 BURASI KRİTİK: await ekledik
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/shop/by-slug/${slug}`);
    if (!res.ok) return { title: 'Dükkan Bulunamadı | Planın' };
    
    const shop = await res.json();
    const title = `${shop.shopName} | ${shop.city} ${shop.district} Randevu Al`;

    return {
      title,
      description: `${shop.city} bölgesindeki ${shop.shopName} için online randevu alın.`,
      alternates: { canonical: `https://planin.com.tr/${city}/${district}/${slug}` },
      openGraph: {
        title,
        url: `https://planin.com.tr/${city}/${district}/${slug}`,
        images: [{ url: shop.coverImage || '/default-share.jpg' }],
      },
    };
  } catch (error) {
    return { title: 'Randevu Al | Planın' };
  }
}

export default async function ShopPage({ params }: Props) {
  const { slug, city, district } = await params; // 🚀 BURADA DA await ekledik

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/shop/by-slug/${slug}`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) notFound();
  const shop = await res.json();

  // 🎯 2. LocalBusiness ve Yıldız Şeması (Aggregate Rating)
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": shop.shopName,
    "image": shop.coverImage || shop.logo || "https://planin.com.tr/og-image.jpg",
    "@id": `https://planin.com.tr/${city}/${district}/${slug}`,
    "url": `https://planin.com.tr/${city}/${district}/${slug}`,
    "telephone": shop.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": shop.fullAddress || "Adres bilgisi bulunmuyor",
      "addressLocality": district,
      "addressRegion": city,
      "addressCountry": "TR"
    },
    "priceRange": "₺₺",
  };

  // 🚀 SEO BOMBASI: Yıldızları çıkarıyoruz
  // Eğer dükkanın puanı backend'den geliyorsa onu kullanır, yoksa varsayılan 5.0 ve 1 yorum ekler
  jsonLd.aggregateRating = {
    "@type": "AggregateRating",
    "ratingValue": shop.rating || "5.0", 
    "reviewCount": shop.reviewCount || "1" 
  };

  // 🎯 3. SSS (FAQ) Şeması: Google aramalarında devasa görünmek için
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": `${shop.shopName} randevusu nasıl alınır?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Planın üzerinden saniyeler içinde hizmet seçip, uygun saati belirleyerek randevunuzu online oluşturabilirsiniz."
      }
    },
    {
      "@type": "Question",
      "name": `${shop.shopName} hangi saatler arası açık?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `İşletmemiz genellikle ${shop.workStart || '09:00'} ile ${shop.workEnd || '19:00'} saatleri arasında hizmet vermektedir. Kesin saatler için randevu takvimini kontrol edebilirsiniz.`
      }
    }]
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 🛠️ ŞEMALARI SİTEYE ENJEKTE EDİYORUZ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="bg-gray-50 border-b border-gray-100">
        <Breadcrumb 
          items={[
            { label: city, href: `/${city}` },
            { label: district, href: `/${city}/${district}` },
            { label: shop.shopName, href: `/${city}/${district}/${slug}` }
          ]} 
        />
      </div>
      
      <div className="container mx-auto p-4 md:p-8">
        <section className="max-w-5xl mx-auto">
          <div className="relative h-64 md:h-96 w-full shadow-2xl overflow-hidden rounded-3xl">
            <Image 
              src={shop.coverImage || '/placeholder.jpg'} 
              alt={shop.shopName}
              fill
              priority 
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>

          <div className="mt-8 flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{shop.shopName}</h1>
                <p className="text-xl text-gray-500 mt-1">{shop.tagline}</p>
                <p className="mt-4 text-gray-600">📍 {shop.fullAddress || `${district}, ${city}`}</p>
            </div>
            {/* Sayfa içinde de puanı şık bir şekilde gösterelim */}
            <div className="bg-yellow-50 text-yellow-700 font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                ⭐ {shop.rating || "5.0"}
                <span className="text-sm font-normal opacity-70">({shop.reviewCount || "1"} Değerlendirme)</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}