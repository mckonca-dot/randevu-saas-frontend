"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles, Map, ChevronRight, Scissors, Clock, ShieldCheck, Smartphone, Star, Zap, Users } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/config"; // Eğer config dosyan yoksa burayı 'https://konca-saas-backend.onrender.com' yapabilirsin

export default function Home() {
  const router = useRouter();
  
  const [shops, setShops] = useState<any[]>([]);
  const [turkeyData, setTurkeyData] = useState<any[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Arkaplanda sadece şehir/hizmet listesini doldurmak için vitrin datası çekiyoruz
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

  // 🚀 ARAMA YAP VE YENİ SAYFAYA YÖNLENDİR!
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.append("city", selectedCity);
    if (selectedDistrict) params.append("district", selectedDistrict);
    if (selectedService) params.append("service", selectedService);
    if (searchQuery) params.append("q", searchQuery);
    
    // Yönlendirme işlemi
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

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            {/* SEO İyileştirmesi: Logo Alt Etiketi */}
            <img 
              src="/logo.png" 
              alt="Planın - Kuaför ve Berber Randevu Sistemi Logosu" 
              title="Planın Randevu Sistemi"
              className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            {/* Planın Yazısı */}
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

      {/* --- HERO & ARAMA MOTORU SECTION --- */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-sm mb-6">
             <Sparkles size={16}/> Türkiye'nin Yeni Nesil Randevu Sistemi
          </div>
          
          {/* SEO İyileştirmesi: H1 Başlığına Anahtar Kelimeler Eklendi */}
          <h1 className="text-4xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
            ŞEHRİNDEKİ EN İYİ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">BERBER VE KUAFÖRLERİ KEŞFET</span>
          </h1>
          
          {/* SEO İyileştirmesi: Paragraf Zenginleştirildi */}
          <p className="text-gray-400 text-base md:text-xl mb-12 font-body max-w-2xl mx-auto">
            Sıra beklemeden, tarzına en uygun berber, kuaför veya güzellik salonunu bul ve saniyeler içinde online randevunu al.
          </p>

          {/* ARAMA KUTUSU */}
          <div className="bg-[#171717] p-3 rounded-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] max-w-6xl mx-auto text-left">
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14 focus-within:border-amber-500 transition">
              <MapPin className="text-amber-500 flex-shrink-0" size={20} aria-hidden="true" />
              {/* SEO İyileştirmesi: aria-label Eklendi */}
              <select aria-label="İl seçiniz" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(""); }} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-zinc-900">Tüm Türkiye</option>
                {turkeyData.map(city => <option key={city.id} value={city.name} className="bg-zinc-900">{city.name}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14 focus-within:border-amber-500 transition">
              <Map className="text-amber-500 flex-shrink-0" size={20} aria-hidden="true" />
              {/* SEO İyileştirmesi: aria-label Eklendi */}
              <select aria-label="İlçe seçiniz" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className={`w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer ${(!selectedCity || availableDistricts.length === 0) ? "opacity-50" : ""}`} disabled={!selectedCity || availableDistricts.length === 0}>
                <option value="" className="bg-zinc-900">{selectedCity ? "Tüm İlçeler" : "Önce İl Seçin"}</option>
                {availableDistricts.map(district => <option key={district} value={district} className="bg-zinc-900">{district}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14 focus-within:border-amber-500 transition">
              <Scissors className="text-amber-500 flex-shrink-0" size={20} aria-hidden="true" />
              {/* SEO İyileştirmesi: aria-label Eklendi */}
              <select aria-label="Hizmet türü seçiniz (Örn: Saç Kesimi)" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full bg-transparent text-white outline-none pl-3 appearance-none cursor-pointer">
                <option value="" className="bg-zinc-900">Tüm Hizmetler</option>
                {uniqueServices.map((service, idx) => <option key={idx} value={service as string} className="bg-zinc-900">{service as string}</option>)}
              </select>
            </div>
            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 px-4 py-3 h-14 focus-within:border-amber-500 transition">
              <Search className="text-amber-500 flex-shrink-0" size={20} aria-hidden="true" />
              {/* SEO İyileştirmesi: aria-label Eklendi */}
              <input type="text" aria-label="Kuaför veya berber adı arayın" placeholder="Salon adı ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent text-white outline-none pl-3 placeholder-gray-500" />
            </div>
            <button 
              aria-label="Kuaför ve Berberleri Keşfet"
              onClick={handleSearch}
              className="bg-amber-500 text-black px-8 rounded-xl font-heading font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 h-14 md:col-span-2 lg:col-span-1 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              KEŞFET <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="mt-8 flex justify-center gap-4 text-sm text-gray-500 font-bold">
             <span>Öne Çıkan Şehirler:</span>
             <button onClick={() => { setSelectedCity("İstanbul"); handleSearch(); }} className="hover:text-amber-500 transition">İstanbul</button>
             <button onClick={() => { setSelectedCity("Ankara"); handleSearch(); }} className="hover:text-amber-500 transition">Ankara</button>
             <button onClick={() => { setSelectedCity("İzmir"); handleSearch(); }} className="hover:text-amber-500 transition">İzmir</button>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm text-gray-500 font-bold">
             <span>Öne Çıkan Hizmetler:</span>
             <button onClick={() => { setSelectedService("Kadın Kuaförü"); handleSearch(); }} className="hover:text-amber-500 transition">Kadın Kuaförü</button>
             <button onClick={() => { setSelectedService("Erkek Kuaförü"); handleSearch(); }} className="hover:text-amber-500 transition">Erkek Kuaförü (Berber)</button>
             <button onClick={() => { setSelectedService("Güzellik Salonu"); handleSearch(); }} className="hover:text-amber-500 transition">Güzellik Salonu</button>
          </div>
        </div>
      </section>

      {/* --- NASIL ÇALIŞIR & SİSTEM ÖZELLİKLERİ --- */}
      <section className="py-24 bg-[#111] border-y border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-amber-500 font-heading tracking-widest mb-2 font-bold">NEDEN PLANIN?</h4>
            {/* SEO İyileştirmesi: H2 Başlığı Anahtar Kelimelerle Zenginleştirildi */}
            <h2 className="text-3xl md:text-5xl font-bold font-heading">ONLİNE KUAFÖR VE BERBER RANDEVUSUNUN AVANTAJLARI</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0a0a0a] p-10 rounded-3xl border border-zinc-800 hover:border-amber-500/50 transition duration-500 group">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Clock className="text-amber-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4">SIRA BEKLEMEYE SON</h3>
              <p className="text-gray-400 font-body leading-relaxed">Berberde veya kuaförde saatlerce sıra beklemek geçmişte kaldı. İşletmenin boş saatlerini anlık olarak görün ve saniyeler içinde size en uygun zamana randevunuzu ayırtın.</p>
            </div>
            
            <div className="bg-[#0a0a0a] p-10 rounded-3xl border border-zinc-800 hover:border-amber-500/50 transition duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Star size={120}/></div>
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-amber-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4">GERÇEK MÜŞTERİ DENEYİMLERİ</h3>
              <p className="text-gray-400 font-body leading-relaxed">Gideceğiniz salonu önceden tanıyın. Gerçek Google Haritalar entegrasyonu sayesinde berber ve kuaförlerin 5 yıldızlı müşteri yorumlarını, başarı puanlarını karşılaştırın.</p>
            </div>
            
            <div className="bg-[#0a0a0a] p-10 rounded-3xl border border-zinc-800 hover:border-amber-500/50 transition duration-500 group">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Smartphone className="text-amber-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4">7/24 DİJİTAL PLANLAMA</h3>
              <p className="text-gray-400 font-body leading-relaxed">Salon kapalı olsa bile online randevunuzu alın. Gece yarısı aklınıza gelse de telefonunuzdan tek tıkla işlemi tamamlayın. WhatsApp bildirimleriyle unutma derdine son verin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- İŞLETMELER İÇİN CTA --- */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-amber-500 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10">
              {/* SEO İyileştirmesi: H2 Başlığı */}
              <h2 className="text-3xl md:text-5xl font-black font-heading text-black mb-6">BERBER VE KUAFÖR SALONUNUZU DİJİTALE TAŞIYIN</h2>
              <p className="text-black/80 font-bold md:text-xl mb-10 max-w-2xl mx-auto">Müşterilerinize 7/24 randevu imkanı sunun, personelinizi yönetin ve cironuzu artırın. Randevu takip sistemi kurulumu sadece 2 dakika sürer.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link href="/isletmeler-icin" className="bg-black text-white px-8 py-4 rounded-xl font-heading font-bold text-lg hover:bg-zinc-800 transition shadow-2xl flex items-center justify-center gap-2">
                    <Zap size={20}/> SİSTEMİ İNCELE
                 </Link>
                 <Link href="/register" className="bg-transparent border-2 border-black text-black px-8 py-4 rounded-xl font-heading font-bold text-lg hover:bg-black hover:text-white transition flex items-center justify-center gap-2">
                    <Users size={20}/> ÜYE GİRİŞİ
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO İyileştirmesi: Görünmez ama Google için kritik SEO Paragrafı */}
      <section className="bg-[#050505] py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-600 text-xs leading-relaxed font-body">
            Planın, Türkiye'nin her yerinden erkek kuaförü, kadın kuaförü, güzellik merkezi ve berberler için 7/24 online randevu almanızı sağlayan yenilikçi bir platformdur. Gelişmiş kuaför randevu sistemi ve berber yönetim paneli sayesinde işletmeler randevularını kolayca takip ederken, müşteriler sıra beklemeden istedikleri hizmeti alabilirler.
          </p>
        </div>
      </section>

      {/* --- PREMIUM FOOTER --- */}
      <footer className="relative bg-[#050505] overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-12">
            <div className="col-span-2 md:col-span-1">
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
              <p className="text-gray-500 text-sm leading-relaxed mb-6 font-body">
                Türkiye'nin en gelişmiş yeni nesil online kuaför randevu ve salon yönetim sistemi.
              </p>
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


            <div>
              <h4 className="text-white font-bold font-heading tracking-widest mb-5 text-sm">KUAFÖRLER İÇİN</h4>
              <ul className="space-y-3 text-sm font-body">
                <li><Link href="/isletmeler-icin" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">İşletmeni Ekle</Link></li>
                <li><Link href="/login" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Yönetici Girişi</Link></li>
                <li><Link href="/isletmeler-icin#pricing" className="text-gray-500 hover:text-amber-500 transition-colors duration-200">Fiyatlandırma</Link></li>
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

          <div className="border-t border-zinc-800/50 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600 font-body">© {new Date().getFullYear()} Planın. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}