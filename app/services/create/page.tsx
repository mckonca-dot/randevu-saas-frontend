"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateServicePage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Backend'e Hizmet Ekleme İsteği (Port 3000)
      const res = await fetch("https://konca-saas-backend.onrender.com/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          duration: Number(duration),
          price: Number(price),
        }),
      });

      if (!res.ok) throw new Error("Hizmet eklenemedi");

      alert("Hizmet Başarıyla Eklendi!");
      router.push("/dashboard"); // İş bitince panele dön
      
    } catch (error) {
      alert("Hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-blue-500">Yeni Hizmet Ekle</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Hizmet Adı</label>
            <input 
              type="text" 
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="Örn: Saç Boyama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Süre (Dk)</label>
              <input 
                type="number" 
                required
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm mb-1">Fiyat (TL)</label>
              <input 
                type="number" 
                required
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}