"use client";

import { useEffect, useState } from "react";
import { Users, Store, DollarSign, TrendingUp, Trash2, Power, Star, ShieldCheck, MapPin, Search } from "lucide-react";

export default function AdminPanel() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchShops = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://konca-saas-backend.onrender.com/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setShops(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchShops(); }, []);

  const toggleStatus = async (id: number, currentStatus: boolean, field: string) => {
    const token = localStorage.getItem("token");
    await fetch(`https://konca-saas-backend.onrender.com/admin/shop/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: !currentStatus })
    });
    fetchShops();
  };

  const deleteShop = async (id: number) => {
    if(!confirm("Bu dükkanı tamamen silmek istediğine emin misin? Bu işlem geri alınamaz!")) return;
    const token = localStorage.getItem("token");
    await fetch(`https://konca-saas-backend.onrender.com/admin/shop/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchShops();
  };

  const filteredShops = shops.filter(s => s.shopName?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-amber-500">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <ShieldCheck size={40} className="text-amber-500"/> SÜPER ADMİN PANELİ
          </h1>
          <p className="text-gray-500 mt-2">Platformdaki tüm dükkanları ve gelirleri yönetin.</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
           <p className="text-xs text-gray-500">Toplam Dükkan</p>
           <p className="text-2xl font-bold text-amber-500">{shops.length}</p>
        </div>
      </div>

      {/* ARAMA */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
        <input 
          type="text" placeholder="Dükkan adı ara..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:border-amber-500 outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 text-gray-400 text-sm uppercase">
            <tr>
              <th className="p-5">Dükkan Bilgisi</th>
              <th className="p-5">İl / İlçe</th>
              <th className="p-5">Randevu</th>
              <th className="p-5">Ciro</th>
              <th className="p-5">Öne Çıkar</th>
              <th className="p-5">Durum</th>
              <th className="p-5 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredShops.map(shop => (
              <tr key={shop.id} className="hover:bg-zinc-800/30 transition">
                <td className="p-5">
                  <p className="font-bold text-lg">{shop.shopName || "İsimsiz"}</p>
                  <p className="text-xs text-gray-500">{shop.email}</p>
                </td>
                <td className="p-5 text-gray-400">
                  <div className="flex items-center gap-1 text-sm"><MapPin size={14}/> {shop.city}</div>
                </td>
                <td className="p-5 font-bold text-amber-500">{shop.totalAppointments}</td>
                <td className="p-5 font-bold text-green-500">{shop.totalEarnings} ₺</td>
                <td className="p-5">
                  <button 
                    onClick={() => toggleStatus(shop.id, shop.isPromoted, 'isPromoted')}
                    className={`p-2 rounded-lg transition ${shop.isPromoted ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-500 hover:text-white'}`}
                    title="Öne Çıkar"
                  >
                    <Star size={20} fill={shop.isPromoted ? "currentColor" : "none"}/>
                  </button>
                </td>
                <td className="p-5">
                  <button 
                    onClick={() => toggleStatus(shop.id, shop.isActive, 'isActive')}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${shop.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                  >
                    <Power size={14}/> {shop.isActive ? "AKTİF" : "PASİF"}
                  </button>
                </td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => deleteShop(shop.id)}
                    className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition"
                  >
                    <Trash2 size={20}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}