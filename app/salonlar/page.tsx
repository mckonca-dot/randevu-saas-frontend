"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Search, Crown, Star, Scissors, ArrowLeft, Loader2, Sparkles, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";

// 🌟 Suspense ile sarmalanmış asıl içerik bileşeni
function SalonlarIcerik() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // URL'den gelen filtreler
  const cityParam = searchParams.get("city") || "";
  const districtParam = searchParams.get("district") || "";
  const serviceParam = searchParams.get("service") || "";
  const queryParam = searchParams.get("q") || "";

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://planin.onrender.com/public/shops`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setShops(data);
        }
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  // 🚀 1. FİLTRELEME İŞLEMİ
  const filteredShops = shops.filter(shop => {
    const shopCity = (shop.city || "").trim();
    const shopDistrict = (shop.district || "").trim();
    const shopName = (shop.shopName || "").trim();

    const matchCity = cityParam ? shopCity.toLocaleUpperCase('tr-TR') === cityParam.toLocaleUpperCase('tr-TR') : true;
    const matchDistrict = districtParam ? shopDistrict.toLocaleUpperCase('tr-TR') === districtParam.toLocaleUpperCase('tr-TR') : true;
    const matchService = serviceParam ? shop.services?.some((s: any) => s.name === serviceParam) : true;
    const matchQuery = queryParam ? shopName.toLocaleLowerCase('tr-TR').includes(queryParam.toLocaleLowerCase('tr-TR')) : true;

    return matchCity && matchDistrict && matchService && matchQuery && shop.isActive !== false;
  });

  // 🚀 2. SIRALAMA İŞLEMİ (ÖNE ÇIKANLAR EN ÜSTTE)
  const sortedShops = [...filteredShops].sort((a, b) => {
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;
    return 0; // İkisi de aynıysa oldukları gibi kalsın
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-amber-500 selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@300;400;600&display=swap');
        .font-heading { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}} />

      {/* Üst Bar */}
      <div className="bg-[#111] border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-gray-400 hover:text-amber-500 transition font-bold text-sm">
            <ArrowLeft size={18}/> Ana Sayfaya Dön
          </button>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            {/* Kendi Logon */}
            <img 
              src="/logo.png" 
              alt="Planın Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            {/* Planın Yazısı */}
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white">PLANIN</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 pb-24">
        {/* Arama Özeti */}
        <div className="mb-10 border-b border-zinc-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2 flex items-center gap-3">
              <Sparkles className="text-amber-500"/> KUAFÖR SONUÇLARI
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm">
              <Filter size={16} className="text-amber-500"/> Filtreler: 
              {cityParam ? <span className="bg-zinc-800 px-2 py-1 rounded text-white">{cityParam}</span> : null}
              {districtParam ? <span className="bg-zinc-800 px-2 py-1 rounded text-white">{districtParam}</span> : null}
              {serviceParam ? <span className="bg-zinc-800 px-2 py-1 rounded text-white">{serviceParam}</span> : null}
              {queryParam ? <span className="bg-zinc-800 px-2 py-1 rounded text-white">"{queryParam}"</span> : null}
              {!cityParam && !districtParam && !serviceParam && !queryParam && <span>Tüm Türkiye</span>}
            </div>
          </div>
          <div className="text-gray-500 font-bold bg-[#171717] px-4 py-2 rounded-lg border border-zinc-800 shadow-inner">
            <span className="text-amber-500 text-xl">{sortedShops.length}</span> Salon Bulundu
          </div>
        </div>

        {/* Listeleme */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-amber-500">
            <Loader2 className="animate-spin mb-4" size={48} />
            <h3 className="font-heading tracking-widest text-lg animate-pulse">SALONLAR ARANIYOR...</h3>
          </div>
        ) : sortedShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} isPromoted={shop.isPromoted} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-[#111] rounded-3xl border border-zinc-900 shadow-inner">
            <Search className="mx-auto text-zinc-700 mb-6" size={64} />
            <h3 className="text-3xl font-bold font-heading text-white mb-4 tracking-widest">SONUÇ BULUNAMADI</h3>
            <p className="text-gray-500 font-body max-w-md mx-auto mb-8">Aradığınız kriterlere uygun bir salon maalesef şu an sistemimizde bulunmuyor. Farklı bir ilçe veya hizmet aramayı deneyin.</p>
            <button onClick={() => router.push("/")} className="bg-amber-500 text-black px-8 py-3 rounded-xl font-bold font-heading hover:bg-yellow-400 transition">
              YENİ ARAMA YAP
            </button>
          </div>
        )}
      </div>

      {/* --- PREMIUM FOOTER --- */}
      <footer className="relative bg-[#050505] overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
                <img 
                  src="/logo.png" 
                  alt="Planın Logo" 
                  className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300" 
                />
                <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white">PLANIN</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 font-body mt-4">
                Türkiye'nin en gelişmiş yeni nesil online kuaför randevu ve salon yönetim sistemi.
              </p>
            </div>

            {/* Müşteriler İçin */}
            <div>
              <h4 className="text-white font-bold font-heading tracking-widest mb-5 text-sm">MÜŞTERİLER İÇİN</h4>
              <ul className="space-y-3 text-sm font-body">
                <li><button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Salon Keşfet</button></li>
                <li><Link href="/destek#nasil-calisir" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Nasıl Çalışır?</Link></li>
                <li><Link href="/destek#sss" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">S.S.S.</Link></li>
                <li><Link href="/destek" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Yardım Merkezi</Link></li>
              </ul>
            </div>

            {/* Kuaförler İçin */}
            <div>
              <h4 className="text-white font-bold font-heading tracking-widest mb-5 text-sm">KUAFÖRLER İÇİN</h4>
              <ul className="space-y-3 text-sm font-body">
                <li><Link href="/isletmeler-icin" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">İşletmeni Ekle</Link></li>
                <li><Link href="/login" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Yönetici Girişi</Link></li>
                <li><Link href="/isletmeler-icin#pricing" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Fiyatlandırma</Link></li>
              </ul>
            </div>

            {/* Yasal */}
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

          <div className="border-t border-zinc-800/50 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600 font-body">© {new Date().getFullYear()} Planın. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 🎴 DÜKKAN KARTI BİLEŞENİ
function ShopCard({ shop, isPromoted }: { shop: any, isPromoted: boolean }) {
  return (
    <div className={`group bg-[#171717] rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 ${isPromoted ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-zinc-800 hover:border-zinc-600'}`}>
      <div className="relative h-48 md:h-56 overflow-hidden bg-[#050505] flex items-center justify-center">
        <img 
          src={shop.logo || shop.coverImage || "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80"} 
          alt={shop.shopName} 
          className={`w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 ${shop.logo ? 'object-contain p-8' : 'object-cover'}`} 
        />
        {shop.logo && <div className="absolute inset-0 bg-amber-500/10 blur-[40px] pointer-events-none z-0"></div>}
        
        {/* VİP / Öne Çıkan Etiketi */}
        {isPromoted && (
          <div className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-20 font-heading tracking-widest border border-yellow-300">
            <Crown size={12} fill="currentColor" /> ÖNE ÇIKAN
          </div>
        )}
        
        {/* Puan */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700 flex items-center gap-1 z-10">
          <Star className="text-amber-500" size={14} fill="currentColor" />
          <span className="text-xs font-bold text-white">{shop.rating || "5.0"}</span>
        </div>
      </div>

      <div className="p-5 relative z-10 bg-[#171717]">
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 font-body font-bold uppercase tracking-wider">
          <MapPin size={14} className="text-amber-500" />
          <span className="truncate">{shop.district || "Merkez"}, {shop.city || "Türkiye"}</span>
        </div>
        <h3 className={`font-heading text-xl font-bold mb-3 truncate ${isPromoted ? 'text-amber-500' : 'text-white'}`}>
          {shop.shopName || "İsimsiz Salon"}
        </h3>
        
        <div className="flex flex-wrap gap-1.5 mb-6 h-6 overflow-hidden">
          {shop.services?.slice(0, 3).map((srv: any, idx: number) => (
            <span key={idx} className="bg-zinc-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-md font-bold border border-zinc-700 truncate max-w-[100px]">{srv.name}</span>
          ))}
        </div>
        
        {/* YÖNLENDİRME LİNKİ (Slug ile - Güvenli A Etiketi) */}
        <a href={`/salon/${shop.slug || shop.id}`} className={`flex items-center justify-center gap-2 w-full text-center py-3 rounded-xl font-heading font-bold tracking-widest text-sm transition-all ${isPromoted ? 'bg-amber-500 text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-[#0a0a0a] text-white border border-zinc-700 hover:border-amber-500'}`}>
          RANDEVU AL <ChevronRight size={16}/>
        </a>
      </div>
    </div>
  );
}

// 🛡️ Ana export: Tüm sayfayı Suspense ile sarmalıyoruz (Next.js kuralı)
export default function SalonlarPage(props: any) {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-amber-500 font-heading text-2xl tracking-widest">SİSTEM YÜKLENİYOR...</div>}>
      <SalonlarIcerik />
    </Suspense>
  );
}