"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCustomerPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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
      // Backend'e Müşteri Ekleme İsteği (Port 3000)
      const res = await fetch("https://planin.onrender.com/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, email }),
      });

      if (!res.ok) throw new Error("Müşteri eklenemedi");

      alert("Müşteri Başarıyla Eklendi!");
      router.push("/dashboard"); 
      
    } catch (error) {
      alert("Hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-purple-500">Yeni Müşteri Ekle</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Ad Soyad</label>
            <input 
              type="text" required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 outline-none"
              placeholder="Örn: Ayşe Yılmaz"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Telefon</label>
            <input 
              type="text" required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 outline-none"
              placeholder="0555..."
              value={phone} onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">E-Posta</label>
            <input 
              type="email" required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 outline-none"
              placeholder="ayse@mail.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded font-bold transition disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}