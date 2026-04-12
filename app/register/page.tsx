"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Crown, Mail, ArrowLeft, LayoutGrid } from "lucide-react";
import Swal from 'sweetalert2';
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  
  // 🚀 AŞAMA YÖNETİMİ (1: Plan Seçimi, 2: Bilgiler, 3: Kod Doğrulama)
  const [step, setStep] = useState(1);
  
  // Form Verileri
  const [plan, setPlan] = useState("");
  const [shopName, setShopName] = useState("");
  const [category, setCategory] = useState(""); // 🎯 YENİ: Kategori State'i
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  // 1. AŞAMA: PLANI SEÇ VE İLERLE
  const handleSelectPlan = (selectedPlan: string) => {
    setPlan(selectedPlan);
    setStep(2);
  };

  // 2. AŞAMA: BİLGİLERİ GİR VE MAİL GÖNDER
  const handleRegisterInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kategori seçilmediyse uyaralım
    if (!category) {
      Swal.fire({
        icon: 'warning',
        title: 'Kategori Seçin!',
        text: 'Lütfen işletme türünüzü seçiniz.',
        confirmButtonColor: '#E8C9B5',
        background: '#1A1A1D',
        color: '#F8F1E7'
      });
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("https://planin.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🎯 Kategori verisini de backend'e gönderiyoruz
        body: JSON.stringify({ email, password, shopName, plan, category }),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'info',
          title: 'Kod Gönderildi!',
          text: 'E-posta adresinize 6 haneli bir doğrulama kodu gönderdik.',
          confirmButtonColor: '#E8C9B5',
          background: '#1A1A1D',
          color: '#F8F1E7'
        });
        setStep(3);
      } else {
        const errorData = await res.json().catch(() => ({}));
        Swal.fire({
          icon: 'error',
          title: 'Kayıt Başarısız!',
          text: errorData.message || 'Bir hata oluştu.',
          confirmButtonColor: '#ef4444',
          background: '#1A1A1D',
          color: '#F8F1E7'
        });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Bağlantı Hatası!', text: 'Sunucuya ulaşılamadı.', confirmButtonColor: '#ef4444', background: '#1A1A1D', color: '#F8F1E7' });
    } finally {
      setLoading(false);
    }
  };

  // 3. AŞAMA: OTP DOĞRULAMA
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://planin.onrender.com/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        const intendedPlan = localStorage.getItem("intendedPlan");
        
        Swal.fire({
          icon: 'success',
          title: 'Hoş Geldiniz!',
          text: 'Hesabınız onaylandı! Yönetim paneline yönlendiriliyorsunuz. 🚀',
          showConfirmButton: false, 
          timer: 2000, 
          background: '#1A1A1D', 
          color: '#F8F1E7'
        }).then(() => {
          if (intendedPlan) {
            localStorage.removeItem("intendedPlan");
            router.push(`/checkout?plan=${intendedPlan}`);
          } else {
            router.push("/dashboard");
          }
        });
      } else {
        Swal.fire({
          icon: 'error', title: 'Hatalı Kod!',
          text: data.message || 'Kod hatalı veya süresi dolmuş.',
          confirmButtonColor: '#ef4444', background: '#1A1A1D', color: '#F8F1E7'
        });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Bağlantı Hatası!', text: 'Sunucuya ulaşılamadı.', confirmButtonColor: '#ef4444', background: '#1A1A1D', color: '#F8F1E7' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1A1D] p-4 selection:bg-[#E8C9B5] selection:text-[#1A1A1D]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@300;400;600&display=swap');
        .font-heading { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}} />

      <div className="w-full max-w-5xl">
        
        {/* --- AŞAMA 1: PLAN SEÇİMİ --- */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-[#F8F1E7] font-heading tracking-wide mb-3">SİZE UYGUN PLANI SEÇİN</h1>
              <p className="text-gray-400 font-body">Tüm planlarımız 30 gün boyunca tamamen ücretsizdir. Kredi kartı gerekmez.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
              {/* Basic */}
              <div className="bg-[#1F1F23] border border-[#33333A] rounded-3xl p-8 hover:border-[#E8C9B5]/50 transition cursor-pointer flex flex-col" onClick={() => handleSelectPlan('BASIC')}>
                <h3 className="text-xl font-bold font-heading text-[#F8F1E7] mb-2">BAŞLANGIÇ</h3>
                <div className="mb-6"><span className="text-3xl font-bold text-[#F8F1E7]">500₺</span><span className="text-gray-500">/ay</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-[#E8C9B5]" size={16}/> 5 Personele Kadar</li>
                  <li className="flex items-center gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-[#E8C9B5]" size={16}/> Sınırsız Randevu</li>
                </ul>
                <button className="w-full py-3 bg-[#33333A] text-[#F8F1E7] rounded-xl font-bold hover:bg-[#44444D] transition">Bu Planla Başla</button>
              </div>

              {/* Pro */}
              <div className="bg-[#1F1F23] border-2 border-[#E8C9B5] rounded-3xl p-8 transform md:-translate-y-4 shadow-[0_0_30px_rgba(232,201,181,0.15)] cursor-pointer flex flex-col relative" onClick={() => handleSelectPlan('PRO')}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E8C9B5] text-[#1A1A1D] px-4 py-1 rounded-full text-xs font-bold tracking-wider font-heading">ÖNERİLEN</div>
                <h3 className="text-xl font-bold font-heading text-[#F8F1E7] mb-2">PROFESYONEL</h3>
                <div className="mb-6"><span className="text-3xl font-bold text-[#F8F1E7]">800₺</span><span className="text-gray-500">/ay</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-[#E8C9B5]" size={16}/> 10 Personele Kadar</li>
                  <li className="flex items-center gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-[#E8C9B5]" size={16}/> Gelişmiş Galeri ve Notlar</li>
                </ul>
                <button className="w-full py-3 bg-[#E8C9B5] text-[#1A1A1D] rounded-xl font-bold hover:bg-[#D6B49D] transition shadow-[0_0_15px_rgba(232,201,181,0.3)]">Bu Planla Başla</button>
              </div>

              {/* Ultra */}
              <div className="bg-[#1F1F23] border border-[#33333A] rounded-3xl p-8 hover:border-[#E8C9B5]/50 transition cursor-pointer flex flex-col" onClick={() => handleSelectPlan('ULTRA')}>
                <h3 className="text-xl font-bold font-heading text-[#F8F1E7] mb-2 flex items-center gap-2"><Crown size={20} className="text-[#E8C9B5]"/> ULTRA VIP</h3>
                <div className="mb-6"><span className="text-3xl font-bold text-[#F8F1E7]">1500₺</span><span className="text-gray-500">/ay</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-[#E8C9B5]" size={16}/> Sınırsız Personel</li>
                  <li className="flex items-center gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-[#E8C9B5]" size={16}/> Vitrinde Öne Çıkma</li>
                </ul>
                <button className="w-full py-3 bg-[#33333A] text-[#F8F1E7] rounded-xl font-bold hover:bg-[#44444D] transition">Bu Planla Başla</button>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/login" className="text-gray-400 hover:text-[#E8C9B5] transition font-body text-sm">Zaten hesabın var mı? Giriş Yap</Link>
            </div>
          </div>
        )}

        {/* --- AŞAMA 2: BİLGİLERİ GİRME --- */}
        {step === 2 && (
          <div className="max-w-md mx-auto bg-[#1F1F23] p-8 rounded-3xl border border-[#33333A] shadow-2xl animate-fade-in-up font-body">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 hover:text-[#E8C9B5] transition mb-6 text-sm">
              <ArrowLeft size={16}/> Plan Seçimine Dön
            </button>
            <h2 className="text-2xl font-bold text-[#F8F1E7] font-heading tracking-wider mb-2">İŞLETME BİLGİLERİ</h2>
            <p className="text-gray-400 text-sm mb-6">Seçilen Plan: <span className="text-[#E8C9B5] font-bold">{plan}</span></p>
            
            <form onSubmit={handleRegisterInfo} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">İşletme Adı</label>
                <input type="text" placeholder="Örn: Konca Kuaför" className="w-full p-3.5 rounded-xl bg-[#1A1A1D] text-[#F8F1E7] border border-[#33333A] focus:border-[#E8C9B5] outline-none transition" value={shopName} onChange={(e) => setShopName(e.target.value)} required />
              </div>

              {/* 🎯 YENİ: Kategori Seçim Kutusu */}
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">İşletme Kategorisi</label>
                <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] focus-within:border-[#E8C9B5] transition overflow-hidden">
                  <LayoutGrid className="absolute left-3.5 text-[#E8C9B5]" size={18} />
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full p-3.5 pl-11 bg-transparent text-[#F8F1E7] outline-none appearance-none cursor-pointer"
                    required
                  >
                    <option value="" className="bg-[#1A1A1D]">Sektörünüzü Seçin</option>
                    <option value="Erkek Kuaförü" className="bg-[#1A1A1D]">Erkek Kuaförü (Berber)</option>
                    <option value="Kadın Kuaförü" className="bg-[#1A1A1D]">Kadın Kuaförü</option>
                    <option value="Güzellik Merkezi" className="bg-[#1A1A1D]">Güzellik Merkezi</option>
                    <option value="Tırnak Stüdyosu" className="bg-[#1A1A1D]">Tırnak Stüdyosu (Nail Art)</option>
                    <option value="Spa & Masaj" className="bg-[#1A1A1D]">Spa & Masaj Salonu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">E-posta</label>
                <input type="email" placeholder="ornek@mail.com" className="w-full p-3.5 rounded-xl bg-[#1A1A1D] text-[#F8F1E7] border border-[#33333A] focus:border-[#E8C9B5] outline-none transition" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Şifre</label>
                <input type="password" placeholder="******" className="w-full p-3.5 rounded-xl bg-[#1A1A1D] text-[#F8F1E7] border border-[#33333A] focus:border-[#E8C9B5] outline-none transition" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-[#E8C9B5] text-[#1A1A1D] font-heading font-bold tracking-wider py-4 rounded-xl hover:bg-[#D6B49D] transition shadow-[0_0_15px_rgba(232,201,181,0.3)] mt-4 disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? "İŞLENİYOR..." : "DEVAM ET"} <ChevronRight size={18}/>
              </button>
            </form>
          </div>
        )}

        {/* --- AŞAMA 3: OTP DOĞRULAMA --- */}
        {step === 3 && (
          <div className="max-w-md mx-auto bg-[#1F1F23] p-8 rounded-3xl border border-[#33333A] shadow-2xl animate-fade-in-up font-body text-center">
            <div className="w-16 h-16 bg-[#E8C9B5]/10 text-[#E8C9B5] rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={32}/>
            </div>
            <h2 className="text-2xl font-bold text-[#F8F1E7] font-heading tracking-wider mb-2">E-POSTA ONAYI</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              <span className="text-[#E8C9B5] font-bold">{email}</span> adresine 6 haneli bir doğrulama kodu gönderdik.
            </p>
            
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="000000" 
                  className="w-full p-4 rounded-xl bg-[#1A1A1D] text-[#E8C9B5] font-heading text-3xl text-center tracking-[1em] border border-[#33333A] focus:border-[#E8C9B5] outline-none transition" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  required 
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-[#E8C9B5] text-[#1A1A1D] font-heading font-bold tracking-wider py-4 rounded-xl hover:bg-[#D6B49D] transition shadow-[0_0_15px_rgba(232,201,181,0.3)] disabled:opacity-50">
                {loading ? "KONTROL EDİLİYOR..." : "HESABI ONAYLA"}
              </button>
            </form>
            <button onClick={() => setStep(2)} className="mt-6 text-gray-500 hover:text-white transition text-xs">Yanlış e-posta mı girdiniz? Geri dönün.</button>
          </div>
        )}

      </div>
    </div>
  );
}