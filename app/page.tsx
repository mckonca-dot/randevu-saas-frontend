"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Star, Scissors, ChevronRight, TrendingUp, Loader2, Sparkles, Map, Crown, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [turkeyData, setTurkeyData] = useState<any[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // --- VERİ ÇEKME ---
  useEffect(() => {
    const fetchAllShops = async () => {
      try {
        setLoading(true);
        const t = Date.now();
        const res = await fetch(`https://konca-saas-backend.onrender.com/public/shops?t=${t}`, {
          cache: "no-store",
          headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
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

    fetch("https://turkiyeapi.dev/api/v1/provinces")
      .then(res => res.json())
      .then(json => {
        if (json && json.data) {
          const sortedProvinces = json.data.sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr-TR'));
          setTurkeyData(sortedProvinces);
        }
      })
      .catch(err => console.error("İl/İlçe datası çekilemedi:", err));
  }, []);

  // --- İLÇE FİLTRELEME MANTIĞI ---
  useEffect(() => {
    if (selectedCity && turkeyData.length > 0) {
      const cityData = turkeyData.find(c => c.name.toLocaleUpperCase('tr-TR') === selectedCity.toLocaleUpperCase('tr-TR'));
      if (cityData && cityData.districts) {
        const sortedDistricts = cityData.districts.map((d: any) => d.name).sort((a: string, b: string) => a.localeCompare(b, 'tr-TR'));
        setAvailableDistricts(sortedDistricts);
      } else { setAvailableDistricts([]); }
    } else { setAvailableDistricts([]); }
  }, [selectedCity, turkeyData]);

  const uniqueServices = Array.from(new Set(shops.flatMap(shop => shop.services ? shop.services.map((s: any) => s.name) : []))).sort();

  // --- ANA FİLTRELEME MANTIĞI ---
  const filteredShops = shops.filter(shop => {
    const shopCity = (shop.city || "").trim();
    const shopDistrict = (shop.district || "").trim();
    const shopName = (shop.shopName || "").trim();

    const matchCity = selectedCity ? shopCity.toLocaleUpperCase('tr-TR') === selectedCity.toLocaleUpperCase('tr-TR') : true;
    const matchDistrict = selectedDistrict ? shopDistrict.toLocaleUpperCase('tr-TR') === selectedDistrict.toLocaleUpperCase('tr-TR') : true;
    const matchService = selectedService ? shop.services?.some((s: any) => s.name === selectedService) : true;
    const matchQuery = searchQuery ? shopName.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) : true;

    const isShopActive = shop.isActive !== false;

    return matchCity && matchDistrict && matchService && matchQuery && isShopActive;
  });

  const promotedShops = filteredShops.filter(s => s.isPromoted);
  const regularShops = filteredShops.filter(s => !s.isPromoted);

  const scrollToResults = () => {
    const resultsSection = document.getElementById("shops-section");
    if (resultsSection) {
      const yOffset = -100; 
      const y = resultsSection.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-amber-500 selection:text-black">

      <style dangerouslySetInnerHTML={{
        __html: `
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
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider">BERBERİM</span>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#pricing" className="hidden md:block text-gray-300 hover:text-amber-500 font-bold transition text-sm">FİYATLANDIRMA</a>
            <Link href="/login" className="text-gray-300 hover:text-amber-500 font-bold px-2 py-2 transition text-sm">GİRİŞ YAP</Link>
            <Link href="/register" className="bg-amber-500 text-black px-5 py-2 rounded-lg font-bold font-heading tracking-wider hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(245,158,11,0.3)] text-sm">
              İŞLETMENİ EKLE
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO & ARAMA MOTORU SECTION --- */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
            ŞEHRİNDEKİ EN İYİ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">KUAFÖRLERİ KEŞFET</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl mb-12 font-body max-w-2xl mx-auto">
            Sıra beklemeden, tarzına en uygun kuaförü bul ve saniyeler içinde online randevunu al.
          </p>

          {/* ARAMA KUTUSU */}
          <div className="bg-[#171717] p-3 rounded-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] max-w-6xl mx-auto">
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14">
              <MapPin className="text-amber-500 flex-shrink-0" size={20} />
              <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(""); }} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-zinc-900">Tüm Türkiye</option>
                {turkeyData.map(city => <option key={city.id} value={city.name} className="bg-zinc-900">{city.name}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14">
              <Map className="text-amber-500 flex-shrink-0" size={20} />
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className={`w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer ${(!selectedCity || availableDistricts.length === 0) ? "opacity-50" : ""}`} disabled={!selectedCity || availableDistricts.length === 0}>
                <option value="" className="bg-zinc-900">{selectedCity ? "Tüm İlçeler" : "Önce İl Seçin"}</option>
                {availableDistricts.map(district => <option key={district} value={district} className="bg-zinc-900">{district}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14">
              <Sparkles className="text-amber-500 flex-shrink-0" size={20} />
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-zinc-900">Tüm Hizmetler</option>
                {uniqueServices.map((service, idx) => <option key={idx} value={service as string} className="bg-zinc-900">{service as string}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14">
              <Search className="text-amber-500 flex-shrink-0" size={20} />
              <input type="text" placeholder="Salon adı ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent text-white outline-none pl-3 placeholder-gray-500" />
            </div>
            <button 
              onClick={scrollToResults}
              className="bg-amber-500 text-black px-8 rounded-xl font-heading font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 h-14 md:col-span-2 lg:col-span-1"
            >
              KEŞFET <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- ANA İÇERİK --- */}
      <main id="shops-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-amber-500">
            <Loader2 className="animate-spin mb-4" size={48} />
            <h3 className="font-heading tracking-widest text-lg animate-pulse">KUAFÖRLER YÜKLENİYOR...</h3>
          </div>
        ) : (
          <div className="space-y-24">

            {/* 🌟 1. ÖNE ÇIKAN SALONLAR */}
            {promotedShops.length > 0 && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-3 mb-10">
                  <Crown className="text-amber-500" size={32} />
                  <h2 className="text-3xl font-bold font-heading">SÜPER KUAFÖRLER (ÖNE ÇIKANLAR)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {promotedShops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} isPromoted={true} />
                  ))}
                </div>
              </section>
            )}

            {/* 💈 2. TÜM SALONLAR */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-3 mb-10">
                <TrendingUp className="text-gray-400" size={28} />
                <h2 className="text-2xl font-bold font-heading">TÜM KUAFÖRLER</h2>
              </div>

              {regularShops.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {regularShops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} isPromoted={false} />
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
          </div>
        )}
      </main>

      {/* --- PREMIUM FOOTER --- */}
      <footer className="relative bg-[#050505] overflow-hidden">
        {/* Gradient üst çizgi */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

        {/* Dekoratif glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Üst Bölüm: CTA Banner */}
          <div className="py-12 border-b border-zinc-800/50">
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold font-heading text-white mb-2">İŞLETMENİ DİJİTALE TAŞI</h3>
                <p className="text-gray-400 font-body text-sm md:text-base">Hemen kayıt ol ve 30 günlük deneme ile dükkanını yönetmeye başla.</p>
              </div>
              <Link href="/register" className="flex-shrink-0 bg-amber-500 text-black px-8 py-4 rounded-xl font-heading font-bold tracking-widest text-sm hover:bg-yellow-400 transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]">
                ŞİMDİ BAŞLA
              </Link>
            </div>
          </div>

          {/* Ana Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-12">

            {/* Marka */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-black">
                  <Scissors size={22} />
                </div>
                <span className="font-heading text-xl font-bold tracking-wider text-white">KONCA SAAS</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 font-body">
                Türkiye'nin en gelişmiş yeni nesil online kuaför randevu ve salon yönetim sistemi.
              </p>
              {/* Sosyal Medya */}
              <div className="flex gap-3">
                <a href="https://www.instagram.com/muhammettknc/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/muhammet-konca-3ba090267/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://github.com/mckonca-dot" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </div>
            </div>

            {/* 🚀 AKTİF: Müşteriler İçin */}
            <div>
              <h4 className="text-white font-bold font-heading tracking-widest mb-5 text-sm">MÜŞTERİLER İÇİN</h4>
              <ul className="space-y-3 text-sm font-body">
                <li><button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Salon Keşfet</button></li>
                <li><Link href="/destek#nasil-calisir" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Nasıl Çalışır?</Link></li>
                <li><Link href="/destek#sss" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">S.S.S.</Link></li>
                <li><Link href="/destek" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Yardım Merkezi</Link></li>
              </ul>
            </div>

            {/* 🚀 AKTİF: Kuaförler İçin */}
            <div>
              <h4 className="text-white font-bold font-heading tracking-widest mb-5 text-sm">KUAFÖRLER İÇİN</h4>
              <ul className="space-y-3 text-sm font-body">
                <li><Link href="/register" className="text-amber-500 hover:text-yellow-400 transition-colors duration-200 font-semibold">Hemen Kayıt Ol</Link></li>
                <li><Link href="/login" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Yönetici Girişi</Link></li>
                <li><Link href="/#pricing" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Fiyatlandırma</Link></li>
                <li><Link href="/destek#iletisim" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">İletişim & Destek</Link></li>
              </ul>
            </div>

            {/* 🚀 AKTİF: Yasal */}
            <div>
              <h4 className="text-white font-bold font-heading tracking-widest mb-5 text-sm">YASAL</h4>
              <ul className="space-y-3 text-sm font-body">
                <li><Link href="/legal#gizlilik" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Gizlilik Politikası</Link></li>
                <li><Link href="/legal#sartlar" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Kullanım Şartları</Link></li>
                <li><Link href="/legal#kvkk" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">KVKK Aydınlatma</Link></li>
                <li><Link href="/legal#cerez" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Çerez Politikası</Link></li>
              </ul>
            </div>
          </div>

          {/* Alt Bar */}
          <div className="border-t border-zinc-800/50 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600 font-body">
              © {new Date().getFullYear()} Konca Yazılım. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600 font-body">
              Powered by <span className="text-amber-500 font-bold font-heading tracking-widest">KONCA SAAS</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

// 🎴 YENİ VİZYON: LOGO ANA PLANDA OLAN DÜKKAN KARTI
function ShopCard({ shop, isPromoted }: { shop: any, isPromoted: boolean }) {
  return (
    <div className={`group bg-[#171717] rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 ${isPromoted ? 'border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.2)]' : 'border-zinc-800 hover:border-zinc-600'}`}>
      
      {/* GÖRSEL ALANI */}
      <div className="relative h-56 overflow-hidden bg-[#050505] flex items-center justify-center">
        
        {/* 🚀 ANA GÖRSEL: Varsa LOGO, yoksa Kapak Foto, o da yoksa Varsayılan Resim */}
        <img 
          src={shop.logo || shop.coverImage || "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80"} 
          alt={shop.shopName} 
          className={`w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 
            ${shop.logo ? 'object-contain p-8' : 'object-cover'}`} 
        />

        {/* 🚀 LOGO VARSA ARKASINA HAFİF BİR PARLAMA VER (Premium His) */}
        {shop.logo && (
          <div className="absolute inset-0 bg-amber-500/10 blur-[40px] pointer-events-none z-0"></div>
        )}

        {/* ÖNE ÇIKAN ETİKETİ */}
        {isPromoted && (
          <div className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-20">
            <Crown size={10} /> ÖNE ÇIKAN
          </div>
        )}

        {/* 🚀🚀 GERÇEK PUAN ETİKETİ (Backend'den Gelen Veri!) 🚀🚀 */}
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700 flex items-center gap-1 z-10">
          <Star className="text-amber-500" size={14} fill="currentColor" />
          <span className="text-xs font-bold">{shop.rating || "5.0"}</span>
        </div>
      </div>

      {/* KART İÇERİĞİ */}
      <div className="p-6 relative z-10 bg-[#171717]">
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 font-body">
          <MapPin size={14} className="text-amber-500" />
          <span className="truncate">{shop.district || "Merkez"}, {shop.city || "Türkiye"}</span>
        </div>

        <h3 className={`font-heading text-xl font-bold mb-4 truncate ${isPromoted ? 'text-amber-500' : 'text-white'}`}>
          {shop.shopName || "İsimsiz Salon"}
        </h3>

        <div className="flex flex-wrap gap-1 mb-6 h-6 overflow-hidden">
          {shop.services?.slice(0, 3).map((srv: any, idx: number) => (
            <span key={idx} className="bg-zinc-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-md">
              {srv.name}
            </span>
          ))}
        </div>

        <Link href={`/book/${shop.id}`} className={`block w-full text-center py-3 rounded-xl font-heading font-bold tracking-widest text-sm transition-all ${isPromoted ? 'bg-amber-500 text-black hover:bg-yellow-400' : 'bg-[#0a0a0a] text-white border border-zinc-700 hover:border-amber-500'}`}>
          RANDEVU AL
        </Link>
      </div>
    </div>
  );
}