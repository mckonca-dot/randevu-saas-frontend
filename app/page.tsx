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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllShops = async () => {
      try {
        setLoading(true);
        // Önbelleği aşmak için timestamp ekliyoruz
        const res = await fetch(`https://konca-saas-backend.onrender.com/public/shops?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          // Sadece aktif dükkanları alıyoruz
          setShops(data.filter((s: any) => s.isActive !== false));
        }
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllShops();

    // İl/İlçe verisi çekme
    fetch("https://turkiyeapi.dev/api/v1/provinces")
      .then(res => res.json())
      .then(json => {
         if(json?.data) {
             const sorted = json.data.sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr-TR'));
             setTurkeyData(sorted);
         }
      });
  }, []);

  // İl seçildiğinde ilçeleri güncelle
  useEffect(() => {
    if(selectedCity && turkeyData.length > 0) {
        const city = turkeyData.find(c => c.name.toLocaleUpperCase('tr-TR') === selectedCity.toLocaleUpperCase('tr-TR'));
        if(city?.districts) {
            setAvailableDistricts(city.districts.map((d: any) => d.name).sort());
        }
    } else {
        setAvailableDistricts([]);
    }
  }, [selectedCity, turkeyData]);

  // Filtreleme Mantığı
  const filteredShops = shops.filter(shop => {
    const matchCity = selectedCity ? (shop.city || "").toLocaleUpperCase('tr-TR') === selectedCity.toLocaleUpperCase('tr-TR') : true;
    const matchDistrict = selectedDistrict ? (shop.district || "").toLocaleUpperCase('tr-TR') === selectedDistrict.toLocaleUpperCase('tr-TR') : true;
    const matchQuery = searchQuery ? (shop.shopName || "").toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) : true;
    return matchCity && matchDistrict && matchQuery;
  });

  // Salonları ayırma
  const promotedShops = filteredShops.filter(s => s.isPromoted);
  const regularShops = filteredShops.filter(s => !s.isPromoted);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-amber-500 selection:text-black">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@300;400;600&display=swap');
        .font-heading { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}} />

      {/* --- HERO & SEARCH --- */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-amber-500/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-bold font-heading mb-6 tracking-tight">
            STİLİNİ <span className="text-amber-500">BUL</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 font-body max-w-2xl mx-auto">Şehrindeki en iyi kuaförleri keşfet ve anında randevunu al.</p>

          <div className="bg-[#171717] p-3 rounded-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-4 gap-3 shadow-2xl max-w-5xl mx-auto">
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl px-4 py-3 h-14 border border-zinc-800">
              <MapPin className="text-amber-500" size={18} />
              <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(""); }} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer text-sm">
                <option value="" className="bg-zinc-900">Tüm Şehirler</option>
                {turkeyData.map(city => <option key={city.id} value={city.name} className="bg-zinc-900">{city.name}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl px-4 py-3 h-14 border border-zinc-800">
              <Map className="text-amber-500" size={18} />
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedCity} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer text-sm">
                <option value="" className="bg-zinc-900">Tüm İlçeler</option>
                {availableDistricts.map(d => <option key={d} value={d} className="bg-zinc-900">{d}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl px-4 py-3 h-14 border border-zinc-800 md:col-span-2 lg:col-span-1">
              <Search className="text-amber-500" size={18} />
              <input type="text" placeholder="Salon ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent text-white outline-none pl-3 placeholder-gray-600 text-sm" />
            </div>
            <button className="bg-amber-500 text-black px-6 rounded-xl font-heading font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 h-14">
              KEŞFET <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-amber-500">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-heading tracking-widest animate-pulse">Salonlar Hazırlanıyor...</p>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          
          {/* 🌟 ÖNE ÇIKAN SALONLAR (SÜPER SALONLAR) */}
          {promotedShops.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Crown className="text-amber-500" size={32} />
                <h2 className="text-3xl font-bold font-heading">SÜPER SALONLAR</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {promotedShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} isPromoted />
                ))}
              </div>
            </section>
          )}

          {/* 💈 TÜM SALONLAR */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Scissors className="text-gray-400" size={28} />
              <h2 className="text-2xl font-bold font-heading">TÜM SALONLAR</h2>
            </div>
            {regularShops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {regularShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                <p className="text-gray-500 font-body">Bu bölgede henüz bir salon bulunamadı.</p>
              </div>
            )}
          </section>

        </main>
      )}

      {/* FOOTER - Marka bilgilerini içerir */}
      <footer className="bg-[#050505] py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm font-body">© 2026 Konca SaaS - Online Randevu Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

// 🎴 SALON KARTI BİLEŞENİ
function ShopCard({ shop, isPromoted }: { shop: any, isPromoted?: boolean }) {
  return (
    <div className={`group bg-[#171717] rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 ${isPromoted ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-zinc-800 hover:border-zinc-700'}`}>
      <div className="relative h-56 overflow-hidden">
        <img 
          src={shop.coverImage || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
          alt={shop.shopName} 
        />
        {isPromoted && (
          <div className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Crown size={10} /> ÖNE ÇIKAN
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-700 flex items-center gap-1">
          <Star className="text-amber-500" size={12} fill="currentColor" />
          <span className="text-xs font-bold">5.0</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2 uppercase tracking-widest font-bold">
          <MapPin size={12} className="text-amber-500" />
          {shop.district || "Merkez"}, {shop.city || "Şehir"}
        </div>
        <h3 className="text-xl font-bold font-heading mb-4 text-white group-hover:text-amber-500 transition-colors">{shop.shopName || "İsimsiz Salon"}</h3>
        <Link href={`/book/${shop.id}`} className="block w-full text-center py-3 rounded-xl bg-[#0a0a0a] border border-zinc-800 text-white font-bold hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all text-sm font-heading tracking-widest">
          RANDEVU AL
        </Link>
      </div>
    </div>
  );
}