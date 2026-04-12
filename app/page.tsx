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
  const [selectedCategory, setSelectedCategory] = useState(""); // 🎯 YENİ: Kategori State'i
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

  // 🚀 ARAMA YAP VE YÖNLENDİR
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
    <div className="min-h-screen bg-[#1A1A1D] text-[#F8F1E7] font-sans antialiased selection:bg-[#E8C9B5] selection:text-[#1A1A1D]">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@300;400;600&display=swap');
        .font-heading { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}} />

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 top-0 bg-[#1A1A1D]/90 backdrop-blur-md border-b border-[#33333A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <img src="/logo.png" alt="Planın Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-[#F8F1E7]">PLANIN</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-gray-400 hover:text-[#E8C9B5] font-bold px-2 py-2 transition text-sm">GİRİŞ YAP</Link>
            <Link href="/isletmeler-icin" className="bg-[#E8C9B5] text-[#1A1A1D] px-5 py-2 rounded-lg font-bold font-heading tracking-wider hover:bg-[#D6B49D] transition shadow-[0_0_15px_rgba(232,201,181,0.3)] text-sm">
              İŞLETMENİ EKLE
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E8C9B5]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8C9B5]/10 border border-[#E8C9B5]/20 text-[#E8C9B5] font-bold text-sm mb-6">
             <Sparkles size={16}/> Türkiye'nin Premium Randevu Sistemi
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
            ŞEHRİNDEKİ EN İYİ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8C9B5] to-[#F8F1E7]">SALONLARI KEŞFET</span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-xl mb-12 font-body max-w-2xl mx-auto">
            Tarzınıza en uygun berber, kuaför veya güzellik salonunu bulun ve saniyeler içinde online randevunuzu alın.
          </p>

          {/* 🔍 ARAMA KUTUSU (KATEGORİ EKLENMİŞ HALİ) */}
          <div className="bg-[#1F1F23] p-3 rounded-2xl border border-[#33333A] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-7xl mx-auto text-left">
            
            {/* Şehir Seçimi */}
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] px-4 py-3 h-14 focus-within:border-[#E8C9B5] transition">
              <MapPin className="text-[#E8C9B5] flex-shrink-0" size={20} />
              <select aria-label="İl" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(""); }} className="w-full bg-transparent text-[#F8F1E7] outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-[#1F1F23]">Tüm Türkiye</option>
                {turkeyData.map(city => <option key={city.id} value={city.name} className="bg-[#1F1F23]">{city.name}</option>)}
              </select>
            </div>

            {/* İlçe Seçimi */}
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] px-4 py-3 h-14 focus-within:border-[#E8C9B5] transition">
              <Map className="text-[#E8C9B5] flex-shrink-0" size={20} />
              <select aria-label="İlçe" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="w-full bg-transparent text-[#F8F1E7] outline-none pl-3 appearance-none cursor-pointer" disabled={!selectedCity}>
                <option value="" className="bg-[#1F1F23]">{selectedCity ? "Tüm İlçeler" : "Önce İl"}</option>
                {availableDistricts.map(district => <option key={district} value={district} className="bg-[#1F1F23]">{district}</option>)}
              </select>
            </div>

            {/* 🎯 KATEGORİ SEÇİMİ (YENİ) */}
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] px-4 py-3 h-14 focus-within:border-[#E8C9B5] transition">
              <LayoutGrid className="text-[#E8C9B5] flex-shrink-0" size={20} />
              <select aria-label="Kategori" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-transparent text-[#F8F1E7] outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-[#1F1F23]">Tüm Sektörler</option>
                <option value="Erkek Kuaförü" className="bg-[#1F1F23]">Erkek Kuaförü</option>
                <option value="Kadın Kuaförü" className="bg-[#1F1F23]">Kadın Kuaförü</option>
                <option value="Güzellik Merkezi" className="bg-[#1F1F23]">Güzellik Merkezi</option>
                <option value="Tırnak Stüdyosu" className="bg-[#1F1F23]">Tırnak Stüdyosu</option>
                <option value="Spa & Masaj" className="bg-[#1F1F23]">Spa & Masaj</option>
              </select>
            </div>

            {/* Hizmet Seçimi */}
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] px-4 py-3 h-14 focus-within:border-[#E8C9B5] transition">
              <Scissors className="text-[#E8C9B5] flex-shrink-0" size={20} />
              <select aria-label="Hizmet" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full bg-transparent text-[#F8F1E7] outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-[#1F1F23]">Tüm Hizmetler</option>
                {uniqueServices.map((service, idx) => <option key={idx} value={service as string} className="bg-[#1F1F23]">{service as string}</option>)}
              </select>
            </div>

            {/* İsim Arama */}
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] px-4 py-3 h-14 focus-within:border-[#E8C9B5] transition">
              <Search className="text-[#E8C9B5] flex-shrink-0" size={20} />
              <input type="text" placeholder="Salon adı..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent text-[#F8F1E7] outline-none pl-3 placeholder-gray-600" />
            </div>

            {/* Keşfet Butonu */}
            <button onClick={handleSearch} className="bg-[#E8C9B5] text-[#1A1A1D] rounded-xl font-heading font-bold text-lg hover:bg-[#D6B49D] transition-all flex items-center justify-center gap-2 h-14 shadow-[0_0_20px_rgba(232,201,181,0.3)]">
              KEŞFET <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- AVANTAJLAR SECTION --- */}
      <section className="py-24 bg-[#1F1F23] border-y border-[#33333A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h4 className="text-[#E8C9B5] font-heading tracking-widest mb-2 font-bold">NEDEN PLANIN?</h4>
            <h2 className="text-3xl md:text-5xl font-bold font-heading">DIJITAL RANDEVUDA PREMIUM DENEYİM</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1D] p-10 rounded-3xl border border-[#33333A] hover:border-[#E8C9B5]/50 transition duration-500 group">
              <div className="w-16 h-16 bg-[#1F1F23] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Clock className="text-[#E8C9B5]" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-[#F8F1E7]">SIRA BEKLEMEYE SON</h3>
              <p className="text-gray-400 font-body leading-relaxed">Berberde veya kuaförde saatlerce sıra beklemek geçmişte kaldı. Saniyeler içinde randevunuzu ayırtın.</p>
            </div>
            
            <div className="bg-[#1A1A1D] p-10 rounded-3xl border border-[#33333A] hover:border-[#E8C9B5]/50 transition duration-500 group">
              <div className="w-16 h-16 bg-[#1F1F23] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-[#E8C9B5]" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-[#F8F1E7]">GÜVENİLİR HİZMET</h3>
              <p className="text-gray-400 font-body leading-relaxed">Gerçek müşteri yorumlarını inceleyin, Düzce’nin ve Türkiye’nin en iyi salonlarını karşılaştırın.</p>
            </div>
            
            <div className="bg-[#1A1A1D] p-10 rounded-3xl border border-[#33333A] hover:border-[#E8C9B5]/50 transition duration-500 group">
              <div className="w-16 h-16 bg-[#1F1F23] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Smartphone className="text-[#E8C9B5]" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-[#F8F1E7]">7/24 ONLİNE PLANLAMA</h3>
              <p className="text-gray-400 font-body leading-relaxed">Gece yarısı aklınıza gelse bile telefonunuzdan tek tıkla işleminizi tamamlayın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1A1A1D] border-t border-[#33333A] py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-heading font-bold tracking-widest text-[#F8F1E7]">PLANIN</span>
          </div>
          <p className="text-xs text-gray-600 font-body">© {new Date().getFullYear()} Planın. Muhammet Konca tarafından Düzce'de geliştirildi.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/legal" className="hover:text-[#E8C9B5] transition">Gizlilik</Link>
            <Link href="/legal" className="hover:text-[#E8C9B5] transition">Şartlar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}