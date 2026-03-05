"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Store, DollarSign, TrendingUp, Trash2, Power, Star, ShieldCheck, MapPin, Search, ChevronRight, Menu, X } from "lucide-react";
// 🚀 SWEETALERT2 EKLENDİ
import Swal from 'sweetalert2';

export default function AdminPanel() {
  const router = useRouter();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // 🛡️ GÜVENLİK KONTROLÜ VE VERİ ÇEKME
  const fetchAdminData = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Önce kullanıcının admin olup olmadığını backend'den teyit ediyoruz
      const userRes = await fetch("https://konca-saas-backend.onrender.com/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();

      if (!userData.isAdmin) {
        Swal.fire({
          title: "Dikkat!",
          text: "🚨 Yetkisiz Erişim! Bu alan sadece yöneticiye özeldir.",
          icon: "warning", // Uyarı ikonu kullanmak daha uygun
          confirmButtonColor: "#f59e0b", 
          background: '#171717',
          color: '#fff'
        });
        router.push("/dashboard"); // Admin değilse dükkan paneline gönder
        return;
      }

      setIsAdmin(true);

      // Admin ise dükkan listesini çek
      const shopsRes = await fetch("https://konca-saas-backend.onrender.com/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (shopsRes.ok) setShops(await shopsRes.json());
      
    } catch (error) {
      console.error("Admin hatası:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, []);

  const toggleStatus = async (id: number, currentStatus: boolean, field: string) => {
    const token = localStorage.getItem("token");
    await fetch(`https://konca-saas-backend.onrender.com/admin/shop/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: !currentStatus })
    });
    fetchAdminData();
  };

  // 🚀 DÜKKAN SİLME İŞLEMİ SWEETALERT2 İLE GÜNCELLENDİ
  const deleteShop = async (id: number) => {
    Swal.fire({
      title: 'Dükkanı Sil?',
      text: "⚠️ DİKKAT: Bu dükkan ve bu dükkana ait tüm randevular KALICI OLARAK SİLİNECEK. Bu işlem geri alınamaz! Emin misin?",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Kırmızı tehlike rengi
      cancelButtonColor: '#27272a',  // Koyu gri iptal rengi
      confirmButtonText: 'Evet, Tamamen Sil!',
      cancelButtonText: 'Vazgeç',
      background: '#171717',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`https://konca-saas-backend.onrender.com/admin/shop/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            Swal.fire({
              title: 'Silindi!',
              text: 'Dükkan ve tüm verileri sistemden başarıyla temizlendi.',
              icon: 'success',
              confirmButtonColor: '#f59e0b',
              background: '#171717',
              color: '#fff'
            });
            fetchAdminData();
          } else {
             Swal.fire({
              title: 'Hata!',
              text: 'Dükkan silinirken bir sorun oluştu.',
              icon: 'error',
              background: '#171717',
              color: '#fff'
            });
          }
        } catch (error) {
           Swal.fire({
              title: 'Bağlantı Hatası!',
              text: 'Sunucuya ulaşılamadı.',
              icon: 'error',
              background: '#171717',
              color: '#fff'
            });
        }
      }
    });
  };

  const filteredShops = shops.filter(s => s.shopName?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-amber-500 gap-4">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold tracking-widest animate-pulse text-sm">GÜVENLİK KONTROLÜ...</p>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      
      {/* --- HEADER (Mobil Uyumlu) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <ShieldCheck size={32} className="text-amber-500"/> <span className="tracking-tight">KOMUTA MERKEZİ</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">İmparatorluğun tüm dükkanları elinin altında.</p>
        </div>
        <div className="w-full md:w-auto bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex justify-between md:block gap-10">
           <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Toplam Dükkan</p>
           <p className="text-2xl font-bold text-amber-500">{shops.length}</p>
        </div>
      </div>

      {/* --- ARAMA --- */}
      <div className="relative mb-8 w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
        <input 
          type="text" placeholder="Dükkan adı ara..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 focus:border-amber-500 outline-none transition"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- MASAÜSTÜ TABLO (Mobilde Gizli) --- */}
      <div className="hidden lg:block bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 text-gray-400 text-xs uppercase font-black tracking-widest">
            <tr>
              <th className="p-6">Dükkan & İletişim</th>
              <th className="p-6">Konum</th>
              <th className="p-6 text-center">Randevu</th>
              <th className="p-6 text-center">Ciro</th>
              <th className="p-6 text-center">Öne Çıkar</th>
              <th className="p-6 text-center">Durum</th>
              <th className="p-6 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredShops.map(shop => (
              <tr key={shop.id} className="hover:bg-zinc-800/30 transition group">
                <td className="p-6">
                  <p className="font-bold text-lg group-hover:text-amber-500 transition">{shop.shopName || "İsimsiz"}</p>
                  <p className="text-xs text-gray-500">{shop.email}</p>
                </td>
                <td className="p-6 text-gray-400">
                  <div className="flex items-center gap-1 text-sm"><MapPin size={14} className="text-amber-500"/> {shop.city || "Belirtilmemiş"}</div>
                </td>
                <td className="p-6 text-center font-bold text-amber-500">{shop.totalAppointments}</td>
                <td className="p-6 text-center font-bold text-green-500">{shop.totalEarnings} ₺</td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => toggleStatus(shop.id, shop.isPromoted, 'isPromoted')}
                    className={`p-3 rounded-xl transition ${shop.isPromoted ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-800 text-gray-500 hover:text-white'}`}
                  >
                    <Star size={20} fill={shop.isPromoted ? "currentColor" : "none"}/>
                  </button>
                </td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => toggleStatus(shop.id, shop.isActive, 'isActive')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-tighter ${shop.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                  >
                    <Power size={12}/> {shop.isActive ? "YAYINDA" : "GİZLİ"}
                  </button>
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => deleteShop(shop.id)} className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition shadow-sm">
                    <Trash2 size={20}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBİL KART SİSTEMİ (Masaüstünde Gizli) --- */}
      <div className="lg:hidden space-y-4">
        {filteredShops.map(shop => (
          <div key={shop.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            {shop.isPromoted && <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-xl">ÖNE ÇIKAN</div>}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl leading-tight">{shop.shopName || "İsimsiz"}</h3>
                <p className="text-xs text-gray-500">{shop.email}</p>
              </div>
              <button onClick={() => deleteShop(shop.id)} className="p-2 text-red-500 bg-red-500/10 rounded-lg">
                <Trash2 size={18}/>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/40 p-3 rounded-2xl border border-zinc-800">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Randevu</p>
                <p className="text-lg font-bold text-amber-500">{shop.totalAppointments}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-zinc-800">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Ciro</p>
                <p className="text-lg font-bold text-green-500">{shop.totalEarnings} ₺</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => toggleStatus(shop.id, shop.isActive, 'isActive')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition ${shop.isActive ? 'bg-green-600 text-white' : 'bg-zinc-800 text-gray-500'}`}
              >
                <Power size={16}/> {shop.isActive ? "AKTİF" : "PASİF"}
              </button>
              <button 
                onClick={() => toggleStatus(shop.id, shop.isPromoted, 'isPromoted')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition ${shop.isPromoted ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-500'}`}
              >
                <Star size={16} fill={shop.isPromoted ? "currentColor" : "none"}/> ÖNE ÇIKAR
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}