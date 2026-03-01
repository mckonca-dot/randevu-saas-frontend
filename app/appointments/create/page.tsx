"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAppointmentPage() {
  const router = useRouter();
  
  // Başlangıç değerlerini boş dizi [] olarak veriyoruz ki .map hatası almayalım
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Müşterileri Çek
        const custRes = await fetch("https://konca-saas-backend.onrender.com/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (custRes.ok) {
           const custData = await custRes.json();
           // Gelen verinin Dizi (Array) olup olmadığını kontrol et
           if (Array.isArray(custData)) {
             setCustomers(custData);
           } else {
             console.error("Müşteri verisi dizi değil:", custData);
             setCustomers([]); // Hata varsa boş liste yap, çökmesin
           }
        }

        // Hizmetleri Çek
        const servRes = await fetch("https://konca-saas-backend.onrender.com/services", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (servRes.ok) {
          const servData = await servRes.json();
          if (Array.isArray(servData)) {
            setServices(servData);
          } else {
             setServices([]);
          }
        }

      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://konca-saas-backend.onrender.com/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: Number(customerId),
          serviceId: Number(serviceId),
          dateTime: new Date(date).toISOString(),
        }),
      });

      // --- DEĞİŞİKLİK BURADA BAŞLIYOR ---
      if (!res.ok) {
        // Backend'den gelen hata mesajını oku
        const errorData = await res.json();
        throw new Error(errorData.message || "Randevu oluşturulamadı");
      }
      // ----------------------------------

      alert("Randevu Başarıyla Oluşturuldu!");
      router.push("/dashboard");
      
    } catch (error: any) { // 'any' ekledik ki error.message'a kızmasın
      // Backend'den gelen mesajı alert olarak göster
      alert(error.message || "Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">Yeni Randevu Oluştur</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Müşteri Seçimi */}
          <div>
            <label className="block text-sm mb-1">Müşteri Seç</label>
            <select 
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Bir müşteri seçin...</option>
              {/* customers?.map kullanarak dizi yoksa hata vermemesini sağlıyoruz */}
              {customers?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Hizmet Seçimi */}
          <div>
            <label className="block text-sm mb-1">Hizmet Seç</label>
            <select 
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="">Bir hizmet seçin...</option>
              {services?.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.price} TL)</option>
              ))}
            </select>
          </div>
          
          {/* Tarih Seçimi */}
          <div>
            <label className="block text-sm mb-1">Tarih ve Saat</label>
            <input 
              type="datetime-local" 
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition disabled:opacity-50"
          >
            {loading ? "Oluşturuluyor..." : "Randevuyu Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}