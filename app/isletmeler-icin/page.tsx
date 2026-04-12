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

      <nav className="fixed w-full z-50 top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Planın Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300" />
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white">PLANIN</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/" className="text-gray-300 hover:text-amber-500 font-bold px-2 py-2 transition text-sm hidden md:block">ANA SAYFA</Link>
            <Link href="/login" className="text-gray-300 hover:text-amber-500 font-bold px-2 py-2 transition text-sm">GİRİŞ YAP</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight relative z-10">
          İŞLETMENİ <br />
          <span className="text-amber-500">DİJİTALE TAŞI</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10 font-body max-w-2xl mx-auto relative z-10">
          Planın ile müşterilerini yönet, randevularını otomatikleştir ve gelirini artır.
        </p>
        
        {/* 🎯 KATEGORİ VURGUSU (TASARIM BOZULMADAN EKLENDİ) */}
        <div className="flex justify-center gap-6 mb-10 text-xs font-heading font-bold text-gray-500 tracking-widest opacity-60">
            <span>BERBER</span> • <span>KUAFÖR</span> • <span>GÜZELLİK MERKEZİ</span> • <span>SPA</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Link href="/register" className="bg-amber-500 text-black px-8 py-4 rounded-xl font-bold font-heading hover:bg-yellow-400 transition flex items-center justify-center gap-2">
            HEMEN KAYIT OL <ArrowRight size={20}/>
          </Link>
          <a href="#pricing" className="border border-zinc-700 px-8 py-4 rounded-xl text-white hover:border-amber-500 transition font-bold font-heading">
            PAKETLERİ İNCELE
          </a>
        </div>
      </section>

      {/* --- Diğer Özellikler ve Fiyatlandırma Bölümleri Aynı Kalmıştır --- */}
      <footer className="bg-[#050505] py-12 border-t border-zinc-800 text-center">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} Planın.</p>
      </footer>
    </div>
  );
}