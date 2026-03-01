"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Şifre boşsa değişmeyecek
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) { 
        router.push("/login"); 
        return; 
      }

      // Backend'den mevcut bilgileri çek (Port 3000)
      try {
        const res = await fetch("https://konca-saas-backend.onrender.com/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          setEmail(data.email);
        }
      } catch (err) {
        console.error("Kullanıcı bilgisi çekilemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const body: any = { email };
    // Sadece kutu doluysa şifreyi gönder
    if (password) {
      body.password = password;
    }

    try {
      const res = await fetch("https://konca-saas-backend.onrender.com/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Güncellenemedi");

      alert("Profil Başarıyla Güncellendi!");
      setPassword(""); // Şifre kutusunu temizle
      
    } catch (error) {
      alert("Hata oluştu.");
    }
  };

  if (loading) return <div className="p-10 text-white">Yükleniyor...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-200">Profil Ayarları</h1>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          
          <div>
            <label className="block text-sm mb-1 text-gray-400">E-Posta Adresi</label>
            <input 
              type="email" 
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none text-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Yeni Şifre (İsteğe Bağlı)</label>
            <input 
              type="password" 
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="Değiştirmek istemiyorsanız boş bırakın"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition">
            Bilgileri Güncelle
          </button>

          <button 
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 bg-transparent border border-gray-600 hover:bg-gray-700 rounded font-bold transition text-gray-400"
          >
            İptal - Geri Dön
          </button>
        </form>
      </div>
    </div>
  );
}