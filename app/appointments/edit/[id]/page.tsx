"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// 🚀 SWEETALERT2 EKLENDİ
import Swal from 'sweetalert2';

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
        const appRes = await fetch("https://planin.onrender.com/appointments", {
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
        const custRes = await fetch("https://planin.onrender.com/customers", { headers: { Authorization: `Bearer ${token}` } });
        setCustomers(await custRes.json());

        const servRes = await fetch("https://planin.onrender.com/services", { headers: { Authorization: `Bearer ${token}` } });
        setServices(await servRes.json());
        
        setLoading(false);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Hata!',
          text: 'Veriler yüklenirken bir sorun oluştu.',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#fff'
        }).then(() => {
          router.push("/dashboard");
        });
      }
    };

    fetchData();
  }, [resolvedParams, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedParams) return;
    
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`https://planin.onrender.com/appointments/${resolvedParams.id}`, {
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

      // 🚀 ŞIK BAŞARI MESAJI (Otomatik kapanır)
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Randevu başarıyla güncellendi.',
        showConfirmButton: false,
        timer: 1500,
        background: '#1f2937',
        color: '#fff'
      }).then(() => {
        router.push("/dashboard");
      });
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Randevu güncellenirken bir sorun oluştu.',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: '#fff'
      });
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-blue-500 font-bold">Yükleniyor...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-yellow-500">Randevuyu Düzenle</h1>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          
          <div>
            <label className="block text-sm mb-1 text-gray-400">Müşteri</label>
            <select className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 outline-none transition"
              value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Hizmet</label>
            <select className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 outline-none transition"
              value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-gray-400">Tarih ve Saat</label>
            <input type="datetime-local" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 outline-none transition"
              value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Durum</label>
            <select className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 outline-none transition"
              value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PENDING">Bekliyor</option>
              <option value="CONFIRMED">Onaylandı</option>
              <option value="CANCELLED">İptal</option>
            </select>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold transition shadow-lg">
              Güncelle
            </button>
            <button 
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-transparent border border-gray-600 hover:bg-gray-700 rounded-lg font-bold transition text-gray-400"
            >
              İptal Et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}