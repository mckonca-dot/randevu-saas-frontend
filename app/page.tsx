"use client";

import { useState } from "react";
import { Search, MapPin, Star, Scissors, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";

// 🚀 ÖRNEK VERİLER (Backend'i bağlayana kadar vitrini süsleyecek)
const MOCK_SHOPS = [
  { id: 1, name: "Prime Erkek Kuaförü", city: "İstanbul", district: "Kadıköy", rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", priceStart: 400 },
  { id: 2, name: "Flaş Stil Merkezi", city: "İstanbul", district: "Beşiktaş", rating: 4.8, reviews: 95, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", priceStart: 350 },
  { id: 3, name: "Gold Barber Salon", city: "Ankara", district: "Çankaya", rating: 5.0, reviews: 210, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", priceStart: 500 },
  { id: 4, name: "Klasik Berber", city: "İzmir", district: "Bornova", rating: 4.6, reviews: 45, image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", priceStart: 250 },
];

const CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Arama ve Filtreleme Mantığı
  const filteredShops = MOCK_SHOPS.filter(shop => {
    const matchCity = selectedCity ? shop.city === selectedCity : true;
    const matchQuery = searchQuery ? (shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || shop.district.toLowerCase().includes(searchQuery.toLowerCase())) : true;
    return matchCity && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-amber-500 selection:text-black">
      
      {/* CSS Animasyonları */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@300;400;600&display=swap');
        .font-heading { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}} />

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-black">
              <Scissors size={24} />
            </div>
            <span className="font-heading text-2xl font-bold tracking-wider">AKILLI RANDEVU</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-300 hover:text-amber-500 font-bold px-4 py-2 transition">GİRİŞ YAP</Link>
            <Link href="/register" className="bg-amber-500 text-black px-6 py-2 rounded-lg font-bold font-heading tracking-wider hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              DÜKKAN EKLE
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO & ARAMA MOTORU SECTION --- */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Arka plan ışık efekti */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
            ŞEHRİNDEKİ EN İYİ <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">KUAFÖRLERİ KEŞFET</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 font-body max-w-2xl mx-auto">
            Sıra beklemeden, tarzına en uygun salonu bul ve saniyeler içinde online randevunu al.
          </p>

          {/* 🔍 ARAMA KUTUSU */}
          <div className="bg-[#171717] p-2 md:p-3 rounded-2xl border border-zinc-800 flex flex-col md:flex-row gap-3 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            
            {/* İl Seçimi */}
            <div className="relative flex-1 flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 focus-within:border-amber-500 transition-colors px-4 py-3">
              <MapPin className="text-amber-500 flex-shrink-0" size={20} />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer text-sm md:text-base"
              >
                <option value="" className="bg-zinc-900">Tüm Şehirler</option>
                {CITIES.map(city => (
                  <option key={city} value={city} className="bg-zinc-900">{city}</option>
                ))}
              </select>
            </div>

            {/* Arama Inputu (İlçe veya İsim) */}
            <div className="relative flex-[2] flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 focus-within:border-amber-500 transition-colors px-4 py-3">
              <Search className="text-amber-500 flex-shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="İlçe, semt veya salon adı ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white outline-none pl-3 placeholder-gray-500 text-sm md:text-base"
              />
            </div>

            {/* Arama Butonu */}
            <button className="bg-amber-500 text-black px-8 py-4 rounded-xl font-heading font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 flex-shrink-0">
              ARA <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- SONUÇLAR (VİTRİN) SECTION --- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <TrendingUp className="text-amber-500" size={28} />
          <h2 className="text-3xl font-bold font-heading">ÖNE ÇIKAN SALONLAR</h2>
        </div>

        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="bg-[#171717] border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500 transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700 flex items-center gap-1">
                    <Star className="text-amber-500" size={14} fill="currentColor" />
                    <span className="text-sm font-bold">{shop.rating}</span>
                    <span className="text-xs text-gray-400">({shop.reviews})</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2 font-body">
                    <MapPin size={14} className="text-amber-500" />
                    {shop.district}, {shop.city}
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-4 truncate">{shop.name}</h3>
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                    <div>
                      <p className="text-xs text-gray-500 font-heading tracking-wider">BAŞLANGIÇ</p>
                      <p className="font-bold text-amber-500">{shop.priceStart} ₺</p>
                    </div>
                    {/* 👇 Tıklayınca dükkanın kendi randevu sayfasına yönlendirir */}
                    <Link href={`/book/${shop.id}`} className="bg-[#0a0a0a] text-white border border-zinc-700 hover:border-amber-500 hover:text-amber-500 px-4 py-2 rounded-lg text-sm font-bold transition">
                      RANDEVU AL
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#171717] rounded-2xl border border-zinc-800">
            <Search className="mx-auto text-zinc-600 mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-2">Sonuç Bulunamadı</h3>
            <p className="text-gray-500">Aradığınız kriterlere uygun bir kuaför henüz sistemimizde yok.</p>
          </div>
        )}
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-zinc-900 py-12 text-center mt-20">
        <p className="text-gray-500 font-body text-sm">
          © 2026 Akıllı Randevu Pazaryeri. Tüm hakları saklıdır.
        </p>
      </footer>
    </div>
  );
}