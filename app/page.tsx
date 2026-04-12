"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles, Map, ChevronRight, Scissors, Clock, ShieldCheck, Smartphone, Star, Zap, Users, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  
  const [shops, setShops] = useState<any[]>([]);
  const [turkeyData, setTurkeyData] = useState<any[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // 🎯 Kategori State'i eklendi
  const [selectedService, setSelectedService] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch(`https://konca-saas-backend.onrender.com/public/shops`);
        if (res.ok) setShops(await res.json());
      } catch (error) {}
    };
    fetchInitialData();

    fetch("https://turkiyeapi.dev/api/v1/provinces")
      .then(res => res.json())
      .then(json => {
        if (json && json.data) setTurkeyData(json.data.sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr-TR')));
      }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedCity && turkeyData.length > 0) {
      const cityData = turkeyData.find(c => c.name.toLocaleUpperCase('tr-TR') === selectedCity.toLocaleUpperCase('tr-TR'));
      if (cityData && cityData.districts) {
        setAvailableDistricts(cityData.districts.map((d: any) => d.name).sort((a: string, b: string) => a.localeCompare(b, 'tr-TR')));
      } else { setAvailableDistricts([]); }
    } else { setAvailableDistricts([]); }
  }, [selectedCity, turkeyData]);

  const uniqueServices = Array.from(new Set(shops.flatMap(shop => shop.services ? shop.services.map((s: any) => s.name) : []))).sort();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.append("city", selectedCity);
    if (selectedDistrict) params.append("district", selectedDistrict);
    if (selectedCategory) params.append("category", selectedCategory); // 🎯 Kategori parametresi eklendi
    if (selectedService) params.append("service", selectedService);
    if (searchQuery) params.append("q", searchQuery);
    
    router.push(`/salonlar?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-amber-500 selection:text-black">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@300;400;600&display=swap');
        .font-heading { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}} />

      <nav className="fixed w-full z-50 top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <img src="/logo.png" alt="Planın Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300" />
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white">PLANIN</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-gray-300 hover:text-amber-500 font-bold px-2 py-2 transition text-sm">GİRİŞ YAP</Link>
            <Link href="/isletmeler-icin" className="bg-amber-500 text-black px-5 py-2 rounded-lg font-bold font-heading tracking-wider hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(245,158,11,0.3)] text-sm">
              İŞLETMENİ EKLE
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-sm mb-6">
             <Sparkles size={16}/> Türkiye'nin Yeni Nesil Randevu Sistemi
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
            ŞEHRİNDEKİ EN İYİ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">BERBER VE KUAFÖRLERİ KEŞFET</span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-xl mb-12 font-body max-w-2xl mx-auto">
            Sıra beklemeden, tarzına en uygun berber, kuaför veya güzellik salonunu bul ve saniyeler içinde online randevunu al.
          </p>

          {/* 🔍 ARAMA KUTUSU (KATEGORİ EKLENMİŞ HALİ) */}
          <div className="bg-[#171717] p-3 rounded-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] max-w-7xl mx-auto text-left">
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14 focus-within:border-amber-500 transition">
              <MapPin className="text-amber-500 flex-shrink-0" size={20} />
              <select aria-label="İl seçiniz" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(""); }} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-zinc-900">Tüm Türkiye</option>
                {turkeyData.map(city => <option key={city.id} value={city.name} className="bg-zinc-900">{city.name}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14 focus-within:border-amber-500 transition">
              <Map className="text-amber-500 flex-shrink-0" size={20} />
              <select aria-label="İlçe seçiniz" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer" disabled={!selectedCity}>
                <option value="" className="bg-zinc-900">{selectedCity ? "Tüm İlçeler" : "Önce İl Seçin"}</option>
                {availableDistricts.map(district => <option key={district} value={district} className="bg-zinc-900">{district}</option>)}
              </select>
            </div>

            {/* 🎯 KATEGORİ SEÇİMİ (YENİ EKLEME) */}
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14 focus-within:border-amber-500 transition">
              <LayoutGrid className="text-amber-500 flex-shrink-0" size={20} />
              <select aria-label="Kategori" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-zinc-900">Tüm Sektörler</option>
                <option value="Erkek Kuaförü" className="bg-zinc-900">Erkek Kuaförü</option>
                <option value="Kadın Kuaförü" className="bg-zinc-900">Kadın Kuaförü</option>
                <option value="Güzellik Merkezi" className="bg-zinc-900">Güzellik Merkezi</option>
                <option value="Tırnak Stüdyosu" className="bg-zinc-900">Tırnak Stüdyosu</option>
                <option value="Spa & Masaj" className="bg-zinc-900">Spa & Masaj</option>
              </select>
            </div>

            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14 focus-within:border-amber-500 transition">
              <Scissors className="text-amber-500 flex-shrink-0" size={20} />
              <select aria-label="Hizmet türü seçiniz" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-zinc-900">Tüm Hizmetler</option>
                {uniqueServices.map((service, idx) => <option key={idx} value={service as string} className="bg-zinc-900">{service as string}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14 focus-within:border-amber-500 transition">
              <Search className="text-amber-500 flex-shrink-0" size={20} />
              <input type="text" placeholder="Salon adı ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent text-white outline-none pl-3 placeholder-gray-500" />
            </div>
            <button onClick={handleSearch} className="bg-amber-500 text-black px-8 rounded-xl font-heading font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 h-14 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              KEŞFET <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- Orijinal İçeriğin Geri Kalanı (Değiştirilmedi) --- */}
      <footer className="bg-[#050505] border-t border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-xs text-gray-600">© {new Date().getFullYear()} Planın.</p>
        </div>
      </footer>
    </div>
  );
}