"use client";

import { useState, useEffect, Suspense } from "react";
import { ShoppingBag, ShieldCheck, CheckCircle2, User, MapPin, ArrowLeft, Phone, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planQuery = searchParams.get("plan");

  const [selectedPlan, setSelectedPlan] = useState("PRO");
  const [user, setUser] = useState<any>(null);

  const plans: any = {
    BASIC: { name: "Başlangıç", price: 500, features: ["5 Personel", "QR Kod Sistemi", "Sınırsız Randevu"] },
    PRO: { name: "Profesyonel", price: 800, features: ["10 Personel", "WhatsApp Bildirimleri", "Gelişmiş İstatistikler"] },
    ULTRA: { name: "Ultra VIP", price: 1500, features: ["Sınırsız Personel", "Vitrinde Öne Çıkma", "7/24 Öncelikli Destek"] }
  };

  useEffect(() => {
    if (planQuery && (planQuery === "BASIC" || planQuery === "PRO" || planQuery === "ULTRA")) {
      setSelectedPlan(planQuery);
    }
  }, [planQuery]);

  // Giriş kontrolü ve Kullanıcı Bilgilerini çekme
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("intendedPlan", planQuery || "PRO");
      Swal.fire({
        title: "Kayıt Gerekli!",
        text: "Ödeme yapabilmek için önce dükkan hesabınızı oluşturmalısınız.",
        icon: "info",
        confirmButtonText: "Kayıt Ol",
        confirmButtonColor: "#f59e0b",
        background: "#171717",
        color: "#fff",
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/register");
        }
      });
    } else {
      // Backend'den kullanıcı bilgilerini çekip forma otomatik dolduralım
      fetch("https://konca-saas-backend.onrender.com/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setFormData(prev => ({
          ...prev,
          firstName: data.shopName?.split(" ")[0] || "",
          lastName: data.shopName?.split(" ").slice(1).join(" ") || "Kuaför",
          phone: data.phone || "",
          email: data.email || "",
          city: data.city || "",
          address: data.fullAddress || ""
        }));
      });
    }
  }, [router, planQuery]);

  const plan = plans[selectedPlan];

  // Shopier İçin Gerekli Form State (Kredi kartı yok!)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    address: ""
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🚀 BURASI SHOPIER BACKEND ENTEGRASYONU GELDİĞİNDE TETİKLENECEK
    Swal.fire({
      title: "Shopier'e Yönlendiriliyorsunuz...",
      text: "Güvenli ödeme sayfasına aktarılıyorsunuz, lütfen bekleyin.",
      icon: "info",
      showConfirmButton: false,
      background: "#171717",
      color: "#fff",
      timer: 2000
    });

    // TODO: Backend'e istek atılacak. Backend Shopier'in HTML formunu dönecek
    // ve biz de o formu ekrana basıp otomatik submit edeceğiz (Shopier mantığı böyledir).
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-black">
      <nav className="border-b border-zinc-900 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2 transition">
            <ArrowLeft size={20} /> Geri Dön
          </button>
          <div className="flex items-center gap-2 text-amber-500 font-bold tracking-widest uppercase text-sm md:text-base">
            <ShieldCheck size={24} /> Güvenli Ödeme
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Abonelik Başlat</h1>
              <p className="text-gray-500">Shopier güvencesiyle hızlı ve şirket gerektirmeyen ödeme noktası.</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-8">
              {/* ALICI BİLGİLERİ (Shopier Zorunlu Tutar) */}
              <div className="bg-[#0a0a0a] p-6 md:p-8 rounded-3xl border border-zinc-900 shadow-2xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-zinc-900 pb-4">
                  <User className="text-amber-500" size={20}/> Alıcı Bilgileri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Adınız</label>
                    <input type="text" required placeholder="Adınız" className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Soyadınız</label>
                    <input type="text" required placeholder="Soyadınız" className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Telefon Numarası</label>
                    <div className="relative">
                      <input type="text" required placeholder="05XX XXX XX XX" className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 pl-12 text-white focus:border-amber-500 outline-none transition" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">E-Posta Adresi</label>
                    <div className="relative">
                      <input type="email" required placeholder="mail@ornek.com" className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 pl-12 text-white focus:border-amber-500 outline-none transition" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 border-t border-zinc-900 pt-6 mt-2">
                    <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2"><MapPin size={16} className="text-amber-500"/> Fatura Adresi</h3>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Şehir</label>
                    <input type="text" required placeholder="Örn: İstanbul" className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-wider">Açık Adres</label>
                    <textarea required placeholder="Mahalle, sokak, no..." className="w-full bg-[#171717] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition h-24 resize-none" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                <div className="mt-8">
                  <button type="submit" className="w-full bg-amber-500 text-black font-black text-lg p-5 rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    <ShoppingBag size={20} /> SHOPIER İLE GÜVENLİ ÖDE ({plan.price} ₺)
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} className="text-green-500"/> Kredi kartı adımına Shopier ekranında geçilecektir.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* SİPARİŞ ÖZETİ */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#171717] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-lg font-black uppercase tracking-wider mb-6 border-b border-zinc-800 pb-4">Sipariş Özeti</h3>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-amber-500 font-bold text-sm tracking-widest uppercase mb-1">{plan.name} PAKETİ</p>
                  <p className="text-gray-400 text-xs">Aylık Abonelik Ücreti</p>
                </div>
                <div className="text-2xl font-black">{plan.price} ₺</div>
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Paket İçeriği:</p>
                {plan.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-amber-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Ödenecek Tutar</span>
                  <span className="text-3xl font-black text-amber-500">{plan.price} ₺</span>
                </div>
              </div>
              <div className="mt-8 bg-[#0a0a0a] rounded-2xl p-4 border border-zinc-800 flex flex-col items-center justify-center gap-2">
                <div className="flex gap-4 opacity-50 grayscale">
                  <span className="font-black italic tracking-tighter">VISA</span>
                  <span className="font-black italic tracking-tighter">MasterCard</span>
                  <span className="font-black italic tracking-tighter text-blue-400">Shopier</span>
                </div>
                <p className="text-[10px] text-gray-500 text-center mt-2">
                  Altyapı Shopier tarafından %100 güvenli sağlanmaktadır. Bireysel satış noktası.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Suspense sarmalayıcısı (Next.js kuralı)
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] text-amber-500 flex items-center justify-center font-bold tracking-widest">KASA HAZIRLANIYOR...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}