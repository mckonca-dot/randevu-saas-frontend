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
         if(json && json.data) {
             const sortedProvinces = json.data.sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr-TR'));
             setTurkeyData(sortedProvinces);
         }
      })
      .catch(err => console.error("İl/İlçe datası çekilemedi:", err));
  }, []);

  useEffect(() => {
    if(selectedCity && turkeyData.length > 0) {
        const cityData = turkeyData.find(c => c.name.toLocaleUpperCase('tr-TR') === selectedCity.toLocaleUpperCase('tr-TR'));
        if(cityData && cityData.districts) {
            const sortedDistricts = cityData.districts.map((d: any) => d.name).sort((a: string, b: string) => a.localeCompare(b, 'tr-TR'));
            setAvailableDistricts(sortedDistricts);
        } else { setAvailableDistricts([]); }
    } else { setAvailableDistricts([]); }
  }, [selectedCity, turkeyData]);

  const uniqueServices = Array.from(new Set(shops.flatMap(shop => shop.services ? shop.services.map((s: any) => s.name) : []))).sort();

  const filteredShops = shops.filter(shop => {
    const shopCity = (shop.city || "").trim();
    const shopDistrict = (shop.district || "").trim();
    const shopName = (shop.shopName || "").trim();

    const matchCity = selectedCity ? shopCity.toLocaleUpperCase('tr-TR') === selectedCity.toLocaleUpperCase('tr-TR') : true;
    const matchDistrict = selectedDistrict ? shopDistrict.toLocaleUpperCase('tr-TR') === selectedDistrict.toLocaleUpperCase('tr-TR') : true;
    const matchService = selectedService ? shop.services?.some((s: any) => s.name === selectedService) : true;
    const matchQuery = searchQuery ? shopName.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) : true;
    
    // Sadece aktif ve süresi bitmemiş dükkanlar görünür
    const isShopActive = shop.isActive !== false;
    
    return matchCity && matchDistrict && matchService && matchQuery && isShopActive;
  });

  const sortedShops = [...filteredShops].sort((a, b) => {
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;
    return 0;
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
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider">KONCA SAAS</span>
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
            ŞEHRİNDEKİ EN İYİ <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">KUAFÖRLERİ KEŞFET</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl mb-12 font-body max-w-2xl mx-auto">
            Sıra beklemeden, tarzına en uygun salonu bul ve saniyeler içinde online randevunu al.
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
            <button className="bg-amber-500 text-black px-8 rounded-xl font-heading font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 h-14 md:col-span-2 lg:col-span-1">
              FİLTRELE <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- SONUÇLAR (VİTRİN) SECTION --- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
        <div className="flex items-center gap-3 mb-10">
          <TrendingUp className="text-amber-500" size={28} />
          <h2 className="text-2xl md:text-3xl font-bold font-heading">ÖNE ÇIKAN SALONLAR</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-amber-500">
            <Loader2 className="animate-spin mb-4" size={48} />
            <h3 className="font-heading tracking-widest text-lg animate-pulse">SALONLAR YÜKLENİYOR...</h3>
          </div>
        ) : sortedShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedShops.map((shop) => (
              <div key={shop.id} className={`bg-[#171717] border ${shop.isPromoted ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-zinc-800'} rounded-2xl overflow-hidden hover:border-amber-500 transition-all duration-300 group flex flex-col relative`}>
                {shop.isPromoted && (
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-br-lg z-20 flex items-center gap-1 shadow-lg">
                    <Crown size={12} /> SÜPER SALON
                  </div>
                )}
                <div className="relative h-48 overflow-hidden bg-[#0a0a0a]">
                  <img src={shop.coverImage || "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={shop.shopName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700 flex items-center gap-1 z-10">
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
                  <div className="flex flex-wrap gap-1 mb-4">
                    {shop.services?.slice(0, 3).map((srv: any, idx: number) => (
                      <span key={idx} className="bg-zinc-800 text-gray-300 text-xs px-2 py-1 rounded-md">{srv.name}</span>
                    ))}
                    {shop.services?.length > 3 && <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-1 rounded-md">+{shop.services.length - 3}</span>}
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                      <Link href={`/book/${shop.id}`} className="w-full bg-[#0a0a0a] text-center text-white border border-zinc-700 hover:border-amber-500 hover:text-amber-500 px-4 py-3 rounded-lg text-sm font-bold transition">
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

      {/* 🚀 YENİ SAAS FİYATLANDIRMA SECTION */}
      <section id="pricing" className="py-20 bg-[#171717] border-t border-zinc-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-amber-500 font-heading tracking-widest mb-2 font-bold">KUAFÖRLER İÇİN</h4>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white">İŞLETMENİZİ DİJİTALE TAŞIYIN</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Müşterilerinize online randevu imkanı sunun, WhatsApp hatırlatmaları gönderin ve gelirinizi katlayın. Üstelik 30 gün tamamen ücretsiz!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Basic Plan */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-8 hover:border-amber-500/50 transition duration-300">
              <h3 className="text-2xl font-bold font-heading text-white mb-2">Başlangıç</h3>
              <p className="text-gray-500 text-sm mb-6">Küçük işletmeler ve tek çalışanlı berberler için ideal.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">500₺</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <Link href="/register" className="block w-full py-3 px-4 bg-zinc-800 text-white text-center rounded-xl font-bold hover:bg-zinc-700 transition mb-8">
                Ücretsiz Denemeye Başla
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> 5 Personele Kadar Ekleme</li>
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> Sınırsız Randevu Alımı</li>
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> Temel Galeri Yönetimi</li>
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> İşletme QR Kodu</li>
              </ul>
            </div>

            {/* Pro Plan (Önerilen) */}
            <div className="bg-[#0a0a0a] border-2 border-amber-500 rounded-3xl p-8 transform md:-translate-y-4 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-xs font-bold tracking-wider font-heading">EN ÇOK TERCİH EDİLEN</div>
              <h3 className="text-2xl font-bold font-heading text-white mb-2">Profesyonel</h3>
              <p className="text-gray-500 text-sm mb-6">Büyüyen salonlar ve çoklu çalışanlı işletmeler için.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">800₺</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <Link href="/register" className="block w-full py-3 px-4 bg-amber-500 text-black text-center rounded-xl font-bold hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-8">
                Ücretsiz Denemeye Başla
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> 10 Personele Kadar Ekleme</li>
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> WhatsApp Hatırlatmaları</li>
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> Gelişmiş İstatistikler</li>
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> Müşteri Notları Sistemi</li>
              </ul>
            </div>

            {/* Ultra Plan */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-8 hover:border-amber-500/50 transition duration-300">
              <h3 className="text-2xl font-bold font-heading text-white mb-2">Ultra / VIP</h3>
              <p className="text-gray-500 text-sm mb-6">Büyük zincirler ve lüks segment salonlar için sınırsız güç.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">1500₺</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <Link href="/register" className="block w-full py-3 px-4 bg-zinc-800 text-white text-center rounded-xl font-bold hover:bg-zinc-700 transition mb-8">
                Ücretsiz Denemeye Başla
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> Sınırsız Personel Ekleme</li>
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> Ana Sayfada Öne Çıkarılma (VIP)</li>
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> Öncelikli Canlı Destek</li>
                <li className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="text-amber-500" size={18}/> Tüm Pro Özellikleri</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* --- YENİ DETAYLI FOOTER --- */}
      <footer className="bg-[#050505] pt-16 pb-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="text-amber-500" size={24}/>
                <span className="font-heading text-xl font-bold tracking-wider text-white">KONCA SAAS</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Türkiye'nin en gelişmiş yeni nesil online kuaför randevu ve salon yönetim sistemi.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold font-heading tracking-widest mb-4">MÜŞTERİLER İÇİN</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-amber-500 transition">Salon Keşfet</a></li>
                <li><a href="#" className="hover:text-amber-500 transition">Nasıl Çalışır?</a></li>
                <li><a href="#" className="hover:text-amber-500 transition">Sıkça Sorulan Sorular</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold font-heading tracking-widest mb-4">KUAFÖRLER İÇİN</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/register" className="text-amber-500 hover:text-yellow-400 transition font-bold">Hemen Kayıt Ol (30 Gün Ücretsiz)</Link></li>
                <li><Link href="/login" className="hover:text-amber-500 transition">Yönetici Girişi</Link></li>
                <li><a href="#pricing" className="hover:text-amber-500 transition">Fiyatlandırma & Paketler</a></li>
                <li><a href="#" className="hover:text-amber-500 transition">İletişim & Destek</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Konca SaaS Yönetim Sistemleri. Tüm hakları saklıdır.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white transition">Kullanım Şartları</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}