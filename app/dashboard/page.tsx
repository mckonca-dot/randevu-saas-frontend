"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { 
  LayoutDashboard, Calendar, Users, Scissors, 
  LogOut, Plus, Trash2, Edit, CheckCircle, XCircle, 
  Clock, TrendingUp, DollarSign, Store, CalendarX, Power,
  Image as ImageIcon, NotebookPen, QrCode, Download,
  Menu, X, Phone, RefreshCw, MapPin, 
  Instagram, Twitter, Facebook // 🚀 YENİ İKONLAR
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const router = useRouter();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("overview"); 
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]); 
  const [appointments, setAppointments] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  
  // Mağaza Yönetimi
  const [closures, setClosures] = useState<any[]>([]); 
  const [leaves, setLeaves] = useState<any[]>([]);      
  
  // 🚀 GÜNCELLENDİ: Sosyal medya linkleri eklendi!
  const [shopSettings, setShopSettings] = useState({ 
      shopName: "", phone: "", tagline: "", 
      address: "", addressTitle: "", fullAddress: "", 
      city: "", district: "",
      instagram: "", facebook: "", twitter: "" 
  });

  const [turkeyData, setTurkeyData] = useState<any[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modallar
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [isEditServiceModalOpen, setEditServiceModalOpen] = useState(false);
  const [isStaffModalOpen, setStaffModalOpen] = useState(false); 
  const [isEditStaffModalOpen, setEditStaffModalOpen] = useState(false);
  const [isHoursModalOpen, setHoursModalOpen] = useState(false);

  // Müşteri Notu & QR
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedCustomerNote, setSelectedCustomerNote] = useState({ id: 0, name: "", note: "" });
  const [isQrModalOpen, setQrModalOpen] = useState(false);

  // WhatsApp State'leri
  const [isWhatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState("DISCONNECTED");
  const [whatsappQr, setWhatsappQr] = useState<string | null>(null);
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(false);

  // Form Verileri
  const [newService, setNewService] = useState({ name: "", duration: 30, price: "", isActive: true });
  const [newStaff, setNewStaff] = useState({ name: "", phone: "", email: "" });
  const [workHours, setWorkHours] = useState({ start: "09:00", end: "18:00" });
  const [newClosure, setNewClosure] = useState({ date: "", reason: "" });
  const [newLeave, setNewLeave] = useState({ staffId: "", date: "" });
  
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);

  // 🚀 TELEFON FORMATLAYICI
  const formatPhoneNumber = (value: string) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned === '' || cleaned === '90') return ''; 

    if (cleaned.startsWith('90')) cleaned = cleaned.substring(2);
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    cleaned = cleaned.substring(0, 10);
    
    let res = "+90 ";
    if (cleaned.length > 0) res += "(" + cleaned.substring(0, 3);
    if (cleaned.length >= 4) res += ") " + cleaned.substring(3, 6);
    if (cleaned.length >= 7) res += " " + cleaned.substring(6, 8);
    if (cleaned.length >= 9) res += " " + cleaned.substring(8, 10);
    return res;
  };

  // --- VERİ ÇEKME ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData(token);

    fetch("https://turkiyeapi.dev/api/v1/provinces")
      .then(res => res.json())
      .then(json => {
         if(json && json.data) {
             const sortedProvinces = json.data.sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr-TR'));
             setTurkeyData(sortedProvinces);
         }
      })
      .catch(err => console.error("İl/İlçe datası çekilemedi:", err));
  }, []);

  const fetchData = async (token: string) => {
    try {
      const t = Date.now(); 
      const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' };
      
      const [userRes, servicesRes, appRes, staffRes, closureRes, leaveRes] = await Promise.all([
        fetch(`https://konca-saas-backend.onrender.com/users/me?t=${t}`, { headers }),
        fetch(`https://konca-saas-backend.onrender.com/services?t=${t}`, { headers }),
        fetch(`https://konca-saas-backend.onrender.com/appointments?t=${t}`, { headers }),
        fetch(`https://konca-saas-backend.onrender.com/staffs?t=${t}`, { headers }),
        fetch(`https://konca-saas-backend.onrender.com/closures?t=${t}`, { headers }).catch(() => ({ ok: false, json: async () => [] })), 
        fetch(`https://konca-saas-backend.onrender.com/leaves?t=${t}`, { headers }).catch(() => ({ ok: false, json: async () => [] }))
      ]);

      if (userRes.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      setUser(userData);
      
      if(userData) {
          setWorkHours({ start: userData.workStart || "09:00", end: userData.workEnd || "18:00" });
          setShopSettings({
              shopName: userData.shopName || "",
              phone: userData.phone || "",
              tagline: userData.tagline || "",
              address: userData.address || "",
              addressTitle: userData.addressTitle || "",
              fullAddress: userData.fullAddress || "",
              city: userData.city || "",
              district: userData.district || "",
              instagram: userData.instagram || "", // 🚀 SOSYAL MEDYA
              facebook: userData.facebook || "",   
              twitter: userData.twitter || ""      
          });
      }

      setServices(await servicesRes.json());
      setAppointments(await appRes.json());
      setStaffs(await staffRes.json());
      
      if ((closureRes as Response).ok) setClosures(await (closureRes as Response).json());
      if ((leaveRes as Response).ok) setLeaves(await (leaveRes as Response).json());

    } catch (error) {
      console.error("Dashboard Veri Hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(shopSettings.city && turkeyData.length > 0) {
        const selectedCityData = turkeyData.find(c => c.name.toLocaleUpperCase('tr-TR') === shopSettings.city.toLocaleUpperCase('tr-TR'));
        if(selectedCityData && selectedCityData.districts) {
            const sortedDistricts = selectedCityData.districts.map((d: any) => d.name).sort((a: string, b: string) => a.localeCompare(b, 'tr-TR'));
            setAvailableDistricts(sortedDistricts);
        } else { setAvailableDistricts([]); }
    } else { setAvailableDistricts([]); }
  }, [shopSettings.city, turkeyData]);

  // WhatsApp Fonksiyonları
  const fetchWhatsappStatus = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`https://konca-saas-backend.onrender.com/whatsapp/status/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setWhatsappStatus(data.status);
        setWhatsappQr(data.qr);
      }
    } catch (e) { console.error(e); }
  };

  const startWhatsapp = async () => {
    if (!user?.id) return;
    setIsWhatsappLoading(true);
    try { await fetch(`https://konca-saas-backend.onrender.com/whatsapp/start/${user.id}`, { method: 'POST' }); fetchWhatsappStatus(); } catch (e) { console.error(e); } finally { setIsWhatsappLoading(false); }
  };

  const logoutWhatsapp = async () => {
    if (!user?.id) return;
    try { await fetch(`https://konca-saas-backend.onrender.com/whatsapp/logout/${user.id}`, { method: 'POST' }); setWhatsappStatus("DISCONNECTED"); setWhatsappQr(null); } catch (e) { console.error(e); }
  };

  useEffect(() => {
    let interval: any;
    if (isWhatsappModalOpen && (whatsappStatus === 'INITIALIZING' || whatsappStatus === 'QR_READY' || whatsappStatus === 'DISCONNECTED')) {
      interval = setInterval(fetchWhatsappStatus, 3000);
    }
    return () => clearInterval(interval);
  }, [isWhatsappModalOpen, whatsappStatus, user?.id]);

  // --- İŞLEMLER ---
  const downloadQRCode = () => {
    const canvas = document.getElementById("shop-qr-code") as HTMLCanvasElement;
    if(canvas) {
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `konca-randevu-qr.png`;
        document.body.appendChild(downloadLink); downloadLink.click(); document.body.removeChild(downloadLink);
    }
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token"); if (!token) return;
    try {
        const res = await fetch("https://konca-saas-backend.onrender.com/users/me", {
            method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(shopSettings)
        });
        if (res.ok) {
            Swal.fire({ title: "Harika!", text: "Profil bilgileri güncellendi! ✅", icon: "success", confirmButtonColor: "#2563eb", background: "#111827", color: "#fff" });
            fetchData(token); 
        } else {
            Swal.fire({ title: "Dikkat!", text: "Güncelleme başarısız.", icon: "error", confirmButtonColor: "#ef4444", background: "#111827", color: "#fff" });
        }
    } catch (e) { Swal.fire({ title: "Hata!", text: "Bağlantı hatası.", icon: "error", confirmButtonColor: "#ef4444", background: "#111827", color: "#fff" }); }
  };

  const handleSaveNote = async () => {
    const token = localStorage.getItem("token"); if (!token) return;
    try { await fetch(`https://konca-saas-backend.onrender.com/customers/${selectedCustomerNote.id}/note`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ note: selectedCustomerNote.note }), }); setNoteModalOpen(false); Swal.fire({ title: "Kaydedildi!", text: "Müşteri notu güncellendi.", icon: "success", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#111827", color: "#fff" }); fetchData(token); } catch (error) {}
  };

  const handleAddClosure = async () => {
    if(!newClosure.date) return Swal.fire({ title: "Uyarı", text: "Lütfen bir tarih seçiniz.", icon: "warning", confirmButtonColor: "#f59e0b", background: "#111827", color: "#fff" });
    const token = localStorage.getItem("token"); if (!token) return;
    await fetch("https://konca-saas-backend.onrender.com/closures", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(newClosure)}); setNewClosure({ date: "", reason: "" }); fetchData(token); Swal.fire({ title: "Eklendi!", text: "Kapalı gün kaydedildi.", icon: "success", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#111827", color: "#fff" });
  };
  const handleDeleteClosure = async (id: number) => { const token = localStorage.getItem("token"); if (!token) return; await fetch(`https://konca-saas-backend.onrender.com/closures/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); fetchData(token); };

  const handleAddLeave = async () => {
    if(!newLeave.staffId || !newLeave.date) return;
    const token = localStorage.getItem("token"); if (!token) return;
    await fetch("https://konca-saas-backend.onrender.com/leaves", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(newLeave)}); setNewLeave({ staffId: "", date: "" }); fetchData(token); Swal.fire({ title: "Eklendi!", text: "İzin kaydedildi.", icon: "success", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#111827", color: "#fff" });
  };
  const handleDeleteLeave = async (id: number) => { const token = localStorage.getItem("token"); if (!token) return; await fetch(`https://konca-saas-backend.onrender.com/leaves/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); fetchData(token); };

  const handleToggleServiceStatus = async (service: any) => { const token = localStorage.getItem("token"); if (!token) return; await fetch(`https://konca-saas-backend.onrender.com/services/${service.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ isActive: !service.isActive })}); fetchData(token); };
  
  const handleAddService = async () => { const token = localStorage.getItem("token"); if (!token) return; await fetch("https://konca-saas-backend.onrender.com/services", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(newService)}); setServiceModalOpen(false); fetchData(token); Swal.fire({ title: "Eklendi!", icon: "success", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#111827", color: "#fff" }); };
  const handleUpdateService = async () => { if (!editingService) return; const token = localStorage.getItem("token"); if (!token) return; await fetch(`https://konca-saas-backend.onrender.com/services/${editingService.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: editingService.name, duration: Number(editingService.duration), price: editingService.price })}); setEditServiceModalOpen(false); fetchData(token); Swal.fire({ title: "Güncellendi!", icon: "success", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#111827", color: "#fff" }); };
  const handleDeleteService = async (id: number) => { Swal.fire({ title: 'Emin misin?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#374151', confirmButtonText: 'Evet, Sil!', cancelButtonText: 'İptal', background: "#111827", color: "#fff" }).then(async (result) => { if (result.isConfirmed) { const token = localStorage.getItem("token"); if (!token) return; await fetch(`https://konca-saas-backend.onrender.com/services/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); fetchData(token); } }); };

  // 🚀 PERSONEL EKLEME: LİMİT KONTROLLÜ
  const handleAddStaff = async () => { 
    const planLimits: any = { 'TRIAL': 5, 'BASIC': 5, 'PRO': 10, 'ULTRA': 999 };
    const currentLimit = planLimits[user?.plan || 'TRIAL'];
    
    if(staffs.length >= currentLimit) {
        return Swal.fire({ icon: 'warning', title: 'Limit Doldu', text: `${user?.plan} planında en fazla ${currentLimit} personel ekleyebilirsiniz. Lütfen planınızı yükseltin.`, confirmButtonColor: '#f59e0b', background: '#171717', color: '#fff'});
    }
    
    const token = localStorage.getItem("token"); if (!token) return; 
    
    try {
        const res = await fetch("https://konca-saas-backend.onrender.com/staffs", { 
            method: "POST", 
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, 
            body: JSON.stringify(newStaff)
        });
        
        // 🚨 BACKEND'DEN GELEN LİMİT HATASINI YAKALA
        if (!res.ok) {
            const errorData = await res.json();
            return Swal.fire({ 
              icon: 'error', 
              title: 'İşlem Başarısız', 
              text: errorData.message || 'Personel eklenemedi.', 
              confirmButtonColor: '#ef4444', 
              background: '#171717', 
              color: '#fff' 
            });
        }

        setStaffModalOpen(false); 
        setNewStaff({ name: "", phone: "", email: "" }); 
        fetchData(token); 
        Swal.fire({ title: "Eklendi!", icon: "success", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#171717", color: "#fff" }); 
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Hata', text: 'Sunucu bağlantı hatası.', background: '#171717', color: '#fff' });
    }
  };

  const handleUpdateStaff = async () => { if (!editingStaff) return; const token = localStorage.getItem("token"); if (!token) return; await fetch(`https://konca-saas-backend.onrender.com/staffs/${editingStaff.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: editingStaff.name, phone: editingStaff.phone, email: editingStaff.email })}); setEditStaffModalOpen(false); fetchData(token); Swal.fire({ title: "Güncellendi!", icon: "success", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#111827", color: "#fff" }); };
  const handleDeleteStaff = async (id: number) => { Swal.fire({ title: 'Emin misin?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#374151', confirmButtonText: 'Evet, Sil!', cancelButtonText: 'İptal', background: "#111827", color: "#fff" }).then(async (result) => { if (result.isConfirmed) { const token = localStorage.getItem("token"); if (!token) return; await fetch(`https://konca-saas-backend.onrender.com/staffs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); fetchData(token); } }); };

  const handleUpdateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("token"); if (!token) return;
    let cancelReason = "";
    if (status === 'CANCELLED') {
        const { value: reason } = await Swal.fire({ title: 'İptal Sebebi', input: 'text', inputPlaceholder: 'Örn: Acil iş çıktı.', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#374151', confirmButtonText: 'İptal Et', background: "#111827", color: "#fff" });
        if (!reason) return; cancelReason = reason;
    }
    try { await fetch(`https://konca-saas-backend.onrender.com/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status, cancelReason }) }); fetchData(token); Swal.fire({ title: "Başarılı!", icon: "success", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#111827", color: "#fff" }); } catch (error) {}
  };
  const handleDeleteAppointment = async (id: number) => { Swal.fire({ title: 'Randevuyu Sil?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#374151', confirmButtonText: 'Evet, Sil!', cancelButtonText: 'İptal', background: "#111827", color: "#fff" }).then(async (result) => { if (result.isConfirmed) { const token = localStorage.getItem("token"); if (!token) return; await fetch(`https://konca-saas-backend.onrender.com/appointments/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); fetchData(token); } }); };

  const handleUpdateHours = async () => { const token = localStorage.getItem("token"); if (!token) return; await fetch("https://konca-saas-backend.onrender.com/users/hours", { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ workStart: workHours.start, workEnd: workHours.end })}); setHoursModalOpen(false); fetchData(token); Swal.fire({ title: "Güncellendi!", icon: "success", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#111827", color: "#fff" }); };

  // --- İSTATİSTİKLER ---
  const totalEarnings = appointments.filter(a => a.status !== 'CANCELLED').reduce((acc, curr) => acc + Number(curr.service?.price || 0), 0);
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const confirmedCount = appointments.filter(a => a.status === 'CONFIRMED').length;
  const chartData = services.map(s => ({ name: s.name, count: appointments.filter(a => a.serviceId === s.id).length }));

  const now = new Date();
  const upcomingAppointments = appointments
    .filter((app: any) => {
      const appDate = new Date(app.dateTime);
      const isToday = appDate.getDate() === now.getDate() && appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
      const isFutureTime = appDate.getTime() > now.getTime();
      return isToday && isFutureTime && app.status !== 'CANCELLED';
    })
    .sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-950 text-blue-500">Yükleniyor...</div>;

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans relative">
      
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-950 border-r border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                {user?.shopName ? user.shopName.charAt(0).toUpperCase() : "K"}
             </div>
             <span className="font-bold text-lg tracking-tight truncate max-w-[150px]" title={user?.shopName}>
                {user?.shopName || "KoncaSaaS"}
             </span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={24}/></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Genel Bakış' },
            { id: 'appointments', icon: Calendar, label: 'Randevular', badge: pendingCount },
            { id: 'services', icon: Scissors, label: 'Hizmetler' },
            { id: 'staff', icon: Users, label: 'Ekip' },
            { id: 'settings', icon: Store, label: 'Mağaza Yönetimi' },
          ].map((item) => (
             <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <item.icon size={20} /> {item.label}
                {item.badge && item.badge > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
             </button>
          ))}
          <button onClick={() => { router.push('/dashboard/gallery'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-gray-400 hover:bg-gray-800 hover:text-white`}> <ImageIcon size={20} /> Galeri Yönetimi </button>
          <button onClick={() => { setQrModalOpen(true); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-gray-400 hover:bg-gray-800 hover:text-white`}> <QrCode size={20} /> QR Kodum </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
           <button onClick={() => { localStorage.removeItem("token"); router.push("/login"); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition"><LogOut size={20} /> Çıkış Yap</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 w-full md:w-auto overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 bg-gray-800 rounded-lg text-white"><Menu size={24}/></button>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-white truncate max-w-[200px] md:max-w-none">Hoşgeldin, {user?.shopName || "Kuaför"} 👋</h1>
                <p className="text-gray-400 text-xs md:text-sm">Panelinizden tüm süreçleri yönetin.</p>
             </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <button onClick={() => { setWhatsappModalOpen(true); fetchWhatsappStatus(); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-green-900/20 transition text-sm whitespace-nowrap"><Phone size={16}/> WhatsApp Bağla</button>
             <button onClick={() => setHoursModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-700 transition text-sm whitespace-nowrap"><Clock size={16}/> Saatler</button>
             {user?.id && <a href={`/book/${user.id}`} target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 text-white px-4 py-2 rounded-lg font-bold transition text-sm whitespace-nowrap">Siteye Git ↗</a>}
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-xl"><div className="flex justify-between items-start"><div><p className="text-gray-400 text-xs font-medium mb-1">Toplam Kazanç</p><h3 className="text-xl md:text-2xl font-bold text-white">{totalEarnings} ₺</h3></div><div className="p-3 bg-green-500/20 rounded-lg text-green-500"><DollarSign size={24}/></div></div></div>
              <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-xl"><div className="flex justify-between items-start"><div><p className="text-gray-400 text-xs font-medium mb-1">Onaylı Randevu</p><h3 className="text-xl md:text-2xl font-bold text-white">{confirmedCount}</h3></div><div className="p-3 bg-blue-500/20 rounded-lg text-blue-500"><CheckCircle size={24}/></div></div></div>
              <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-xl"><div className="flex justify-between items-start"><div><p className="text-gray-400 text-xs font-medium mb-1">Bekleyen</p><h3 className="text-xl md:text-2xl font-bold text-yellow-500">{pendingCount}</h3></div><div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-500"><Clock size={24}/></div></div></div>
              <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-xl"><div className="flex justify-between items-start"><div><p className="text-gray-400 text-xs font-medium mb-1">Toplam Personel</p><h3 className="text-xl md:text-2xl font-bold text-white">{staffs.length}</h3></div><div className="p-3 bg-purple-500/20 rounded-lg text-purple-500"><Users size={24}/></div></div></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><TrendingUp size={20}/> Hizmet Popülaritesi</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" tick={{fontSize: 12}} interval={0} angle={-30} textAnchor="end" height={60}/>
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{backgroundColor: '#1F2937', border: 'none', color: '#fff'}} />
                      <Bar dataKey="count" fill="#3B82F6" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 overflow-y-auto max-h-[400px]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Calendar size={18} className="text-blue-500"/> Kalan Randevular (Bugün)</h3>
                <div className="space-y-4">
                  {upcomingAppointments.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition">
                      <div>
                        <p className="font-bold text-sm text-gray-200">{app.customer?.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                             <span className="text-white font-bold bg-gray-700 px-1.5 py-0.5 rounded">{new Date(app.dateTime).toLocaleTimeString("tr-TR", {hour:'2-digit', minute:'2-digit'})}</span>
                             <span>•</span><span>{app.service?.name}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${app.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : app.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {app.status === 'PENDING' ? 'Bekliyor' : app.status === 'CONFIRMED' ? 'Onaylı' : 'İptal'}
                      </span>
                    </div>
                  ))}
                  {upcomingAppointments.length === 0 && (
                      <div className="text-center py-8 text-gray-500 flex flex-col items-center"><CheckCircle size={32} className="mb-2 opacity-50 text-green-500"/><p className="text-sm">Bugün için randevu kalmadı.</p></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="animate-fade-in bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center"><h2 className="text-lg md:text-xl font-bold">Randevu Yönetimi</h2><span className="text-xs md:text-sm text-gray-400">Toplam {appointments.length} kayıt</span></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400 min-w-[800px]">
                <thead className="bg-gray-800 text-gray-200 uppercase font-bold text-xs"><tr><th className="p-4">Tarih</th><th className="p-4">Müşteri</th><th className="p-4">Hizmet / Personel</th><th className="p-4">Durum</th><th className="p-4 text-right">İşlem</th></tr></thead>
                <tbody className="divide-y divide-gray-800">
                  {appointments.map((app: any) => (
                    <tr key={app.id} className="hover:bg-gray-800/50 transition">
                      <td className="p-4 font-medium text-white">{new Date(app.dateTime).toLocaleDateString("tr-TR")} <br/><span className="text-gray-500 font-normal">{new Date(app.dateTime).toLocaleTimeString("tr-TR", {hour:'2-digit', minute:'2-digit'})}</span></td>
                      <td className="p-4"><div className="font-bold text-gray-200">{app.customer?.name}</div><div className="text-xs">{app.customer?.phone}</div></td>
                      <td className="p-4"><span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs border border-blue-900/50">{app.service?.name}</span>{app.staff && <div className="mt-1 text-xs text-gray-500">👨‍💼 {app.staff.name}</div>}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'CONFIRMED' ? 'bg-green-900/30 text-green-400' : app.status === 'CANCELLED' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'}`}>{app.status === 'PENDING' ? 'Bekliyor' : app.status === 'CONFIRMED' ? 'Onaylı' : 'İptal'}</span></td>
                      <td className="p-4 flex justify-end gap-2">
                          <button onClick={() => { if(!app.customer) return; setSelectedCustomerNote({ id: app.customer.id, name: app.customer.name, note: app.customer.notes || "" }); setNoteModalOpen(true); }} className="p-2 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded transition group relative"> <NotebookPen size={16}/> {app.customer?.notes && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>} </button>
                          {app.status === 'CONFIRMED' && (<button onClick={() => handleUpdateStatus(app.id, 'CANCELLED')} title="Randevuyu İptal Et" className="p-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded transition"><XCircle size={16}/></button>)}
                          {app.status === 'PENDING' && (<><button onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')} title="Onayla" className="p-2 bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white rounded transition"><CheckCircle size={16}/></button> <button onClick={() => handleUpdateStatus(app.id, 'CANCELLED')} title="İptal Et" className="p-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded transition"><XCircle size={16}/></button></>)}
                          <button onClick={() => handleDeleteAppointment(app.id)} className="p-2 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded transition"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'services' && ( <div className="animate-fade-in"><div className="flex justify-between items-center mb-6"><h2 className="text-lg md:text-xl font-bold">Hizmet Listesi</h2><button onClick={() => setServiceModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold flex items-center gap-2 transition text-sm"><Plus size={18}/> <span className="hidden md:inline">Yeni Ekle</span><span className="md:hidden">Ekle</span></button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{services.map((s: any) => (<div key={s.id} className={`bg-gray-900 p-5 rounded-xl border transition group relative ${s.isActive === false ? 'border-red-900 opacity-60' : 'border-gray-800 hover:border-gray-600'}`}><div className="flex justify-between items-start mb-2"><h3 className="font-bold text-lg text-white">{s.name}</h3><span className="bg-gray-800 text-white px-2 py-1 rounded text-sm font-bold border border-gray-700">{s.price} ₺</span></div><p className="text-gray-400 text-sm flex items-center gap-1"><Clock size={14}/> {s.duration} dakika</p>{s.isActive === false && <p className="text-red-500 text-xs mt-2 font-bold">⚠️ Şu an pasif</p>}<div className="absolute bottom-4 right-4 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition"><button onClick={() => { setEditingService(s); setEditServiceModalOpen(true); }} className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition"><Edit size={16}/></button><button onClick={() => handleDeleteService(s.id)} className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition"><Trash2 size={16}/></button></div></div>))}</div></div>)}
        {activeTab === 'staff' && ( <div className="animate-fade-in"><div className="flex justify-between items-center mb-6"><h2 className="text-lg md:text-xl font-bold">Ekip Arkadaşlarım</h2><button onClick={() => { setNewStaff({name: "", phone: "+90 ", email: ""}); setStaffModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold flex items-center gap-2 transition text-sm"><Plus size={18}/> <span className="hidden md:inline">Personel Ekle</span><span className="md:hidden">Ekle</span></button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{staffs.map((s: any) => (<div key={s.id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-gray-600 transition group flex items-center gap-4 relative"><div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">{s.name.charAt(0).toUpperCase()}</div><div><h3 className="font-bold text-lg text-white">{s.name}</h3><p className="text-gray-400 text-sm">{s.phone}</p></div><div className="absolute top-4 right-4 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition"><button onClick={() => { setEditingStaff(s); setEditStaffModalOpen(true); }} className="p-1.5 text-blue-400 hover:text-white transition"><Edit size={16}/></button><button onClick={() => handleDeleteStaff(s.id)} className="p-1.5 text-red-400 hover:text-white transition"><Trash2 size={16}/></button></div></div>))}</div></div>)}
        
        {/* 🚀 DİNAMİK KOORDİNAT, ADRES VE SOSYAL MEDYA YÖNETİMİ */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in space-y-6">
              
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <Store size={20} className="text-blue-500"/> Profil ve Adres Bilgileri
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="text-xs text-gray-500 mb-2 block font-bold">Dükkan İsmi</label>
                          <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition" placeholder="Örn: Konca Kuaför" value={shopSettings.shopName} onChange={(e) => setShopSettings({...shopSettings, shopName: e.target.value})} />
                      </div>
                      
                      <div>
                          <label className="text-xs text-gray-500 mb-2 block font-bold">İletişim Telefonu</label>
                          <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition" placeholder="05XX XXX XX XX" value={shopSettings.phone} onChange={(e) => setShopSettings({...shopSettings, phone: formatPhoneNumber(e.target.value)})} />
                      </div>

                      <div className="md:col-span-2 border-t border-gray-800 pt-6 mt-2">
                          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><MapPin size={16} className="text-amber-500"/> Detaylı Adres Yönetimi</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="text-xs text-gray-500 mb-2 block font-bold">İl (Şehir)</label>
                                  <select className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition appearance-none" value={shopSettings.city} onChange={(e) => { setShopSettings({...shopSettings, city: e.target.value, district: ""}); }} >
                                      <option value="">Şehir Seçiniz...</option>
                                      {turkeyData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                  </select>
                              </div>
                              
                              <div>
                                  <label className="text-xs text-gray-500 mb-2 block font-bold">İlçe</label>
                                  <select className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition appearance-none ${(!shopSettings.city || availableDistricts.length === 0) ? "opacity-50 cursor-not-allowed" : ""}`} value={shopSettings.district} onChange={(e) => setShopSettings({...shopSettings, district: e.target.value})} disabled={!shopSettings.city || availableDistricts.length === 0} >
                                      <option value="">{shopSettings.city ? "İlçe Seçiniz..." : "Önce İl Seçin"}</option>
                                      {availableDistricts.map(d => <option key={d} value={d}>{d}</option> )}
                                  </select>
                              </div>

                              <div>
                                  <label className="text-xs text-gray-500 mb-2 block font-bold">Adres Başlığı (Harita Linki İçin)</label>
                                  <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition" placeholder="Örn: Merkez Şube / Meydan AVM" value={shopSettings.addressTitle} onChange={(e) => setShopSettings({...shopSettings, addressTitle: e.target.value})} />
                              </div>

                              <div>
                                  <label className="text-xs text-gray-500 mb-2 block font-bold">Harita Koordinatları (Zorunlu)</label>
                                  <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition" placeholder="Örn: 40.8373988, 31.1668614" value={shopSettings.address} onChange={(e) => setShopSettings({...shopSettings, address: e.target.value})} />
                              </div>

                              <div className="md:col-span-2">
                                  <label className="text-xs text-gray-500 mb-2 block font-bold">Açık Adres (Yol Tarifi)</label>
                                  <textarea className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition resize-none h-24" placeholder="Müşterilerinizin dükkanı kolayca bulabilmesi için detaylı tarif yazın. Örn: PTT arkası, caminin hemen yanındaki sokak..." value={shopSettings.fullAddress} onChange={(e) => setShopSettings({...shopSettings, fullAddress: e.target.value})} />
                              </div>

                              <div className="md:col-span-2 bg-[#171717] p-5 rounded-2xl border border-gray-700 shadow-inner">
                                  <h4 className="text-xs text-gray-400 mb-4 uppercase tracking-widest font-bold">Vitrin Adres Kartı (Canlı Önizleme)</h4>
                                  <div className="space-y-3">
                                      {shopSettings.addressTitle ? (
                                          <a 
                                              href={`https://maps.google.com/?q=${encodeURIComponent(shopSettings.address || shopSettings.shopName || '')}`} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-amber-500 hover:text-yellow-400 font-bold text-xl flex items-center gap-2 underline decoration-amber-500/30 underline-offset-4"
                                          >
                                              <MapPin size={22}/> {shopSettings.addressTitle}
                                          </a>
                                      ) : (
                                          <span className="text-gray-600 text-sm italic">Adres başlığı girildiğinde burada tıklanabilir bir harita linki oluşur...</span>
                                      )}
                                      <p className="text-gray-300 text-sm leading-relaxed">
                                          {shopSettings.fullAddress || "Açık adres ve yol tarifi burada görünecektir..."}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* 🚀 YENİ: SOSYAL MEDYA LİNKLERİ BÖLÜMÜ */}
                      <div className="md:col-span-2 border-t border-gray-800 pt-6 mt-2">
                          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Instagram size={16} className="text-pink-500"/> Sosyal Medya & Vitrin Linkleri</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                  <label className="text-xs text-gray-500 mb-2 block font-bold flex items-center gap-1"><Instagram size={14}/> Instagram</label>
                                  <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-pink-500 outline-none transition" placeholder="https://instagram.com/..." value={shopSettings.instagram} onChange={(e) => setShopSettings({...shopSettings, instagram: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-xs text-gray-500 mb-2 block font-bold flex items-center gap-1"><Twitter size={14}/> Twitter (X)</label>
                                  <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-400 outline-none transition" placeholder="https://twitter.com/..." value={shopSettings.twitter} onChange={(e) => setShopSettings({...shopSettings, twitter: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-xs text-gray-500 mb-2 block font-bold flex items-center gap-1"><Facebook size={14}/> Facebook</label>
                                  <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-600 outline-none transition" placeholder="https://facebook.com/..." value={shopSettings.facebook} onChange={(e) => setShopSettings({...shopSettings, facebook: e.target.value})} />
                              </div>
                          </div>
                      </div>

                      <div className="md:col-span-2 border-t border-gray-800 pt-6 mt-2">
                          <label className="text-xs text-gray-500 mb-2 block font-bold">Slogan / Alt Yazı</label>
                          <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition" placeholder="Örn: Lüks ve konforun buluştuğu nokta." value={shopSettings.tagline} onChange={(e) => setShopSettings({...shopSettings, tagline: e.target.value})} />
                      </div>

                  </div>

                  <div className="mt-8 flex justify-end">
                      <button onClick={handleUpdateProfile} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition flex items-center gap-2 shadow-lg shadow-blue-900/20" >
                          <CheckCircle size={20}/> Ayarları Kaydet
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6"><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CalendarX size={20} className="text-red-500"/> Dükkan Kapalı Günleri</h3><div className="flex flex-col sm:flex-row gap-2 mb-4"><input type="date" className="bg-gray-800 border border-gray-700 text-white rounded-lg p-2 w-full" onChange={(e) => setNewClosure({...newClosure, date: e.target.value})} value={newClosure.date}/><input type="text" placeholder="Sebep" className="bg-gray-800 border border-gray-700 text-white rounded-lg p-2 w-full" onChange={(e) => setNewClosure({...newClosure, reason: e.target.value})} value={newClosure.reason}/><button onClick={handleAddClosure} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 whitespace-nowrap">Kapat</button></div><ul className="space-y-2 max-h-48 overflow-y-auto">{closures.map((c: any) => (<li key={c.id} className="flex justify-between items-center bg-gray-800/50 p-2 rounded-lg border border-gray-700"><span className="text-sm text-gray-300">{new Date(c.date).toLocaleDateString("tr-TR")} - <span className="text-gray-500">{c.reason}</span></span><button onClick={() => handleDeleteClosure(c.id)} className="text-red-400 hover:text-red-200"><Trash2 size={14}/></button></li>))}</ul></div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6"><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Power size={20} className="text-blue-500"/> Hizmet Kullanılabilirliği</h3><div className="space-y-3 max-h-64 overflow-y-auto pr-2">{services.map((s: any) => (<div key={s.id} className="flex justify-between items-center bg-gray-800/30 p-3 rounded-lg border border-gray-700"><span className={s.isActive === false ? "text-gray-500 line-through" : "text-white"}>{s.name}</span><div className="form-check form-switch cursor-pointer" onClick={() => handleToggleServiceStatus(s)}><div className={`w-10 h-5 rounded-full relative transition ${s.isActive !== false ? 'bg-blue-600' : 'bg-gray-600'}`}><div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${s.isActive !== false ? 'left-6' : 'left-1'}`}></div></div></div></div>))}</div></div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6"><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Users size={20} className="text-yellow-500"/> Personel İzin Yönetimi</h3><div className="flex flex-col sm:flex-row gap-3 mb-4 items-end"><div className="w-full"><label className="text-xs text-gray-500 mb-1 block">Personel</label><select className="bg-gray-800 border border-gray-700 text-white rounded-lg p-2 w-full" onChange={(e) => setNewLeave({...newLeave, staffId: e.target.value})}><option value="">Seçiniz...</option>{staffs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div className="w-full"><label className="text-xs text-gray-500 mb-1 block">Tarih</label><input type="date" className="bg-gray-800 border border-gray-700 text-white rounded-lg p-2 w-full" onChange={(e) => setNewLeave({...newLeave, date: e.target.value})} /></div><button onClick={handleAddLeave} className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 w-full sm:w-auto h-[42px]">İzin Ekle</button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm text-gray-400 min-w-[500px]"><thead className="bg-gray-800 text-gray-200 text-xs"><tr><th className="p-3 rounded-l-lg">Personel</th><th className="p-3">Tarih</th><th className="p-3 rounded-r-lg text-right">İşlem</th></tr></thead><tbody className="divide-y divide-gray-800">{leaves.map((l: any) => { const staffName = staffs.find(s => s.id === l.staffId)?.name || "Bilinmiyor"; return (<tr key={l.id}><td className="p-3 text-white">{staffName}</td><td className="p-3">{new Date(l.date).toLocaleDateString("tr-TR")}</td><td className="p-3 text-right"><button onClick={() => handleDeleteLeave(l.id)} className="text-red-400 hover:text-white"><Trash2 size={14}/></button></td></tr>) })}</tbody></table></div></div>
          </div>
        )}
      </main>

      {/* --- MODALLAR (AYNEN KORUNDU) --- */}
      {isWhatsappModalOpen && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"><div className="bg-gray-900 p-6 md:p-8 rounded-2xl w-full max-w-sm text-center border border-gray-800 shadow-2xl"><h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2"><Phone className="text-[#25D366]"/> WhatsApp Entegrasyonu</h3><p className="text-sm text-gray-400">Müşterilerinize randevu mesajları sizin numaranızdan gider.</p><div className="my-6 min-h-[200px] flex flex-col items-center justify-center bg-gray-800 rounded-xl border border-gray-700 p-4">{whatsappStatus === 'CONNECTED' ? (<div className="text-[#25D366] flex flex-col items-center"><CheckCircle size={56} className="mb-3"/><p className="font-bold text-xl">Bağlı ve Hazır!</p><p className="text-sm text-gray-400 mt-2">Mesajlarınız otomatik gönderiliyor.</p></div>) : whatsappStatus === 'QR_READY' && whatsappQr ? (<div className="flex flex-col items-center"><div className="p-2 bg-white rounded-xl mb-4"><img src={whatsappQr} alt="WhatsApp QR" className="w-48 h-48"/></div><p className="text-sm text-gray-300">Telefonunuzdan WhatsApp ayarlarına girip <b>"Bağlı Cihazlar"</b> menüsünden bu QR kodu okutun.</p></div>) : whatsappStatus === 'INITIALIZING' || isWhatsappLoading ? (<div className="text-blue-500 flex flex-col items-center"><RefreshCw size={40} className="animate-spin mb-4"/><p className="font-bold text-white">Sistem Hazırlanıyor...</p><p className="text-xs text-gray-400 mt-2">Bu işlem birkaç saniye sürebilir, bekleyin.</p></div>) : (<div className="text-gray-400 flex flex-col items-center"><Phone size={48} className="mb-4 opacity-30"/><p className="mb-4 text-sm text-gray-300">Sistem şu an bağlı değil.</p><button onClick={startWhatsapp} className="bg-[#25D366] hover:bg-[#1DA851] text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-green-900/20 transition">Bağlantıyı Başlat</button></div>)}</div><div className="flex gap-2"><button onClick={() => setWhatsappModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition">Kapat</button>{whatsappStatus === 'CONNECTED' && (<button onClick={logoutWhatsapp} className="flex-1 px-4 py-3 bg-red-600/20 text-red-500 rounded-xl font-bold hover:bg-red-600 hover:text-white transition">Çıkış Yap</button>)}</div></div></div>)}
      {isQrModalOpen && ( <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"><div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl"><h3 className="text-2xl font-bold text-gray-900 mb-2">Dükkan Karekodunuz</h3><p className="text-gray-500 text-sm mb-6">Müşterileriniz bunu okutarak randevu alabilir.</p><div className="bg-white p-2 rounded-xl border border-gray-200 inline-block mb-6 shadow-sm"><QRCodeCanvas id="shop-qr-code" value={typeof window !== "undefined" ? `${window.location.origin}/book/${user?.id}` : ""} size={200} level={"H"} includeMargin={true}/></div><div className="flex gap-2"><button onClick={() => setQrModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">Kapat</button><button onClick={downloadQRCode} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition"><Download size={20}/> İndir</button></div></div></div>)}
      {isNoteModalOpen && ( <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"><div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl"><div className="flex items-center gap-3 mb-4"><div className="p-3 bg-purple-500/20 rounded-full text-purple-400"><NotebookPen size={24}/></div><div><h3 className="text-xl font-bold text-white">Müşteri Notu</h3><p className="text-sm text-gray-400">{selectedCustomerNote.name}</p></div></div><textarea className="w-full h-32 p-4 bg-gray-800 rounded-xl border border-gray-700 text-white outline-none focus:border-purple-500 transition resize-none leading-relaxed" placeholder="Notunuz..." value={selectedCustomerNote.note} onChange={(e) => setSelectedCustomerNote({...selectedCustomerNote, note: e.target.value})}/><div className="flex justify-end gap-2 mt-4"><button onClick={() => setNoteModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition">Vazgeç</button><button onClick={handleSaveNote} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold">Kaydet</button></div></div></div>)}
      {isServiceModalOpen && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"><div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl"><h3 className="text-xl font-bold mb-4 text-white">Yeni Hizmet Ekle</h3><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" placeholder="Hizmet Adı" onChange={(e) => setNewService({...newService, name: e.target.value})} /><div className="flex gap-3"><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" type="number" placeholder="Süre (dk)" onChange={(e) => setNewService({...newService, duration: +e.target.value})} /><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" placeholder="Fiyat (TL)" onChange={(e) => setNewService({...newService, price: e.target.value})} /></div><div className="flex justify-end gap-2 mt-4"><button onClick={() => setServiceModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">İptal</button><button onClick={handleAddService} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Kaydet</button></div></div></div>)}
      {isHoursModalOpen && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"><div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border border-gray-800 shadow-2xl"><h3 className="text-xl font-bold mb-4 text-white">Çalışma Saatleri</h3><div className="space-y-4"><div><label className="text-sm text-gray-400">Açılış</label><input type="time" className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" value={workHours.start} onChange={(e) => setWorkHours({...workHours, start: e.target.value})} /></div><div><label className="text-sm text-gray-400">Kapanış</label><input type="time" className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" value={workHours.end} onChange={(e) => setWorkHours({...workHours, end: e.target.value})} /></div></div><div className="flex justify-end gap-2 mt-6"><button onClick={() => setHoursModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">İptal</button><button onClick={handleUpdateHours} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Güncelle</button></div></div></div>)}
      
      {/* PERSONEL MODALLARI (Telefon formatlı ve LİMİT KONTROLLÜ) */}
      {isStaffModalOpen && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"><div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl"><h3 className="text-xl font-bold mb-4 text-white">Yeni Personel</h3><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" placeholder="Ad Soyad" onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} /><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" placeholder="+90 (5XX) XXX XX XX" value={newStaff.phone} onChange={(e) => setNewStaff({...newStaff, phone: formatPhoneNumber(e.target.value)})} /><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" placeholder="E-posta" onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} /><div className="flex justify-end gap-2 mt-4"><button onClick={() => setStaffModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">İptal</button><button onClick={handleAddStaff} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Kaydet</button></div></div></div>)}
      {isEditServiceModalOpen && editingService && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"><div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl"><h3 className="text-xl font-bold mb-4 text-white">Hizmeti Düzenle</h3><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" value={editingService.name} onChange={(e) => setEditingService({...editingService, name: e.target.value})} /><div className="flex gap-3"><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" type="number" value={editingService.duration} onChange={(e) => setEditingService({...editingService, duration: e.target.value})} /><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" value={editingService.price} onChange={(e) => setEditingService({...editingService, price: e.target.value})} /></div><div className="flex justify-end gap-2 mt-4"><button onClick={() => setEditServiceModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">İptal</button><button onClick={handleUpdateService} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Güncelle</button></div></div></div>)}
      {isEditStaffModalOpen && editingStaff && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"><div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl"><h3 className="text-xl font-bold mb-4 text-white">Personel Düzenle</h3><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" value={editingStaff.name} onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})} /><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" value={editingStaff.phone} onChange={(e) => setEditingStaff({...editingStaff, phone: formatPhoneNumber(e.target.value)})} /><input className="w-full mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white" value={editingStaff.email || ""} onChange={(e) => setEditingStaff({...editingStaff, email: e.target.value})} /><div className="flex justify-end gap-2 mt-4"><button onClick={() => setEditStaffModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">İptal</button><button onClick={handleUpdateStaff} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Güncelle</button></div></div></div>)}

    </div>
  );
}