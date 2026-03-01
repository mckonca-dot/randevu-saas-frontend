"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState(""); // <-- YENİ STATE
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("https://konca-saas-backend.onrender.com/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        password,
        shopName // <-- Backend'e gönderiyoruz
      }),
    });

    if (res.ok) {
      alert("Kayıt Başarılı! Giriş yapabilirsiniz.");
      router.push("/login");
    } else {
      alert("Kayıt başarısız. E-posta kullanımda olabilir.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Kayıt Ol</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* İŞLETME ADI GİRİŞİ */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">İşletme Adı</label>
            <input
              type="text"
              placeholder="Örn: Konca Kuaför Salonu"
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">E-posta</label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition shadow-lg"
          >
            Kayıt Ol
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4 text-sm">
          Zaten hesabın var mı? <a href="/login" className="text-blue-400 hover:underline">Giriş Yap</a>
        </p>
      </div>
    </div>
  );
}