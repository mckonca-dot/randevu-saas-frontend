"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ChevronRight } from "lucide-react";
import Swal from 'sweetalert2';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://planin.onrender.com/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Giriş başarısız");
      }

      // 🎯 BAŞARILI GİRİŞ: Token'ı kaydet
      localStorage.setItem("token", data.access_token);
      
      Swal.fire({
        icon: 'success',
        title: 'Hoş Geldiniz!',
        text: 'Giriş başarılı, yönlendiriliyorsunuz...',
        showConfirmButton: false, 
        timer: 1500, 
        background: '#1A1A1D', 
        color: '#F8F1E7'
      }).then(() => {
        // 🚀 SWEETALERT KAPANDIKTAN SONRA TEK BİR KEZ YÖNLENDİR (Intended Plan Mantığı Korundu)
        const intendedPlan = localStorage.getItem("intendedPlan");
        if (intendedPlan) {
          localStorage.removeItem("intendedPlan"); 
          router.push(`/checkout?plan=${intendedPlan}`); 
        } else {
          router.push("/dashboard"); 
        }
      });

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Giriş Başarısız!',
        text: error.message === 'Credentials incorrect' ? 'E-posta veya şifre hatalı.' : error.message,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Tekrar Dene',
        background: '#1A1A1D',
        color: '#F8F1E7'
      });
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

      <div className="w-full max-w-md bg-[#1F1F23] p-8 rounded-3xl border border-[#33333A] shadow-2xl animate-fade-in-up font-body">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#F8F1E7] font-heading tracking-wide mb-2">GİRİŞ YAP</h1>
          <p className="text-gray-400 text-sm">Yönetim paneline erişmek için bilgilerinizi girin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* E-Posta Alanı */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">E-posta Adresi</label>
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] focus-within:border-[#E8C9B5] transition overflow-hidden">
              <Mail className="absolute left-3.5 text-[#E8C9B5]" size={18} />
              <input 
                type="email" 
                placeholder="ornek@mail.com" 
                className="w-full p-3.5 pl-11 bg-transparent text-[#F8F1E7] outline-none" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Şifre Alanı */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider">Şifre</label>
              <Link href="/forgot-password" className="text-xs text-[#E8C9B5] hover:text-[#D6B49D] transition">Şifremi Unuttum</Link>
            </div>
            <div className="relative flex items-center bg-[#1A1A1D] rounded-xl border border-[#33333A] focus-within:border-[#E8C9B5] transition overflow-hidden">
              <Lock className="absolute left-3.5 text-[#E8C9B5]" size={18} />
              <input 
                type="password" 
                placeholder="******" 
                className="w-full p-3.5 pl-11 bg-transparent text-[#F8F1E7] outline-none" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Giriş Butonu */}
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-[#E8C9B5] text-[#1A1A1D] font-heading font-bold tracking-wider py-4 rounded-xl hover:bg-[#D6B49D] transition shadow-[0_0_15px_rgba(232,201,181,0.3)] mt-6 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"} <ChevronRight size={18}/>
          </button>
        </form>

        {/* Kayıt Ol Yönlendirmesi */}
        <div className="text-center mt-8 pt-6 border-t border-[#33333A]">
          <p className="text-gray-400 text-sm">
            Henüz bir hesabınız yok mu?{' '}
            <Link href="/register" className="text-[#E8C9B5] font-bold hover:underline transition">Kayıt Ol</Link>
          </p>
        </div>

      </div>
    </div>
  );
}