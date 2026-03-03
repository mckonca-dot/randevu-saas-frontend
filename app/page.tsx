"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Star, Scissors, ChevronRight, TrendingUp, Loader2, Sparkles, Map } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🚀 DİNAMİK İL VE İLÇE STATE'LERİ (API'den gelecek)
  const [turkeyData, setTurkeyData] = useState<any[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  // 🔍 Filtre Seçimleri
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedService, setSelectedService] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");

  // 1️⃣ Verileri Çekme (Dükkanlar ve Türkiye API)
  useEffect(() => {
    // 🚀 CACHE KIRICI EKLENDİ: Tarayıcının eski veriyi göstermesini engeller
    const fetchAllShops = async () => {
      try {
        setLoading(true);
        const t = Date.now(); // Her saniye değişen bu sayı sayesinde tarayıcı veriyi "yeni" sanıp hep çeker
        const res = await fetch(`https://konca-saas-backend.onrender.com/public/shops?t=${t}`, {
            cache: "no-store",
            headers: {
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            }
        });
        if (res.ok) {
          const data = await res.json();
          setShops(data);
        }
      } catch (error) {
        console.error("Sunucu bağlantı hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllShops();

    // Türkiye İl-İlçe verisini çek
    fetch("https://turkiyeapi.dev/api/v1/provinces")
      .then(res => res.json())
      .then(json => {
         if(json && json.data) {
             const sortedProvinces = json.data.sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr-TR'));
             setTurkeyData(sortedProvinces);
         }
      })
      .catch(err => console.error("İl/İlçe datası çekilemedi:", err));
  }, []);

  // 2️⃣ İl Seçildiğinde İlçeleri Doldurma Mantığı
  useEffect(() => {
    if(selectedCity && turkeyData.length > 0) {
        const cityData = turkeyData.find(c => c.name.toLocaleUpperCase('tr-TR') === selectedCity.toLocaleUpperCase('tr-TR'));
        if(cityData && cityData.districts) {
            const sortedDistricts = cityData.districts
               .map((d: any) => d.name)
               .sort((a: string, b: string) => a.localeCompare(b, 'tr-TR'));
            setAvailableDistricts(sortedDistricts);
        } else {
            setAvailableDistricts([]);
        }
    } else {
        setAvailableDistricts([]);
    }
  }, [selectedCity, turkeyData]);

  // 🚀 DİNAMİK HİZMET LİSTESİ OLUŞTURUCU 
  const uniqueServices = Array.from(
    new Set(
      shops.flatMap(shop => 
        shop.services ? shop.services.map((s: any) => s.name) : []
      )
    )
  ).sort();

  // 🔍 Arama ve Filtreleme Mantığı (4 Kademeli)
  const filteredShops = shops.filter(shop => {
    // 🚀 GÜVENLİK: Veritabanından gelen verilerin sonundaki boşlukları temizler (Trim)
    const shopCity = (shop.city || "").trim();
    const shopDistrict = (shop.district || "").trim();
    const shopName = (shop.shopName || "").trim();

    // 1. İl Filtresi
    const matchCity = selectedCity ? shopCity.toLocaleUpperCase('tr-TR') === selectedCity.toLocaleUpperCase('tr-TR') : true;
    
    // 2. İlçe Filtresi
    const matchDistrict = selectedDistrict ? shopDistrict.toLocaleUpperCase('tr-TR') === selectedDistrict.toLocaleUpperCase('tr-TR') : true;
    
    // 3. Hizmet Filtresi 
    const matchService = selectedService ? shop.services?.some((s: any) => s.name === selectedService) : true;

    // 4. Metin Arama Filtresi (Sadece Dükkan Adı)
    const matchQuery = searchQuery ? shopName.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) : true;
    
    return matchCity && matchDistrict && matchService && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-amber-500 selection:text-black">
      
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
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider">AKILLI RANDEVU</span>
          </div>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link href="/login" className="text-gray-300 hover:text-amber-500 font-bold px-2 md:px-4 py-2 transition text-sm md:text-base">GİRİŞ YAP</Link>
            <Link href="/register" className="bg-amber-500 text-black px-4 md:px-6 py-2 rounded-lg font-bold font-heading tracking-wider hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(245,158,11,0.3)] text-sm md:text-base">
              DÜKKAN EKLE
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO & ARAMA MOTORU SECTION --- */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
            ŞEHRİNDEKİ EN İYİ <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">KUAFÖRLERİ KEŞFET</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl mb-12 font-body max-w-2xl mx-auto">
            Sıra beklemeden, tarzına en uygun salonu bul ve saniyeler içinde online randevunu al.
          </p>

          {/* 🔍 YENİ 4'LÜ PROFESYONEL ARAMA KUTUSU */}
          <div className="bg-[#171717] p-3 rounded-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] max-w-6xl mx-auto">
            
            {/* 1. İl Seçimi */}
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 focus-within:border-amber-500 transition-colors px-4 py-3 h-14">
              <MapPin className="text-amber-500 flex-shrink-0" size={20} />
              <select 
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedDistrict(""); // İl değişince ilçeyi sıfırla
                }}
                className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer text-sm md:text-base"
              >
                <option value="" className="bg-zinc-900">Tüm Türkiye</option>
                {turkeyData.map(city => (
                  <option key={city.id} value={city.name} className="bg-zinc-900">{city.name}</option>
                ))}
              </select>
            </div>

            {/* 2. İlçe Seçimi */}
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 focus-within:border-amber-500 transition-colors px-4 py-3 h-14">
              <Map className="text-amber-500 flex-shrink-0" size={20} />
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className={`w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer text-sm md:text-base ${(!selectedCity || availableDistricts.length === 0) ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!selectedCity || availableDistricts.length === 0}
              >
                <option value="" className="bg-zinc-900">{selectedCity ? "Tüm İlçeler" : "Önce İl Seçin"}</option>
                {availableDistricts.map(district => (
                  <option key={district} value={district} className="bg-zinc-900">{district}</option>
                ))}
              </select>
            </div>

            {/* 3. Hizmet Seçimi */}
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 focus-within:border-amber-500 transition-colors px-4 py-3 h-14">
              <Sparkles className="text-amber-500 flex-shrink-0" size={20} />
              <select 
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer text-sm md:text-base"
              >
                <option value="" className="bg-zinc-900">Tüm Hizmetler</option>
                {uniqueServices.map((service, idx) => (
                  <option key={idx} value={service as string} className="bg-zinc-900">{service as string}</option>
                ))}
              </select>
            </div>

            {/* 4. Arama Inputu */}
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 focus-within:border-amber-500 transition-colors px-4 py-3 h-14">
              <Search className="text-amber-500 flex-shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Salon adı ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white outline-none pl-3 placeholder-gray-500 text-sm md:text-base"
              />
            </div>

            {/* Arama Butonu */}
            <button className="bg-amber-500 text-black px-8 rounded-xl font-heading font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 h-14 md:col-span-2 lg:col-span-1">
              FİLTRELE <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- SONUÇLAR (VİTRİN) SECTION --- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <TrendingUp className="text-amber-500" size={28} />
          <h2 className="text-2xl md:text-3xl font-bold font-heading">ÖNE ÇIKAN SALONLAR</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-amber-500">
            <Loader2 className="animate-spin mb-4" size={48} />
            <h3 className="font-heading tracking-widest text-lg animate-pulse">SALONLAR YÜKLENİYOR...</h3>
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="bg-[#171717] border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500 transition-all duration-300 group flex flex-col">
                <div className="relative h-48 overflow-hidden bg-[#0a0a0a]">
                  <img 
                    src={shop.coverImage || "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                    alt={shop.shopName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700 flex items-center gap-1">
                    <Star className="text-amber-500" size={14} fill="currentColor" />
                    <span className="text-sm font-bold">5.0</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2 font-body">
                    <MapPin size={14} className="text-amber-500 flex-shrink-0" />
                    <span className="truncate">{shop.district || "Merkez"}, {shop.city || "Türkiye"}</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3 truncate">{shop.shopName || "İsimsiz Salon"}</h3>
                  
                  {/* Dükkanın sunduğu hizmetleri ufak etiketler (Badge) olarak gösteriyoruz */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {shop.services?.slice(0, 3).map((srv: any, idx: number) => (
                      <span key={idx} className="bg-zinc-800 text-gray-300 text-xs px-2 py-1 rounded-md">{srv.name}</span>
                    ))}
                    {shop.services?.length > 3 && <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-1 rounded-md">+{shop.services.length - 3}</span>}
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                      <div>
                        <p className="text-xs text-gray-500 font-heading tracking-wider">DURUM</p>
                        <p className="font-bold text-green-500 text-sm">Aktif</p>
                      </div>
                      <Link href={`/book/${shop.id}`} className="bg-[#0a0a0a] text-white border border-zinc-700 hover:border-amber-500 hover:text-amber-500 px-4 py-2 rounded-lg text-sm font-bold transition">
                        RANDEVU AL
                      </Link>
                    </div>
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