"use client";

import { CheckCircle2, Scissors, CalendarCheck, Users, Bell, ArrowRight, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BusinessLandingPage() {
  const router = useRouter();
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
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Planın Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white">PLANIN</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/" className="text-gray-300 hover:text-amber-500 font-bold px-2 py-2 transition text-sm hidden md:block">ANA SAYFA</Link>
            <Link href="/login" className="text-gray-300 hover:text-amber-500 font-bold px-2 py-2 transition text-sm">GİRİŞ YAP</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight relative z-10">
          İŞLETMENİ <br />
          <span className="text-amber-500">DİJİTALE TAŞI</span>
        </h1>
        
        {/* 🎯 KATEGORİ VURGUSU (YENİ) */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 opacity-60 text-xs font-heading font-bold tracking-widest text-gray-400 relative z-10">
            <span>BERBER</span> • <span>KUAFÖR</span> • <span>GÜZELLİK MERKEZİ</span> • <span>TIRNAK</span> • <span>SPA</span>
        </div>

        <p className="text-gray-400 text-lg md:text-xl mb-10 font-body max-w-2xl mx-auto relative z-10">
          Planın ile müşterilerini yönet, randevularını otomatikleştir ve gelirini artır. Defteri kalemi bırakma vakti geldi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Link href="/register" className="bg-amber-500 text-black px-8 py-4 rounded-xl font-bold font-heading hover:bg-yellow-400 transition flex items-center justify-center gap-2">
            HEMEN KAYIT OL <ArrowRight size={20}/>
          </Link>
          <a href="#pricing" className="border border-zinc-700 px-8 py-4 rounded-xl text-white hover:border-amber-500 transition font-bold font-heading">
            PAKETLERİ İNCELE
          </a>
        </div>
      </section>

      {/* --- ÖZELLİKLER --- */}
      <section className="py-20 bg-[#111] border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12">NELER SUNUYORUZ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#171717] rounded-3xl border border-zinc-800">
              <CalendarCheck className="text-amber-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold mb-3 font-heading">Akıllı Takvim</h3>
              <p className="text-gray-400 font-body text-sm">Tüm randevularını, personellerinin çalışma saatlerini tek bir ekrandan pürüzsüzce yönet.</p>
            </div>
            <div className="p-8 bg-[#171717] rounded-3xl border border-zinc-800">
              <Users className="text-amber-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold mb-3 font-heading">Müşteri Veritabanı</h3>
              <p className="text-gray-400 font-body text-sm">Müşterilerini kaydet, daha önce hangi işlemleri yaptırdıklarını ve notlarını tut.</p>
            </div>
            <div className="p-8 bg-[#171717] rounded-3xl border border-zinc-800">
              <LayoutGrid className="text-amber-500 mx-auto mb-4" size={48} /> {/* 🎯 Icon kategorileme için güncellendi */}
              <h3 className="text-xl font-bold mb-3 font-heading">Sektörel Çözümler</h3>
              <p className="text-gray-400 font-body text-sm">Berber, kuaför veya güzellik merkezi fark etmeksizin sektörünüze özel ayarlar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- NASIL ÇALIŞIR --- */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12">NASIL ÇALIŞIR?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="text-6xl font-black text-zinc-800 absolute -top-4 left-1/2 -translate-x-1/2 z-0">01</div>
              <h3 className="font-bold mb-2 text-xl relative z-10 mt-6 text-amber-500 font-heading">Kayıt Ol & Kategorini Seç</h3>
              <p className="text-gray-400 font-body text-sm relative z-10">Sadece 2 dakikada hesabını oluştur, işletme kategorini belirle ve panelini aktif et.</p>
            </div>
            {/* ... Diğer adımlar aynı ... */}
            <div className="relative">
              <div className="text-6xl font-black text-zinc-800 absolute -top-4 left-1/2 -translate-x-1/2 z-0">02</div>
              <h3 className="font-bold mb-2 text-xl relative z-10 mt-6 text-amber-500 font-heading">Profilini Düzenle</h3>
              <p className="text-gray-400 font-body text-sm relative z-10">Çalışanlarını, hizmetlerini ve fiyatlarını kolayca panele ekle.</p>
            </div>
            <div className="relative">
              <div className="text-6xl font-black text-zinc-800 absolute -top-4 left-1/2 -translate-x-1/2 z-0">03</div>
              <h3 className="font-bold mb-2 text-xl relative z-10 mt-6 text-amber-500 font-heading">Kazanmaya Başla</h3>
              <p className="text-gray-400 font-body text-sm relative z-10">Sitenin linkini müşterilerinle paylaş, gece gündüz randevu al.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ... Fiyatlandırma ve Footer kısımları orijinal haliyle devam ediyor ... */}
      <footer className="relative bg-[#050505] overflow-hidden">
        {/* ... Orijinal Footer kodun ... */}
        <div className="max-w-7xl mx-auto px-4 py-12 text-center border-t border-zinc-800">
            <p className="text-xs text-gray-600 font-body">© {new Date().getFullYear()} Planın. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}