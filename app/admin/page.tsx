"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Store, DollarSign, TrendingUp, Trash2, Power, Star, 
  ShieldCheck, MapPin, Search, ChevronRight, Menu, X, 
  Calendar, Clock, Edit3, AlertCircle, PlusCircle, Crown
} from "lucide-react";
import Swal from 'sweetalert2';

export default function AdminPanel() {
  const router = useRouter();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // 🛡️ VERİ ÇEKME
  const fetchAdminData = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    try {
      const userRes = await fetch("https://konca-saas-backend.onrender.com/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();

      if (!userData.isAdmin) {
        Swal.fire({
          title: "Yetkisiz Erişim!",
          text: "🚨 Bu alan sadece imparatorluk yöneticisine özeldir.",
          icon: "warning",
          confirmButtonColor: "#f59e0b", 
          background: '#171717', color: '#fff'
        });
        router.push("/dashboard");
        return;
      }

      setIsAdmin(true);

      const shopsRes = await fetch("https://konca-saas-backend.onrender.com/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (shopsRes.status === 403) throw new Error("403");
      if (shopsRes.ok) setShops(await shopsRes.json());
      
    } catch (error) {
      console.error("Admin Yetki Hatası:", error);
      Swal.fire({
        title: 'Oturum Hatası',
        text: 'Güvenlik nedeniyle oturumunuz sonlandı. Lütfen tekrar giriş yapın.',
        icon: 'error',
        background: '#171717', color: '#fff',
        confirmButtonColor: '#f59e0b'
      }).then(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, []);

  // 🚀 DURUM GÜNCELLEME (Active/Promoted)
  const toggleStatus = async (id: number, currentStatus: boolean, field: string) => {
    const token = localStorage.getItem("token");
    await fetch(`https://konca-saas-backend.onrender.com/admin/shop/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: !currentStatus })
    });
    fetchAdminData();
  };

  // 👑 PAKET (PLAN) DEĞİŞTİRME SİHRİ (DARK MODE ÇÖZÜLDÜ)
  const changePlan = async (id: number, currentPlan: string) => {
    const { value: newPlan } = await Swal.fire({
      title: 'Paketi Güncelle',
      input: 'select',
      inputOptions: {
        'TRIAL': 'Deneme Paketi (TRIAL)',
        'BASIC': 'Başlangıç Paketi (BASIC)',
        'PRO': 'Profesyonel Paket (PRO)',
        'ULTRA': 'Ultra VIP Paket (ULTRA)'
      },
      inputValue: currentPlan,
      showCancelButton: true,
      confirmButtonText: 'Değiştir',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#f59e0b',
      background: '#171717', 
      color: '#fff',
      // 🚀 BEYAZ MENÜYÜ SİYAH YAPAN SİHİRLİ KOD:
      customClass: {
        input: 'bg-[#0a0a0a] text-white border border-zinc-700 outline-none focus:border-amber-500 rounded-lg p-3'
      }
    });

    if (newPlan && newPlan !== currentPlan) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`https://konca-saas-backend.onrender.com/admin/shop/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ plan: newPlan })
        });
        
        if (res.status === 403) throw new Error("403");
        
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Paket Güncellendi!', background: '#171717', color: '#fff', timer: 1500, showConfirmButton: false });
          fetchAdminData();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Yetki Hatası (403)', text: 'İşlem engellendi. Lütfen çıkış yapıp tekrar girmeyi deneyin.', background: '#171717', color: '#fff' });
      }
    }
  };

  // 📅 MANUEL SÜRE SEÇME (DARK MODE)
  const updateExpiryDate = async (id: number, currentPlan: string, currentExpiry: string) => {
    const { value: newDate } = await Swal.fire({
      title: 'Süre Yönetimi',
      html: `<p style="color:#aaa; font-size:14px;">Mevcut Plan: <b>${currentPlan}</b></p>`,
      input: 'date',
      inputValue: currentExpiry ? new Date(currentExpiry).toISOString().split('T')[0] : '',
      showCancelButton: true,
      confirmButtonText: 'Güncelle',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#f59e0b',
      background: '#171717',
      color: '#fff',
      // 🚀 BEYAZ TAKVİMİ SİYAH YAPAN KOD:
      customClass: {
        input: 'bg-[#0a0a0a] text-white border border-zinc-700 outline-none focus:border-amber-500 rounded-lg p-3'
      }
    });

    if (newDate) {
      applyDateUpdate(id, currentPlan, new Date(newDate));
    }
  };

  // ⚡ HIZLI +30 GÜN EKLEME
  const add30Days = async (id: number, currentPlan: string, currentExpiry: string) => {
    const baseDate = (currentExpiry && new Date(currentExpiry) > new Date()) ? new Date(currentExpiry) : new Date();
    baseDate.setDate(baseDate.getDate() + 30);
    applyDateUpdate(id, currentPlan, baseDate);
  };

  // 🛠️ ORTAK TARİH GÜNCELLEME FONKSİYONU
  const applyDateUpdate = async (id: number, currentPlan: string, targetDate: Date) => {
    const token = localStorage.getItem("token");
    const field = currentPlan === 'TRIAL' ? 'trialEndsAt' : 'subscriptionEnd';
    
    try {
      const res = await fetch(`https://konca-saas-backend.onrender.com/admin/shop/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [field]: targetDate.toISOString() })
      });

      if (res.status === 403) throw new Error("403");

      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Süre Uzatıldı!', text: `Yeni bitiş: ${targetDate.toLocaleDateString('tr-TR')}`, background: '#171717', color: '#fff', timer: 2000, showConfirmButton: false });
        fetchAdminData();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Hata!', text: 'Tarih güncellenirken yetki hatası oluştu.', background: '#171717', color: '#fff' });
    }
  };

  // 🗑️ DÜKKAN SİLME
  const deleteShop = async (id: number) => {
    Swal.fire({
      title: 'Dükkanı Sil?',
      text: "⚠️ KALICI OLARAK SİLİNECEK! Bu işlem geri alınamaz!",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Evet, Sil!',
      background: '#171717', color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://konca-saas-backend.onrender.com/admin/shop/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          Swal.fire({ title: 'Silindi!', icon: 'success', background: '#171717', color: '#fff' });
          fetchAdminData();
        }
      }
    });
  };

  // 💡 YARDIMCI: KALAN GÜN HESAPLA
  const getRemainingDays = (expiryDate: string) => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filteredShops = shops.filter(s => s.shopName?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-amber-500 gap-4">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold tracking-widest animate-pulse text-sm">SİSTEM YÜKLENİYOR...</p>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      
      {/* --- ÜST PANEL --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <ShieldCheck size={36} className="text-amber-500"/> 
            <span className="tracking-tighter font-black">KOMUTA MERKEZİ</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Saas İmparatorluğu Yönetimi</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-40 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
               <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Toplam Dükkan</p>
               <p className="text-2xl font-black text-amber-500">{shops.length}</p>
            </div>
            <div className="flex-1 md:w-40 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
               <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Aktif Yayında</p>
               <p className="text-2xl font-black text-green-500">{shops.filter(s => s.isActive).length}</p>
            </div>
        </div>
      </div>

      {/* --- ARAMA VE FİLTRE --- */}
      <div className="relative mb-8 w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
        <input 
          type="text" placeholder="Dükkan adı veya e-posta ile ara..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:border-amber-500 outline-none transition text-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- MASAÜSTÜ YÖNETİM TABLOSU --- */}
      <div className="hidden lg:block bg-zinc-900 rounded-[2rem] border border-zinc-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="p-6">Dükkan & Katılım</th>
              <th className="p-6">Paket (Plan)</th>
              <th className="p-6">Süre Yönetimi</th>
              <th className="p-6 text-center">Kazanç & Ciro</th>
              <th className="p-6 text-center">Durum / Öne Çıkar</th>
              <th className="p-6 text-right">Sil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredShops.map(shop => {
              const expiryDate = shop.plan === 'TRIAL' ? shop.trialEndsAt : shop.subscriptionEnd;
              const daysLeft = getRemainingDays(expiryDate);
              
              return (
                <tr key={shop.id} className="hover:bg-white/[0.02] transition group">
                  <td className="p-6">
                    <p className="font-bold text-lg group-hover:text-amber-500 transition">{shop.shopName || "İsimsiz"}</p>
                    <p className="text-[10px] text-gray-600 font-bold italic mt-1">{new Date(shop.createdAt).toLocaleDateString('tr-TR')}</p>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black px-3 py-1 rounded uppercase tracking-wider ${shop.plan === 'PRO' ? 'bg-amber-500/20 text-amber-500' : shop.plan === 'ULTRA' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {shop.plan}
                        </span>
                        <button onClick={() => changePlan(shop.id, shop.plan)} className="text-gray-500 hover:text-amber-500 transition" title="Paketi Değiştir">
                          <Edit3 size={16}/>
                        </button>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-lg font-black text-xs ${daysLeft <= 0 ? 'bg-red-500/10 text-red-500' : daysLeft <= 7 ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                            {daysLeft > 0 ? `${daysLeft} GÜN KALDI` : "SÜRESİ DOLDU"}
                        </div>
                        <button onClick={() => add30Days(shop.id, shop.plan, expiryDate)} className="p-1.5 text-green-500 hover:bg-green-500/20 rounded-lg transition border border-green-500/20" title="Hızlı +30 Gün Ekle">
                            <PlusCircle size={18}/>
                        </button>
                        <button onClick={() => updateExpiryDate(shop.id, shop.plan, expiryDate)} className="p-1.5 text-gray-500 hover:text-white hover:bg-zinc-800 rounded-lg transition" title="Tarih Seç">
                            <Calendar size={18}/>
                        </button>
                    </div>
                  </td>

                  <td className="p-6 text-center">
                    <p className="text-sm font-bold text-gray-300">{shop.totalAppointments} <span className="text-[10px] text-gray-600">Randevu</span></p>
                    <p className="text-sm font-bold text-green-500">{shop.totalEarnings} ₺ <span className="text-[10px] text-gray-600">Ciro</span></p>
                  </td>

                  <td className="p-6 text-center flex justify-center gap-2">
                    <button onClick={() => toggleStatus(shop.id, shop.isActive, 'isActive')} className={`px-3 py-2 rounded-xl text-[10px] font-black border transition ${shop.isActive ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`} title="Yayında / Gizli">
                      {shop.isActive ? "YAYINDA" : "GİZLİ"}
                    </button>
                    <button onClick={() => toggleStatus(shop.id, shop.isPromoted, 'isPromoted')} className={`p-2 rounded-xl transition ${shop.isPromoted ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-800 text-gray-600 hover:text-white'}`} title="Öne Çıkar">
                      <Star size={16} fill={shop.isPromoted ? "currentColor" : "none"}/>
                    </button>
                  </td>

                  <td className="p-6 text-right">
                    <button onClick={() => deleteShop(shop.id)} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition">
                        <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MOBİL YÖNETİM KARTLARI --- */}
      <div className="lg:hidden space-y-6">
        {filteredShops.map(shop => {
           const expiryDate = shop.plan === 'TRIAL' ? shop.trialEndsAt : shop.subscriptionEnd;
           const daysLeft = getRemainingDays(expiryDate);
           return (
              <div key={shop.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative">
                
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-black text-xl uppercase tracking-tighter">{shop.shopName || "İsimsiz"}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded inline-block">{shop.plan} PAKETİ</span>
                          <button onClick={() => changePlan(shop.id, shop.plan)} className="text-gray-400 hover:text-white"><Edit3 size={14}/></button>
                        </div>
                    </div>
                    <button onClick={() => deleteShop(shop.id)} className="p-2 text-red-500 bg-red-500/10 rounded-lg"><Trash2 size={18}/></button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/40 p-3 rounded-2xl border border-zinc-800">
                        <p className="text-[10px] text-gray-500 font-black mb-1">KALAN SÜRE</p>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-black ${daysLeft <= 7 ? 'text-red-500' : 'text-green-500'}`}>{daysLeft > 0 ? `${daysLeft} GÜN` : "BİTTİ"}</span>
                            <div className="flex gap-2">
                              <button onClick={() => add30Days(shop.id, shop.plan, expiryDate)} className="text-green-500"><PlusCircle size={16}/></button>
                              <button onClick={() => updateExpiryDate(shop.id, shop.plan, expiryDate)} className="text-gray-400"><Calendar size={16}/></button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-2xl border border-zinc-800 text-center">
                        <p className="text-[10px] text-gray-500 font-black mb-1">TOPLAM CİRO</p>
                        <p className="text-sm font-black text-green-500">{shop.totalEarnings} ₺</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => toggleStatus(shop.id, shop.isActive, 'isActive')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition ${shop.isActive ? 'bg-green-600 text-white' : 'bg-zinc-800 text-gray-500'}`}>DÜKKAN: {shop.isActive ? "AÇIK" : "KAPALI"}</button>
                    <button onClick={() => toggleStatus(shop.id, shop.isPromoted, 'isPromoted')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition ${shop.isPromoted ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-500'}`}>ÖNE ÇIKAR: {shop.isPromoted ? "EVET" : "HAYIR"}</button>
                </div>
              </div>
           );
        })}
      </div>
    </div>
  );
}