"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// 🚀 SWEETALERT2 EKLENDİ
import Swal from 'sweetalert2';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // DİKKAT: Burayı /auth/signin olarak güncelledik
      const res = await fetch("https://konca-saas-backend.onrender.com/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Giriş başarısız");
      }

      // Token'ı kaydet
      localStorage.setItem("token", data.access_token);
      const intendedPlan = localStorage.getItem("intendedPlan");
          if (intendedPlan) {
            localStorage.removeItem("intendedPlan"); // Hafızayı temizle
            router.push(`/checkout?plan=${intendedPlan}`); // Kasaya geri yolla
          } else {
            router.push("/dashboard"); // Normal girişse panele yolla
          }
      
      // 🚀 SWEETALERT İLE ŞIK BAŞARI MESAJI
      Swal.fire({
        icon: 'success',
        title: 'Hoş Geldiniz!',
        text: 'Giriş başarılı, panele yönlendiriliyorsunuz... 🚀',
        showConfirmButton: false, // Butonu gizleyip otomatik kapanmasını sağlıyoruz
        timer: 1500, // 1.5 saniye sonra kapanır
        background: '#1f2937', // Panelin arka plan rengi
        color: '#fff'
      }).then(() => {
        // Uyarı kapandıktan sonra Dashboard'a yönlendir
        router.push("/dashboard");
      });

    } catch (error: any) {
      // 🚀 SWEETALERT İLE ŞIK HATA MESAJI
      Swal.fire({
        icon: 'error',
        title: 'Giriş Başarısız!',
        text: error.message === 'Credentials incorrect' ? 'E-posta veya şifre hatalı.' : error.message,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Tekrar Dene',
        background: '#1f2937',
        color: '#fff'
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Giriş Yap</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">E-posta</label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Şifre</label>
            <input
              type="password"
              placeholder="******"
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {/* 🚀 ŞİFREMİ UNUTTUM LİNKİ BURAYA EKLENDİ */}
          <div className="flex justify-end mt-2">
            <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-amber-500 transition font-bold">
              Şifremi Unuttum
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition shadow-lg mt-4"
          >
            Giriş Yap
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4 text-sm">
          Hesabın yok mu? <a href="/register" className="text-blue-400 hover:underline">Kayıt Ol</a>
        </p>
      </div>
    </div>
  );
}