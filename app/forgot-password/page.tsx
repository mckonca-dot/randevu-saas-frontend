"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, ArrowRight, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 1. ADIM: Kod Gönderme
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("https://planin.onrender.com/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Kod Gönderildi!',
          text: 'E-posta adresinize 6 haneli sıfırlama kodu gönderildi.',
          background: '#171717', color: '#fff', confirmButtonColor: '#f59e0b'
        });
        setStep(2); // 2. adıma geç
      } else {
        const data = await res.json();
        Swal.fire({ icon: 'error', title: 'Hata!', text: data.message || "Kullanıcı bulunamadı.", background: '#171717', color: '#fff' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Bağlantı Hatası!', background: '#171717', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  // 2. ADIM: Şifreyi Sıfırlama
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword) return;

    setLoading(true);
    try {
      const res = await fetch("https://planin.onrender.com/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Şifreniz Yenilendi!',
          text: 'Artık yeni şifrenizle giriş yapabilirsiniz.',
          background: '#171717', color: '#fff', confirmButtonColor: '#10b981'
        }).then(() => {
          router.push("/login");
        });
      } else {
        const data = await res.json();
        Swal.fire({ icon: 'error', title: 'Hata!', text: data.message || "Geçersiz veya süresi dolmuş kod.", background: '#171717', color: '#fff' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Bağlantı Hatası!', background: '#171717', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-black">
      
      <div className="w-full max-w-md bg-[#171717] rounded-3xl border border-zinc-800 p-8 shadow-2xl relative overflow-hidden">
        {/* Arka plan dekoru */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
            <ShieldCheck size={32} className="text-amber-500" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white text-center uppercase tracking-wider mb-2">
          {step === 1 ? "ŞİFRENİZİ Mİ UNUTTUNUZ?" : "YENİ ŞİFRE BELİRLE"}
        </h2>
        <p className="text-gray-500 text-sm text-center mb-8">
          {step === 1 
            ? "E-posta adresinizi girin, size 6 haneli bir doğrulama kodu gönderelim." 
            : "E-postanıza gelen kodu ve yeni şifrenizi girin."}
        </p>

        {step === 1 ? (
          /* --- ADIM 1: E-POSTA GİRİŞİ --- */
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 tracking-widest">E-POSTA ADRESİ</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition"
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-black font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-yellow-400 transition shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50"
            >
              {loading ? "GÖNDERİLİYOR..." : "KOD GÖNDER"} <ArrowRight size={20} />
            </button>
          </form>
        ) : (
          /* --- ADIM 2: KOD VE YENİ ŞİFRE GİRİŞİ --- */
          <form onSubmit={handleResetPassword} className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 tracking-widest">6 HANELİ KOD</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Sadece rakam
                  className="w-full bg-[#0a0a0a] border border-zinc-800 text-amber-500 font-bold tracking-[0.5em] text-center rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition"
                  placeholder="000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 tracking-widest">YENİ ŞİFRE</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition"
                  placeholder="Yeni şifrenizi belirleyin"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-green-400 transition shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              {loading ? "GÜNCELLENİYOR..." : "ŞİFREYİ YENİLE"} <ShieldCheck size={20} />
            </button>

            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-500 hover:text-white transition">
              Farklı bir e-posta dene
            </button>
          </form>
        )}
      </div>

      <Link href="/login" className="mt-8 flex items-center gap-2 text-gray-500 hover:text-amber-500 transition font-bold text-sm">
        <ArrowLeft size={16} /> Giriş Ekranına Dön
      </Link>
    </div>
  );
}