"use client";

import { useState } from "react";
import { CreditCard, ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowLeft, Building2, User, MapPin } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CheckoutPage() {
  // 🚀 Şimdilik varsayılan olarak PRO paketi seçili gösteriyoruz.
  // İleride bunu ana sayfadan tıklanan butona göre dinamik yapacağız.
  const [selectedPlan, setSelectedPlan] = useState("PRO");

  const plans: any = {
    BASIC: { name: "Başlangıç", price: 500, features: ["5 Personel", "QR Kod", "Sınırsız Randevu"] },
    PRO: { name: "Profesyonel", price: 800, features: ["10 Personel", "WhatsApp Bildirimleri", "Gelişmiş İstatistikler"] },
    ULTRA: { name: "Ultra VIP", price: 1500, features: ["Sınırsız Personel", "Vitrinde Öne Çıkma", "7/24 Destek"] }
  };

  const plan = plans[selectedPlan];

  // Form State
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    tcNumber: "", // İyzico zorunlu tutar
    city: "",
    address: ""
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // 🚀 BURASI İYZİCO GELDİĞİNDE ÇALIŞACAK
    Swal.fire({
      title: "Hazırlanıyor...",
      text: "Ödeme altyapısı (Iyzico) entegrasyonu bekleniyor.",
      icon: "info",
      confirmButtonColor: "#f59e0b",
      background: "#171717",
      color: "#fff"
    });
  };

  // Kredi Kartı Formatlayıcı (Görsel şölen için)
  const handleCardNumberChange = (e: any) => {
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formattedValue += " ";
      formattedValue += value[i];
    }
    setFormData({ ...formData, cardNumber: formattedValue.substring(0, 19) });
  };

  const handleExpiryChange = (e: any) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setFormData({ ...formData, expiry: value });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ÜST BAR */}
      <nav className="border-b border-zinc-900 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
            <ArrowLeft size={20} /> Panele Dön
          </Link>
          <div className="flex items-center gap-2 text-amber-500 font-bold tracking-widest uppercase">
            <ShieldCheck size={24} /> Güvenli Ödeme Noktası
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* SOL TARAF: ÖDEME FORMU */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Ödeme Bilgileri</h1>
              <p className="text-gray-500">Aboneliğinizi başlatmak için bilgilerinizi güvenle girin.</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-8">
              
              {/* 1. FATURA BİLGİLERİ (İyzico için zorunlu) */}
              <div className="bg-[#0a0a0a] p-6 md:p-8 rounded-3xl border border-zinc-900 shadow-2xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-zinc-900 pb-4">
                  <User className="text-amber-500" size={20}/> Fatura Detayları
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">TC Kimlik Numarası (Zorunlu)</label>
                    <input type="text" maxLength={11} required placeholder="11 Haneli TC Kimlik No" className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition" value={formData.tcNumber} onChange={(e) => setFormData({...formData, tcNumber: e.target.value.replace(/\D/g, "")})} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Şehir</label>
                    <input type="text" required placeholder="Örn: İstanbul" className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Açık Adres</label>
                    <textarea required placeholder="Fatura adresinizi giriniz..." className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition h-24 resize-none" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* 2. KREDİ KARTI BİLGİLERİ */}
              <div className="bg-[#0a0a0a] p-6 md:p-8 rounded-3xl border border-zinc-900 shadow-2xl relative overflow-hidden">
                {/* Şık Arkaplan Efekti */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-zinc-900 pb-4">
                  <CreditCard className="text-amber-500" size={20}/> Kart Bilgileri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Kart Üzerindeki İsim</label>
                    <input type="text" required placeholder="AD SOYAD" className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition uppercase" value={formData.cardName} onChange={(e) => setFormData({...formData, cardName: e.target.value})} />
                  </div>
                  <div className="md:col-span-2 relative">
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Kart Numarası</label>
                    <div className="relative">
                      <input type="text" required placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 pl-12 text-white focus:border-amber-500 outline-none transition font-mono tracking-widest text-lg" value={formData.cardNumber} onChange={handleCardNumberChange} />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Son Kullanma (AA/YY)</label>
                    <input type="text" required placeholder="MM/YY" maxLength={5} className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition font-mono text-center text-lg" value={formData.expiry} onChange={handleExpiryChange} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">CVC / CVV</label>
                    <div className="relative">
                      <input type="text" required placeholder="123" maxLength={3} className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition font-mono text-center text-lg" value={formData.cvc} onChange={(e) => setFormData({...formData, cvc: e.target.value.replace(/\D/g, "")})} />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button type="submit" className="w-full bg-amber-500 text-black font-black text-lg p-5 rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    <Lock size={20} /> {plan.price} ₺ ÖDE VE BAŞLA
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} className="text-green-500"/> 256-bit SSL sertifikası ile %100 güvenli ödeme.
                  </p>
                </div>
              </div>

            </form>
          </div>

          {/* SAĞ TARAF: SİPARİŞ ÖZETİ */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#171717] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-lg font-black uppercase tracking-wider mb-6 border-b border-zinc-800 pb-4">Sipariş Özeti</h3>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-amber-500 font-bold text-sm tracking-widest uppercase mb-1">{plan.name} PAKETİ</p>
                  <p className="text-gray-400 text-xs">1 Aylık Abonelik</p>
                </div>
                <div className="text-2xl font-black">{plan.price} ₺</div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Pakete Dahil Olanlar:</p>
                {plan.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-amber-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Ara Toplam</span>
                  <span>{plan.price} ₺</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>KDV (%20)</span>
                  <span>Dahil</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800">
                  <span className="font-bold">Ödenecek Tutar</span>
                  <span className="text-3xl font-black text-amber-500">{plan.price} ₺</span>
                </div>
              </div>

              {/* GÜVENLİK ROZETLERİ */}
              <div className="mt-8 bg-[#0a0a0a] rounded-2xl p-4 border border-zinc-800 flex flex-col items-center justify-center gap-2">
                <div className="flex gap-4 opacity-50 grayscale">
                  {/* Örnek Kart Logoları (İkon olarak) */}
                  <span className="font-black italic tracking-tighter">VISA</span>
                  <span className="font-black italic tracking-tighter">MasterCard</span>
                  <span className="font-black italic tracking-tighter text-blue-500">iyzico</span>
                </div>
                <p className="text-[10px] text-gray-500 text-center mt-2">
                  Kredi kartı bilgileriniz sistemimizde saklanmaz. Ödeme altyapısı Iyzico tarafından sağlanmaktadır.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}