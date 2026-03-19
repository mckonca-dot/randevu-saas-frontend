import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  params: { city: string; district: string };
}

// 🎯 1. DİNAMİK METADATA: Google Arama Sonuçlarını Optimize Et
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = params.city.replace(/-/g, ' ');
  const district = params.district.replace(/-/g, ' ');
  
  const title = `${city} ${district} En İyi Kuaförler | Ücretsiz Randevu - Planın`;
  const description = `${city} ${district} bölgesindeki en popüler kuaförleri karşılaştırın, gerçek müşteri yorumlarını okuyun ve sıra beklemeden online randevunuzu 7/24 oluşturun.`;

  return {
    title: title.toUpperCase(), // Dikkat çekmesi için
    description,
    alternates: { canonical: `https://planin.com.tr/${params.city}/${params.district}` },
    openGraph: { title, description, url: `https://planin.com.tr/${params.city}/${params.district}`, type: 'website' }
  };
}

export default async function LocationLandingPage({ params }: Props) {
  // Backend'e istek at
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/shops/${params.city}/${params.district}`, { next: { revalidate: 3600 } });
  const shops = await res.json();

  // 🎯 2. STRUCTURED DATA (JSON-LD): Google'da "Liste" olarak görünmek için
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": shops.map((shop: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://planin.com.tr/${params.city}/${params.district}/${shop.slug}`,
      "name": shop.shopName
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* 🏙️ Hero Bölümü */}
      <section className="bg-black text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 capitalize">
          {params.city} {params.district} Kuaför Rehberi
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {params.city} bölgesinde hizmet veren {shops.length} profesyonel işletmeyi bulduk. 
          Sizin için en uygun uzmanı seçin ve randevunuzu saniyeler içinde planlayın.
        </p>
      </section>

      {/* ✂️ Dükkan Kartları */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shops.map((shop: any) => (
            <div key={shop.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div className="relative h-56">
                <Image src={shop.coverImage || '/placeholder.jpg'} alt={shop.shopName} fill className="object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-black uppercase">
                  {shop.district}
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold mb-2">{shop.shopName}</h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{shop.address}</p>
                <div className="flex items-center gap-2 mb-6 text-yellow-500 font-bold">
                  ⭐ 5.0 <span className="text-gray-400 text-xs font-normal">(Yeni İşletme)</span>
                </div>
                <Link 
                  href={`/${params.city}/${params.district}/${shop.slug}`}
                  className="block text-center bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10"
                >
                  Randevu Al
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}