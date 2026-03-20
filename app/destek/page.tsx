"use client";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Mail, MapPin, SearchCheck, CalendarCheck, CheckCircle2 } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-amber-500 hover:text-yellow-400 mb-8 font-bold">
          <ArrowLeft size={20} /> Ana Sayfaya Dön
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">Yardım Merkezi</h1>
          <p className="text-xl text-gray-500">Size nasıl yardımcı olabiliriz?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* NASIL ÇALIŞIR */}
          <section id="nasil-calisir" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <SearchCheck size={32} className="text-amber-500" />
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Nasıl Çalışır?</h2>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center shrink-0">1</div>
                <div><h3 className="text-white font-bold text-lg">Salonu Bulun</h3><p className="text-sm text-gray-400">Şehrinizi ve istediğiniz hizmeti seçerek size en uygun kuaförü bulun.</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center shrink-0">2</div>
                <div><h3 className="text-white font-bold text-lg">Saati Seçin</h3><p className="text-sm text-gray-400">İstediğiniz personeli ve boş olan en uygun saati seçerek randevunuzu ayırın.</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center shrink-0">3</div>
                <div><h3 className="text-white font-bold text-lg">Onay Alın</h3><p className="text-sm text-gray-400">WhatsApp üzerinden anında onay mesajınız gelsin ve yeriniz garantilensin.</p></div>
              </div>
            </div>
          </section>

          {/* İLETİŞİM */}
          <section id="iletisim" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <Mail size={32} className="text-amber-500" />
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">İletişim & Destek</h2>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
              <p className="mb-6 text-gray-400">İşletmenizi sisteme eklemek, abonelik paketleri veya yaşadığınız teknik bir sorunla ilgili 7/24 bizimle iletişime geçebilirsiniz.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white"><Mail className="text-amber-500" size={20}/> <b>E-Posta:</b> info@planin.com.tr</div>
                <div className="flex items-center gap-3 text-white"><MapPin className="text-amber-500" size={20}/> <b>Merkez:</b> Düzce / Türkiye</div>
              </div>
              <button onClick={() => window.location.href='mailto:destek@koncasaas.com'} className="mt-8 w-full bg-amber-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition">
                Bize Mail Gönderin
              </button>
            </div>
          </section>
        </div>

        {/* S.S.S. */}
        <section id="sss" className="mt-20 scroll-mt-20 border-t border-zinc-800 pt-16">
          <div className="flex items-center justify-center gap-3 mb-10">
            <HelpCircle size={32} className="text-amber-500" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider text-center">Sıkça Sorulan Sorular</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-amber-500 font-bold mb-2">Müşteriler randevu alırken ücret ödüyor mu?</h3>
              <p className="text-sm text-gray-400">Hayır, platformumuz müşteriler için tamamen ücretsizdir. Ödemenizi işlemi yaptırdıktan sonra doğrudan salona yaparsınız.</p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-amber-500 font-bold mb-2">Kuaför olarak sisteme nasıl dahil olurum?</h3>
              <p className="text-sm text-gray-400">Sağ üstteki "Kayıt Ol" butonuna basarak 1 dakika içinde dükkanınızı açabilir ve size uygun paketi seçerek hemen randevu almaya başlayabilirsiniz.</p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-amber-500 font-bold mb-2">WhatsApp bildirimleri nasıl çalışıyor?</h3>
              <p className="text-sm text-gray-400">Sistem kendi WhatsApp numaranızı bağlamanıza olanak tanır. Müşteri randevu aldığında direkt sizin işletme numaranızdan kurumsal bir onay mesajı gider.</p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-amber-500 font-bold mb-2">Paketimi istediğim zaman iptal edebilir miyim?</h3>
              <p className="text-sm text-gray-400">Evet, Shopier altyapısı kullandığımız için aboneliğinizi hiçbir taahhüt olmadan dilediğiniz ay iptal edebilirsiniz.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}