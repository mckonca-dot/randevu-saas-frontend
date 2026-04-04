"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles, Map, ChevronRight, Scissors, Clock, ShieldCheck, Smartphone, Star, Zap, Users } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/config"; 

export default function Home() {
  const router = useRouter();
  
  const [shops, setShops] = useState<any[]>([]);
  const [turkeyData, setTurkeyData] = useState<any[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
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
            <img 
              src="/logo.png" 
              alt="Planın - Kuaför ve Güzellik Salonu Randevu Sistemi Logosu" 
              title="Planın Randevu Sistemi"
              className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-[#F8F1E7]">PLANIN</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-gray-400 hover:text-[#E8C9B5] font-bold px-2 py-2 transition text-sm">GİRİŞ YAP</Link>
            <Link href="/isletmeler-icin" className="bg-[#E8C9B5] text-[#1A1A1D] px-5 py-2 rounded-lg font-bold font-heading tracking-wider hover:bg-[#D6B49D] transition shadow-[0_0_15px_rgba(232,201,181,0.2)] text-sm">
              İŞLETMENİ EKLE
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO & ARAMA MOTORU SECTION --- */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Arkadaki parlamayı şampanya rengine uyarladık */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E8C9B5]/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8C9B5]/10 border border-[#E8C9B5]/20 text-[#E8C9B5] font-bold text-sm mb-6">
             <Sparkles size={16}/> Türkiye'nin Premium Randevu Sistemi
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
            ŞEHRİNDEKİ EN İYİ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8C9B5] to-[#FDF3EB]">SALONLARI KEŞFET</span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-xl mb-12 font-body max-w-2xl mx-auto">
            Sıra beklemeden, tarzına en uygun kuaför veya güzellik salonunu bul ve saniyeler içinde online randevunu al.
          </p>

          {/* ARAMA KUTUSU */}
          <div className="bg-[#232328] p-3 rounded-2xl border border-[#33333A] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-6xl mx-auto text-left">
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] px-4 py-3 h-14 focus-within:border-[#E8C9B5] transition">
              <MapPin className="text-[#E8C9B5] flex-shrink-0" size={20} aria-hidden="true" />
              <select aria-label="İl seçiniz" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(""); }} className="w-full bg-transparent text-[#F8F1E7] outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-[#232328]">Tüm Türkiye</option>
                {turkeyData.map(city => <option key={city.id} value={city.name} className="bg-[#232328]">{city.name}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] px-4 py-3 h-14 focus-within:border-[#E8C9B5] transition">
              <Map className="text-[#E8C9B5] flex-shrink-0" size={20} aria-hidden="true" />
              <select aria-label="İlçe seçiniz" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className={`w-full bg-transparent text-[#F8F1E7] outline-none pl-3 appearance-none cursor-pointer ${(!selectedCity || availableDistricts.length === 0) ? "opacity-50" : ""}`} disabled={!selectedCity || availableDistricts.length === 0}>
                <option value="" className="bg-[#232328]">{selectedCity ? "Tüm İlçeler" : "Önce İl Seçin"}</option>
                {availableDistricts.map(district => <option key={district} value={district} className="bg-[#232328]">{district}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] px-4 py-3 h-14 focus-within:border-[#E8C9B5] transition">
              <Scissors className="text-[#E8C9B5] flex-shrink-0" size={20} aria-hidden="true" />
              <select aria-label="Hizmet türü seçiniz (Örn: Saç Kesimi)" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full bg-transparent text-[#F8F1E7] outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-[#232328]">Tüm Hizmetler</option>
                {uniqueServices.map((service, idx) => <option key={idx} value={service as string} className="bg-[#232328]">{service as string}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] px-4 py-3 h-14 focus-within:border-[#E8C9B5] transition">
              <Search className="text-[#E8C9B5] flex-shrink-0" size={20} aria-hidden="true" />
              <input type="text" aria-label="Salon adı arayın" placeholder="Salon adı ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent text-[#F8F1E7] outline-none pl-3 placeholder-gray-500" />
            </div>
            <button 
              aria-label="Salonları Keşfet"
              onClick={handleSearch}
              className="bg-[#E8C9B5] text-[#1A1A1D] px-8 rounded-xl font-heading font-bold text-lg hover:bg-[#D6B49D] transition-all flex items-center justify-center gap-2 h-14 md:col-span-2 lg:col-span-1 shadow-[0_0_15px_rgba(232,201,181,0.3)]"
            >
              KEŞFET <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="mt-8 flex justify-center gap-4 text-sm text-gray-500 font-bold">
             <span>Öne Çıkan Şehirler:</span>
             <button onClick={() => { setSelectedCity("İstanbul"); handleSearch(); }} className="hover:text-[#E8C9B5] transition">İstanbul</button>
             <button onClick={() => { setSelectedCity("Ankara"); handleSearch(); }} className="hover:text-[#E8C9B5] transition">Ankara</button>
             <button onClick={() => { setSelectedCity("İzmir"); handleSearch(); }} className="hover:text-[#E8C9B5] transition">İzmir</button>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm text-gray-500 font-bold">
             <span>Öne Çıkan Hizmetler:</span>
             <button onClick={() => { setSelectedService("Kadın Kuaförü"); handleSearch(); }} className="hover:text-[#E8C9B5] transition">Kadın Kuaförü</button>
             <button onClick={() => { setSelectedService("Erkek Kuaförü"); handleSearch(); }} className="hover:text-[#E8C9B5] transition">Erkek Kuaförü</button>
             <button onClick={() => { setSelectedService("Güzellik Salonu"); handleSearch(); }} className="hover:text-[#E8C9B5] transition">Güzellik Salonu</button>
          </div>
        </div>
      </section>

      {/* --- NASIL ÇALIŞIR & SİSTEM ÖZELLİKLERİ --- */}
      <section className="py-24 bg-[#1F1F23] border-y border-[#33333A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-[#E8C9B5] font-heading tracking-widest mb-2 font-bold">NEDEN PLANIN?</h4>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-[#F8F1E7]">ONLİNE RANDEVUNUN AVANTAJLARI</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1D] p-10 rounded-3xl border border-[#33333A] hover:border-[#E8C9B5]/50 transition duration-500 group">
              <div className="w-16 h-16 bg-[#2A2A30] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Clock className="text-[#E8C9B5]" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-[#F8F1E7]">SIRA BEKLEMEYE SON</h3>
              <p className="text-gray-400 font-body leading-relaxed">Salonda saatlerce sıra beklemek geçmişte kaldı. İşletmenin boş saatlerini anlık olarak görün ve saniyeler içinde size en uygun zamana randevunuzu ayırtın.</p>
            </div>
            
            <div className="bg-[#1A1A1D] p-10 rounded-3xl border border-[#33333A] hover:border-[#E8C9B5]/50 transition duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Star className="text-[#F8F1E7]" size={120}/></div>
              <div className="w-16 h-16 bg-[#2A2A30] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-[#E8C9B5]" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-[#F8F1E7]">GERÇEK MÜŞTERİ DENEYİMLERİ</h3>
              <p className="text-gray-400 font-body leading-relaxed">Gideceğiniz salonu önceden tanıyın. Gerçek müşteri yorumlarını okuyun ve işletmelerin başarı puanlarını karşılaştırarak en iyi hizmeti seçin.</p>
            </div>
            
            <div className="bg-[#1A1A1D] p-10 rounded-3xl border border-[#33333A] hover:border-[#E8C9B5]/50 transition duration-500 group">
              <div className="w-16 h-16 bg-[#2A2A30] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Smartphone className="text-[#E8C9B5]" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-[#F8F1E7]">7/24 DİJİTAL PLANLAMA</h3>
              <p className="text-gray-400 font-body leading-relaxed">Salon kapalı olsa bile online randevunuzu alın. Gece yarısı aklınıza gelse de telefonunuzdan tek tıkla işlemi tamamlayın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- İŞLETMELER İÇİN CTA --- */}
      <section className="py-24 bg-gradient-to-b from-[#1A1A1D] to-[#1F1F23]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-[#E8C9B5] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_0_50px_rgba(232,201,181,0.1)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black font-heading text-[#1A1A1D] mb-6">SALONUNUZU DİJİTALE TAŞIYIN</h2>
              <p className="text-[#1A1A1D]/80 font-bold md:text-xl mb-10 max-w-2xl mx-auto">Müşterilerinize 7/24 randevu imkanı sunun, personelinizi yönetin ve gelirinizi artırın. Kurulum sadece 2 dakika sürer.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link href="/isletmeler-icin" className="bg-[#1A1A1D] text-[#F8F1E7] px-8 py-4 rounded-xl font-heading font-bold text-lg hover:bg-[#2A2A30] transition shadow-2xl flex items-center justify-center gap-2">
                    <Zap size={20} className="text-[#E8C9B5]" /> SİSTEMİ İNCELE
                 </Link>
                 <Link href="/register" className="bg-transparent border-2 border-[#1A1A1D] text-[#1A1A1D] px-8 py-4 rounded-xl font-heading font-bold text-lg hover:bg-[#1A1A1D] hover:text-[#F8F1E7] transition flex items-center justify-center gap-2">
                    <Users size={20}/> ÜYE GİRİŞİ
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO İyileştirmesi */}
      <section className="bg-[#151518] py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-500 text-xs leading-relaxed font-body">
            Planın, Türkiye'nin her yerinden kuaför, güzellik merkezi, tırnak stüdyosu, spa ve berberler için 7/24 online randevu almanızı sağlayan yenilikçi bir platformdur. Gelişmiş randevu sistemi ve salon yönetim paneli sayesinde işletmeler randevularını kolayca takip ederken, müşteriler kusursuz bir bakım deneyimi yaşarlar.
          </p>
        </div>
      </section>

      {/* --- PREMIUM FOOTER --- */}
      <footer className="relative bg-[#151518] overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E8C9B5] to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E8C9B5]/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
                <img 
                  src="/logo.png" 
                  alt="Planın Logo" 
                  className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300" 
                />
                <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-[#F8F1E7]">PLANIN</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 font-body">
                Türkiye'nin en gelişmiş premium online salon randevu ve yönetim sistemi.
              </p>
            </div>

            <div>
              <h4 className="text-[#F8F1E7] font-bold font-heading tracking-widest mb-5 text-sm">MÜŞTERİLER İÇİN</h4>
              <ul className="space-y-3 text-sm font-body">
                <li><button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">Salon Keşfet</button></li>
                <li><Link href="/destek#nasil-calisir" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">Nasıl Çalışır?</Link></li>
                <li><Link href="/destek#sss" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">S.S.S.</Link></li>
                <li><Link href="/destek" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">Yardım Merkezi</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#F8F1E7] font-bold font-heading tracking-widest mb-5 text-sm">İŞLETMELER İÇİN</h4>
              <ul className="space-y-3 text-sm font-body">
                <li><Link href="/isletmeler-icin" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">İşletmeni Ekle</Link></li>
                <li><Link href="/login" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">Yönetici Girişi</Link></li>
                <li><Link href="/isletmeler-icin#pricing" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">Fiyatlandırma</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#F8F1E7] font-bold font-heading tracking-widest mb-5 text-sm">YASAL</h4>
              <ul className="space-y-3 text-sm font-body">
                <li><Link href="/legal#gizlilik" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">Gizlilik Politikası</Link></li>
                <li><Link href="/legal#sartlar" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">Kullanım Şartları</Link></li>
                <li><Link href="/legal#kvkk" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">KVKK Aydınlatma</Link></li>
                <li><Link href="/legal#cerez" className="text-gray-500 hover:text-[#E8C9B5] transition-colors duration-200">Çerez Politikası</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#33333A]/50 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-body">© {new Date().getFullYear()} Planın. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}