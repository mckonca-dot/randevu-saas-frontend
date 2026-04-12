"use client";

import { CheckCircle2, Scissors, CalendarCheck, Users, Bell, ArrowRight, LayoutGrid, Star, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BusinessLandingPage() {
  const router = useRouter();
  
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
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Planın Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-[#F8F1E7]">PLANIN</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/" className="text-gray-400 hover:text-[#E8C9B5] font-bold px-2 py-2 transition text-sm hidden md:block">ANA SAYFA</Link>
            <Link href="/login" className="text-gray-400 hover:text-[#E8C9B5] font-bold px-2 py-2 transition text-sm">GİRİŞ YAP</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E8C9B5]/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8C9B5]/10 border border-[#E8C9B5]/20 text-[#E8C9B5] font-bold text-xs mb-8 relative z-10 font-heading tracking-widest">
           SEKTÖRÜNÜN EN İYİSİ OL
        </div>

        <h1 className="text-4xl md:text-7xl font-bold font-heading mb-6 tracking-tight relative z-10">
          SALONUNU <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8C9B5] to-[#F8F1E7]">DİJİTALE TAŞI</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-10 font-body max-w-2xl mx-auto relative z-10">
          Planın ile müşterilerini yönet, randevularını otomatikleştir ve gelirini artır. Defteri kalemi bırakma vakti geldi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Link href="/register" className="bg-[#E8C9B5] text-[#1A1A1D] px-10 py-5 rounded-xl font-bold font-heading text-lg hover:bg-[#D6B49D] transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,201,181,0.3)]">
            HEMEN ÜCRETSİZ DENE <ArrowRight size={20}/>
          </Link>
          <a href="#pricing" className="border border-[#33333A] px-10 py-5 rounded-xl text-[#F8F1E7] hover:border-[#E8C9B5] transition font-bold font-heading text-lg bg-[#1F1F23]/50">
            PAKETLERİ İNCELE
          </a>
        </div>
      </section>

      {/* --- KATEGORİLER (SaaS Çeşitliliği) --- */}
      <section className="py-12 border-y border-[#33333A] bg-[#1F1F23]/30">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-heading font-bold"><Scissors size={20}/> Erkek Kuaförü</div>
                <div className="flex items-center gap-2 font-heading font-bold"><Star size={20}/> Güzellik Merkezi</div>
                <div className="flex items-center gap-2 font-heading font-bold"><LayoutGrid size={20}/> Tırnak Stüdyosu</div>
                <div className="flex items-center gap-2 font-heading font-bold"><Zap size={20}/> Spa & Masaj</div>
            </div>
        </div>
      </section>

      {/* --- ÖZELLİKLER --- */}
      <section className="py-24 bg-[#1F1F23] relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-16">SALON YÖNETİMİNDE <span className="text-[#E8C9B5]">YENİ STANDART</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-[#1A1A1D] rounded-[2rem] border border-[#33333A] hover:border-[#E8C9B5]/30 transition group">
              <CalendarCheck className="text-[#E8C9B5] mx-auto mb-6 group-hover:scale-110 transition-transform" size={56} />
              <h3 className="text-2xl font-bold mb-4 font-heading text-[#F8F1E7]">Akıllı Takvim</h3>
              <p className="text-gray-500 font-body">Tüm randevularını ve personellerinin çalışma saatlerini tek bir ekrandan pürüzsüzce yönet.</p>
            </div>
            <div className="p-10 bg-[#1A1A1D] rounded-[2rem] border border-[#33333A] hover:border-[#E8C9B5]/30 transition group">
              <Users className="text-[#E8C9B5] mx-auto mb-6 group-hover:scale-110 transition-transform" size={56} />
              <h3 className="text-2xl font-bold mb-4 font-heading text-[#F8F1E7]">Müşteri Sadakati</h3>
              <p className="text-gray-500 font-body">Müşteri geçmişini tutun, onlara özel olduklarını hissettirin ve randevu sadakatini artırın.</p>
            </div>
            <div className="p-10 bg-[#1A1A1D] rounded-[2rem] border border-[#33333A] hover:border-[#E8C9B5]/30 transition group">
              <Bell className="text-[#E8C9B5] mx-auto mb-6 group-hover:scale-110 transition-transform" size={56} />
              <h3 className="text-2xl font-bold mb-4 font-heading text-[#F8F1E7]">WhatsApp Bildirim</h3>
              <p className="text-gray-500 font-body">Randevu hatırlatmalarını otomatik gönderin, gelmeyen müşteri oranını %90 azaltın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FİYATLANDIRMA --- */}
      <section id="pricing" className="py-24 bg-[#1A1A1D]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-[#E8C9B5] font-heading tracking-widest mb-2 font-bold">ŞEFFAF FİYATLANDIRMA</h4>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-[#F8F1E7] mb-6">PROFESYONEL PAKETLER</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16 font-body">
            İhtiyacınıza uygun paketi seçin, işletmenizi bugün büyütmeye başlayın. Tüm paketlerde ilk 30 gün ücretsiz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            {/* Basic */}
            <div className="bg-[#1F1F23] border border-[#33333A] rounded-[2.5rem] p-10 hover:border-[#E8C9B5]/50 transition">
              <h3 className="text-xl font-bold font-heading text-[#F8F1E7] mb-4">Başlangıç</h3>
              <div className="mb-8"><span className="text-4xl font-bold text-[#F8F1E7]">500₺</span><span className="text-gray-500">/ay</span></div>
              <ul className="space-y-4 mb-10 text-gray-400 font-body text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#E8C9B5]" size={18} /> 5 Personel Ekleme</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#E8C9B5]" size={18} /> QR Kod Sistemi</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#E8C9B5]" size={18} /> Online Randevu</li>
              </ul>
              <Link href="/register?plan=BASIC" className="block w-full py-4 bg-[#33333A] text-[#F8F1E7] text-center rounded-xl font-bold hover:bg-[#44444D] transition">
                Hemen Başla
              </Link>
            </div>
            
            {/* Profesyonel */}
            <div className="bg-[#1F1F23] border-2 border-[#E8C9B5] rounded-[2.5rem] p-10 transform md:-translate-y-6 shadow-[0_0_40px_rgba(232,201,181,0.1)] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E8C9B5] text-[#1A1A1D] px-6 py-1.5 rounded-full text-xs font-bold font-heading tracking-widest">EN ÇOK TERCİH EDİLEN</div>
              <h3 className="text-xl font-bold font-heading text-[#F8F1E7] mb-4">Profesyonel</h3>
              <div className="mb-8"><span className="text-4xl font-bold text-[#F8F1E7]">800₺</span><span className="text-gray-500">/ay</span></div>
              <ul className="space-y-4 mb-10 text-gray-400 font-body text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#E8C9B5]" size={18} /> 10 Personel Ekleme</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#E8C9B5]" size={18} /> WhatsApp Bildirimleri</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#E8C9B5]" size={18} /> Gelişmiş İstatistikler</li>
              </ul>
              <Link href="/register?plan=PRO" className="block w-full py-4 bg-[#E8C9B5] text-[#1A1A1D] text-center rounded-xl font-bold hover:bg-[#D6B49D] transition shadow-[0_0_20px_rgba(232,201,181,0.3)]">
                Ücretsiz Denemeyi Başlat
              </Link>
            </div>

            {/* Ultra */}
            <div className="bg-[#1F1F23] border border-[#33333A] rounded-[2.5rem] p-10 hover:border-[#E8C9B5]/50 transition">
              <h3 className="text-xl font-bold font-heading text-[#F8F1E7] mb-4">Ultra VIP</h3>
              <div className="mb-8"><span className="text-4xl font-bold text-[#F8F1E7]">1500₺</span><span className="text-gray-500">/ay</span></div>
              <ul className="space-y-4 mb-10 text-gray-400 font-body text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#E8C9B5]" size={18} /> Sınırsız Personel</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#E8C9B5]" size={18} /> Arama Sonuçlarında Üstte</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#E8C9B5]" size={18} /> Özel Müşteri Temsilcisi</li>
              </ul>
              <Link href="/register?plan=ULTRA" className="block w-full py-4 bg-[#33333A] text-[#F8F1E7] text-center rounded-xl font-bold hover:bg-[#44444D] transition">
                Hemen Başla
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1A1A1D] border-t border-[#33333A] py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              <span className="font-heading text-2xl font-bold tracking-widest">PLANIN</span>
            </div>
            <p className="text-gray-500 font-body max-w-sm mx-auto md:mx-0">
              Muhammet Konca tarafından modern salon yönetimi için Düzce'de geliştirildi.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-6 text-[#E8C9B5]">HIZLI LİNKLER</h4>
            <ul className="space-y-3 text-sm text-gray-500 font-body">
              <li><Link href="/" className="hover:text-[#E8C9B5]">Ana Sayfa</Link></li>
              <li><Link href="/register" className="hover:text-[#E8C9B5]">Kayıt Ol</Link></li>
              <li><Link href="/login" className="hover:text-[#E8C9B5]">İşletme Girişi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-6 text-[#E8C9B5]">DESTEK</h4>
            <ul className="space-y-3 text-sm text-gray-500 font-body">
              <li><Link href="/legal" className="hover:text-[#E8C9B5]">Gizlilik Politikası</Link></li>
              <li><Link href="/legal" className="hover:text-[#E8C9B5]">Kullanım Şartları</Link></li>
              <li><Link href="/destek" className="hover:text-[#E8C9B5]">İletişim</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-[#33333A] text-center text-xs text-gray-600 font-body">
          © {new Date().getFullYear()} Planın. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}