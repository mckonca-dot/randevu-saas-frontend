"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Next.js 15+ için params'ı unwrap ediyoruz
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Params'ı çözümle
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 1. Randevu Detayını Çek (Eski verileri görmek için)
        // Not: Backend'de tek bir randevuyu çeken GET endpoint'i yapmadık ama
        // listeyi çekip içinden bulabiliriz (Hızlı çözüm)
        const appRes = await fetch("https://konca-saas-backend.onrender.com/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appData = await appRes.json();
        const currentApp = appData.find((a: any) => a.id === Number(resolvedParams.id));

        if (currentApp) {
          setCustomerId(currentApp.customerId);
          setServiceId(currentApp.serviceId);
          // Tarihi input formatına (YYYY-MM-DDTHH:MM) çevir
          const d = new Date(currentApp.dateTime);
          d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
          setDate(d.toISOString().slice(0, 16));
          setStatus(currentApp.status);
        }

        // 2. Müşteri ve Hizmet Listelerini de Çek
        const custRes = await fetch("https://konca-saas-backend.onrender.com/customers", { headers: { Authorization: `Bearer ${token}` } });
        setCustomers(await custRes.json());

        const servRes = await fetch("https://konca-saas-backend.onrender.com/services", { headers: { Authorization: `Bearer ${token}` } });
        setServices(await servRes.json());
        
        setLoading(false);

      } catch (error) {
        alert("Veriler yüklenemedi");
        router.push("/dashboard");
      }
    };

    fetchData();
  }, [resolvedParams]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedParams) return;
    
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`https://konca-saas-backend.onrender.com/appointments/${resolvedParams.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: Number(customerId),
          serviceId: Number(serviceId),
          dateTime: new Date(date).toISOString(),
          status
        }),
      });

      if (!res.ok) throw new Error("Güncellenemedi");

      alert("Randevu Güncellendi!");
      router.push("/dashboard");
    } catch (error) {
      alert("Hata oluştu.");
    }
  };

  if (loading) return <div className="p-10 text-white">Yükleniyor...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-yellow-500">Randevuyu Düzenle</h1>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          
          <div>
            <label className="block text-sm mb-1">Müşteri</label>
            <select className="w-full p-2 rounded bg-gray-700 border border-gray-600 outline-none"
              value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Hizmet</label>
            <select className="w-full p-2 rounded bg-gray-700 border border-gray-600 outline-none"
              value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Tarih</label>
            <input type="datetime-local" className="w-full p-2 rounded bg-gray-700 border border-gray-600 outline-none"
              value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Durum</label>
            <select className="w-full p-2 rounded bg-gray-700 border border-gray-600 outline-none"
              value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PENDING">Bekliyor (PENDING)</option>
              <option value="CONFIRMED">Onaylandı (CONFIRMED)</option>
              <option value="CANCELLED">İptal (CANCELLED)</option>
            </select>
          </div>

          <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded font-bold transition">
            Güncelle
          </button>
        </form>
      </div>
    </div>
  );
}