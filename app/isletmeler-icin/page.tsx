"use client";

import { CheckCircle2, Scissors, CalendarCheck, Users, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BusinessLandingPage() {
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
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-black">
              <Scissors size={24} />
            </div>
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider">PLANIN <span className="text-amber-500 text-sm">PRO</span></span>
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
          KUAFÖR MÜSÜN? <br />
          <span className="text-amber-500">İŞİNİ DİJİTALE TAŞI</span>
        </h1>
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
              <Bell className="text-amber-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold mb-3 font-heading">Otomatik Hatırlatma</h3>
              <p className="text-gray-400 font-body text-sm">"Randevuyu unuttum" bahanesine son. Müşterilerine randevu öncesi otomatik bildirim gider.</p>
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
              <h3 className="font-bold mb-2 text-xl relative z-10 mt-6 text-amber-500 font-heading">Kayıt Ol</h3>
              <p className="text-gray-400 font-body text-sm relative z-10">Sadece 2 dakikada hesabını oluştur ve işletme panelini aktif et.</p>
            </div>
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

      {/* --- FİYATLANDIRMA --- */}
      <section id="pricing" className="py-20 bg-[#171717] border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-amber-500 font-heading tracking-widest mb-2 font-bold">ŞEFFAF FİYATLANDIRMA</h4>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">PROFESYONEL PAKETLER</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12 font-body text-sm">
            Ödemenizi Shopier güvencesiyle tamamladıktan sonra hesabınız <strong>1-15 dakika içinde</strong> otomatik olarak aktifleştirilecektir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Paket 1 */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-8 hover:border-amber-500/50 transition duration-300">
              <h3 className="text-xl font-bold font-heading text-white mb-4">Başlangıç</h3>
              <div className="mb-6"><span className="text-4xl font-bold text-white">500₺</span><span className="text-gray-500">/ay</span></div>
              <ul className="space-y-4 mb-8 text-sm text-gray-400 font-body">
                <li className="flex items-center gap-2"><CheckCircle2 className="text-amber-500" size={16} /> 5 Personel Ekleme</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="text-amber-500" size={16} /> QR Kod Sistemi</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="text-amber-500" size={16} /> Online Randevu Paneli</li>
              </ul>
              <a href="https://www.shopier.com/randevum/45013825" target="_blank" rel="noopener noreferrer" className="block w-full py-3 px-4 bg-zinc-800 text-white text-center rounded-xl font-bold hover:bg-zinc-700 transition mb-2">
                Hemen Başla
              </a>
            </div>
            
            {/* Paket 2 (Önerilen) */}
            <div className="bg-[#0a0a0a] border-2 border-amber-500 rounded-3xl p-8 transform md:-translate-y-4 shadow-2xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-xs font-bold font-heading">ÖNERİLEN</div>
              <h3 className="text-xl font-bold font-heading text-white mb-4">Profesyonel</h3>
              <div className="mb-6"><span className="text-4xl font-bold text-white">800₺</span><span className="text-gray-500">/ay</span></div>
              <ul className="space-y-4 mb-8 text-sm text-gray-400 font-body">
                <li className="flex items-center gap-2"><CheckCircle2 className="text-amber-500" size={16} /> 10 Personel Ekleme</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="text-amber-500" size={16} /> WhatsApp Bildirimleri</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="text-amber-500" size={16} /> Gelişmiş İstatistikler</li>
              </ul>
              <a href="https://www.shopier.com/randevum/45013838" target="_blank" rel="noopener noreferrer" className="block w-full py-3 px-4 bg-amber-500 text-black text-center rounded-xl font-bold hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-2">
                Hemen Başla
              </a>
            </div>

            {/* Paket 3 */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-8 hover:border-amber-500/50 transition duration-300">
              <h3 className="text-xl font-bold font-heading text-white mb-4">Ultra VIP</h3>
              <div className="mb-6"><span className="text-4xl font-bold text-white">1500₺</span><span className="text-gray-500">/ay</span></div>
              <ul className="space-y-4 mb-8 text-sm text-gray-400 font-body">
                <li className="flex items-center gap-2"><CheckCircle2 className="text-amber-500" size={16} /> Sınırsız Personel</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="text-amber-500" size={16} /> Ana Sayfada Öne Çıkma</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="text-amber-500" size={16} /> Öncelikli 7/24 Destek</li>
              </ul>
              <a href="https://www.shopier.com/randevum/45013858" target="_blank" rel="noopener noreferrer" className="block w-full py-3 px-4 bg-zinc-800 text-white text-center rounded-xl font-bold hover:bg-zinc-700 transition mb-2">
                Hemen Başla
              </a>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto mt-12 bg-[#121212] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between flex-col md:flex-row gap-4 text-left text-sm text-gray-400 font-body">
            🔒 Ödemeleriniz <strong className="text-white">Shopier</strong> altyapısı ile 256-bit SSL güvencesi altındadır.
          </div>
        </div>
      </section>

      {/* --- BASİT FOOTER --- */}
      <footer className="bg-[#050505] py-10 border-t border-zinc-900 text-center">
        <p className="text-gray-600 text-sm font-body">
          © {new Date().getFullYear()} Planın Pro. Türkiye'nin Kuaför Yönetim Sistemi.
        </p>
      </footer>
    </div>
  );
}