"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Star, MapPin, Calendar, Clock, Scissors, 
  User, Phone, AlertCircle, Check, ChevronRight, Menu, X, ArrowLeft,
  Instagram, Twitter, Facebook, Mail, Home, MessageCircle 
} from "lucide-react";
import Swal from 'sweetalert2';

export default function BookAppointment() {
  const params = useParams();
  const router = useRouter();
  
  // --- STATE ---
  const [shop, setShop] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any>(null); 
  const [gallery, setGallery] = useState<any[]>([]);
  const [closures, setClosures] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [busySlots, setBusySlots] = useState<any[]>([]);

  // Seçimler
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", note: "" });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopError, setShopError] = useState(""); 

  // 🚀 FAREYLE KAYDIRMA (DRAG TO SCROLL) İÇİN GEREKLİ STATE VE REF
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // * 2 hızı belirler
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // --- VERİ ÇEKME ---
  useEffect(() => {
    const userId = params?.id;
    if (!userId || userId === "undefined") return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const baseUrl = "https://konca-saas-backend.onrender.com/public";
        const shopRes = await fetch(`${baseUrl}/shop/${userId}`);
        
        if(shopRes.ok) {
            setShop(await shopRes.json());
            Promise.all([
               fetch(`${baseUrl}/services/${userId}`).then(r => r.ok ? r.json() : []).then(setServices),
               fetch(`${baseUrl}/staffs/${userId}`).then(r => r.ok ? r.json() : []).then(setStaffs),
               fetch(`${baseUrl}/reviews/${userId}`).then(r => r.ok ? r.json() : null).then(setReviews),
               fetch(`${baseUrl}/gallery/${userId}`).then(r => r.ok ? r.json() : []).then(setGallery),
               fetch(`${baseUrl}/closures/${userId}`).then(r => r.ok ? r.json() : []).then(setClosures),
               fetch(`${baseUrl}/leaves/${userId}`).then(r => r.ok ? r.json() : []).then(setLeaves),
            ]).catch(err => console.log("Veri hatası:", err));
        } else {
            setShopError("Bu dükkan şu anda hizmet vermemektedir veya sistemden kaldırılmıştır.");
        }
      } catch (error) {
        setShopError("Sunucu bağlantı hatası oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params?.id]);

  useEffect(() => {
    if (!date || !params?.id) return;
    setTime(""); 
    const fetchBusySlots = async () => {
        try {
            const res = await fetch(`https://konca-saas-backend.onrender.com/public/appointments/${params.id}?date=${date}`);
            if (res.ok) setBusySlots(await res.json());
        } catch (error) { console.error(error); }
    };
    fetchBusySlots();
  }, [date, params?.id]);

  // --- YARDIMCI FONKSİYONLAR ---
  const getTodayStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isSlotInPast = (slotTime: string) => {
    const todayStr = getTodayStr();
    if (date === todayStr) {
        const now = new Date();
        const [slotH, slotM] = slotTime.split(':').map(Number);
        const currentH = now.getHours();
        const currentM = now.getMinutes();
        if (slotH < currentH || (slotH === currentH && slotM < currentM)) return true;
    }
    return false;
  };

  const isTimeSlotBusy = (slotTime: string) => {
    if (!selectedService) return false;
    const [slotH, slotM] = slotTime.split(':').map(Number);
    const slotStartMins = slotH * 60 + slotM;
    const slotEndMins = slotStartMins + selectedService.duration;

    if (selectedStaff) {
         const isLeave = leaves.some((l: any) => l.staffId === selectedStaff.id && l.date === date);
         if (isLeave) return true;
    }

    return busySlots.some((appt: any) => {
        if (selectedStaff && appt.staffId && appt.staffId !== selectedStaff.id) return false;
        const apptStart = new Date(appt.start);
        const apptH = apptStart.getHours();
        const apptM = apptStart.getMinutes();
        const busyStartMins = apptH * 60 + apptM;
        const busyEndMins = busyStartMins + appt.duration;
        return (slotStartMins < busyEndMins && slotEndMins > busyStartMins);
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); 
    if (input.length > 0 && input !== '5') {
        input = input.replace(/^[^5]+/, ''); 
    }
    input = input.substring(0, 10);
    let formatted = input;
    if (input.length > 6) {
        formatted = `(${input.substring(0, 3)}) ${input.substring(3, 6)} ${input.substring(6)}`;
    } else if (input.length > 3) {
        formatted = `(${input.substring(0, 3)}) ${input.substring(3)}`;
    } else if (input.length > 0) {
        formatted = `(${input}`;
    }
    setCustomerInfo({ ...customerInfo, phone: formatted });
  };

  const todayStr = getTodayStr();
  const isSunday = date ? new Date(date).getDay() === 0 : false;
  const isPastDate = date ? date < todayStr : false;
  const isShopClosed = closures.some((c: any) => c.date === date);

  const showWarning = (text: string) => {
    Swal.fire({ icon: 'warning', title: 'Eksik Bilgi', text: text, confirmButtonColor: '#f59e0b', background: '#171717', color: '#fff' });
  };

  const handleError = (text: string) => {
    Swal.fire({ icon: 'error', title: 'Hata', text: text, confirmButtonColor: '#ef4444', background: '#171717', color: '#fff' });
  };

  const handleSubmit = async () => {
    if (!selectedService) return showWarning("Lütfen bir hizmet seçiniz.");
    if (!date || !time) return showWarning("Lütfen tarih ve saat seçiniz.");
    if (!customerInfo.name) return showWarning("Lütfen Adınızı ve Soyadınızı giriniz.");
    if (customerInfo.phone.length !== 14) return showWarning("Lütfen geçerli bir telefon numarası giriniz (10 haneli).");

    const selectedDateTime = new Date(`${date}T${time}`);
    
    if (date < todayStr) return handleError("Geçmiş bir tarihe randevu alamazsınız.");
    if (date === todayStr && isSlotInPast(time)) return handleError("Geçmiş bir saate randevu alamazsınız.");
    if (selectedDateTime.getDay() === 0) return handleError("Pazar günleri dükkanımız kapalıdır.");

    const [openH, openM] = (shop.workStart || "09:00").split(':').map(Number);
    const shopOpenMins = openH * 60 + openM;
    const [closeH, closeM] = (shop.workEnd || "18:00").split(':').map(Number);
    const shopCloseMins = closeH * 60 + closeM;

    const [selH, selM] = time.split(':').map(Number);
    const selectedStartMins = selH * 60 + selM;
    const selectedEndMins = selectedStartMins + selectedService.duration;

    if (selectedStartMins < shopOpenMins) return handleError(`Dükkanımız saat ${shop.workStart}'da açılmaktadır.`);
    if (selectedEndMins > shopCloseMins) return handleError(`Seçtiğiniz hizmet süresi dükkan kapanış saatini (${shop.workEnd}) aşıyor.`);
    if (isShopClosed) return handleError(`Üzgünüz, dükkanımız ${new Date(date).toLocaleDateString("tr-TR")} tarihinde kapalıdır.`);
    if (isTimeSlotBusy(time)) return handleError("Bu saat aralığı maalesef dolu.");

    setSubmitting(true);
    try {
      const res = await fetch("https://konca-saas-backend.onrender.com/public/appointments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: Number(params.id),
          serviceId: selectedService.id,
          staffId: selectedStaff?.id,
          dateTime: selectedDateTime.toISOString(),
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          customerNote: customerInfo.note
        }),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success', title: 'Randevunuz Alındı!',
          text: 'Randevunuz başarıyla oluşturuldu. WhatsApp üzerinden bilgilendirme mesajı gönderilecektir.',
          confirmButtonText: 'Tamam', confirmButtonColor: '#f59e0b', background: '#171717', color: '#fff', allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) { window.location.reload(); }
        });
      } else {
        const err = await res.json(); handleError(err.message || "Bir sorun oluştu.");
      }
    } catch (e) { handleError("Sunucu bağlantı hatası."); } finally { setSubmitting(false); }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = shop?.workStart ? parseInt(shop.workStart.split(':')) : 9;
    const endHour = shop?.workEnd ? parseInt(shop.workEnd.split(':')) : 21;
    for (let i = startHour; i < endHour; i++) {
        slots.push(`${i < 10 ? '0'+i : i}:00`);
        slots.push(`${i < 10 ? '0'+i : i}:30`);
    }
    return slots;
  };

  if (loading) return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-amber-500">
          <Scissors className="animate-spin mb-4" size={48} />
          <h2 className="text-xl font-bold tracking-widest animate-pulse font-heading">PREMIUM DENEYİM YÜKLENİYOR...</h2>
      </div>
  );
  
  if (shopError || !shop) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-4">
       <div className="bg-[#171717] p-8 md:p-12 rounded-3xl border border-zinc-800 flex flex-col items-center text-center max-w-lg shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6"><AlertCircle className="text-red-500" size={40} /></div>
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 tracking-wider">HİZMET DIŞI</h2>
          <p className="text-gray-400 font-body mb-8 leading-relaxed">{shopError || "Dükkan bilgileri alınamadı. Bu işletme sistemde kayıtlı olmayabilir."}</p>
          <button onClick={() => router.push('/')} className="flex items-center gap-2 bg-amber-500 text-black px-8 py-3 rounded-xl font-bold font-heading tracking-widest hover:bg-yellow-400 transition"><ArrowLeft size={20} /> ANA SAYFAYA DÖN</button>
       </div>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] text-[#e5e5e5] font-sans antialiased min-h-screen scroll-smooth overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@300;400;600&display=swap');
        h1, h2, h3, h4, h5, .font-heading { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
        .font-body { font-family: 'Inter', sans-serif; }
        .neon-gold-text { text-shadow: 0 0 10px rgba(245, 158, 11, 0.6), 0 0 20px rgba(245, 158, 11, 0.3); }
        .neon-gold-border { box-shadow: 0 0 15px rgba(245, 158, 11, 0.4); border: 1px solid rgba(245, 158, 11, 0.8); }
        .neon-gold-border:hover { box-shadow: 0 0 25px rgba(245, 158, 11, 0.7); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex-shrink-0 flex items-center gap-4">
              <button 
                onClick={() => router.back()} 
                className="group flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-all font-semibold"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-amber-500/50 group-hover:bg-amber-500/10 transition-all">
                  <ArrowLeft size={20} />
                </div>
                <span className="hidden sm:inline text-xs md:text-sm tracking-wide">GERİ</span>
              </button>

              <div className="h-8 w-px bg-zinc-800 mx-1 hidden sm:block"></div>

              <div className="flex items-center gap-3">
                {shop?.logo && <img src={shop.logo} className="w-10 h-10 rounded-full border border-amber-500 object-cover" />}
                <a href="#" className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white truncate max-w-[120px] md:max-w-none">
                  {shop?.shopName || "KUAFÖR"}
                </a>
              </div>
            </div>

            <div className="hidden md:flex space-x-8">
              <a href="#hakkimizda" className="text-gray-300 hover:text-amber-500 transition duration-300 font-semibold tracking-wide text-xs lg:text-sm">Hakkımızda</a>
              <a href="#hizmetler" className="text-gray-300 hover:text-amber-500 transition duration-300 font-semibold tracking-wide text-xs lg:text-sm">Hizmetler</a>
              {gallery.length > 0 && <a href="#galeri" className="text-gray-300 hover:text-amber-500 transition duration-300 font-semibold tracking-wide text-xs lg:text-sm">Galeri</a>}
              {reviews?.reviews?.length > 0 && <a href="#yorumlar" className="text-gray-300 hover:text-amber-500 transition duration-300 font-semibold tracking-wide text-xs lg:text-sm">Yorumlar</a>}
              <a href="#iletisim" className="text-gray-300 hover:text-amber-500 transition duration-300 font-semibold tracking-wide text-xs lg:text-sm">İletişim</a>
            </div>

            <div className="hidden md:flex">
              <a href="#randevu" className="px-6 py-2 text-amber-500 font-heading tracking-wider hover:bg-amber-500 hover:text-black transition duration-300 neon-gold-border cursor-pointer text-sm">
                RANDEVU AL
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-amber-500 focus:outline-none">
                {isMobileMenuOpen ? <X size={28}/> : <Menu size={28}/>}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-t border-[#171717] absolute top-full left-0 w-full shadow-2xl animate-fade-in-up z-[999]">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <a href="#hakkimizda" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-lg font-heading tracking-wide text-gray-300 hover:text-amber-500 hover:bg-[#171717] transition">HAKKIMIZDA</a>
              <a href="#hizmetler" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-lg font-heading tracking-wide text-gray-300 hover:text-amber-500 hover:bg-[#171717] transition">HİZMETLER</a>
              {gallery.length > 0 && <a href="#galeri" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-lg font-heading tracking-wide text-gray-300 hover:text-amber-500 hover:bg-[#171717] transition">GALERİ</a>}
              {reviews?.reviews?.length > 0 && <a href="#yorumlar" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-lg font-heading tracking-wide text-gray-300 hover:text-amber-500 hover:bg-[#171717] transition">YORUMLAR</a>}
              <a href="#iletisim" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-lg font-heading tracking-wide text-gray-300 hover:text-amber-500 hover:bg-[#171717] transition">İLETİŞİM / KONUM</a>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section 
        className="h-screen flex items-center justify-center pt-20 bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 10, 0.4), rgba(10, 10, 10, 1)), url('${shop?.coverImage || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}')` }}
      >
        <div className="text-center px-4 max-w-4xl animate-fade-in-up w-full">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight font-heading neon-gold-text">
            STİLİN GÜCÜNÜ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">KEŞFET</span>
          </h1>
          <p className="text-base md:text-2xl text-gray-300 mb-10 font-light tracking-wide flex items-center justify-center gap-2">
            <Star className="text-amber-500 hidden sm:block" size={20} fill="currentColor"/>
            {shop?.tagline || `${shop?.shopName} - Premium Stil Merkezi`}
            <Star className="text-amber-500 hidden sm:block" size={20} fill="currentColor"/>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#randevu" className="px-6 py-4 bg-amber-500 text-black font-heading text-lg md:text-xl font-bold tracking-wider hover:bg-yellow-500 transition duration-300 shadow-[0_0_15px_rgba(217,119,6,0.5)]">
              HEMEN RANDEVU AL
            </a>
            <a href="#hizmetler" className="px-6 py-4 border-2 border-white text-white font-heading text-lg md:text-xl font-bold tracking-wider hover:bg-white hover:text-black transition duration-300">
              HİZMETLERİ İNCELE
            </a>
          </div>
        </div>
      </section>

      {/* --- HAKKIMIZDA --- */}
      <section id="hakkimizda" className="py-20 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative group overflow-hidden rounded-sm bg-[#171717] flex items-center justify-center border border-zinc-900 shadow-2xl">
              <img 
                src={shop?.logo || shop?.coverImage || "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                alt="Salon Görseli" 
                className={`w-full h-[350px] md:h-[500px] transition duration-700 transform group-hover:scale-105 
                  ${shop?.logo ? 'object-contain p-12' : 'object-cover grayscale group-hover:grayscale-0'}`} 
              />
              
              {shop?.logo && (
                <div className="absolute inset-0 bg-amber-500/5 blur-3xl -z-10"></div>
              )}

              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-[#0a0a0a]/90 p-4 border-l-4 border-amber-500 backdrop-blur-sm">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  <Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/>
                </div>
                <p className="text-white font-heading text-xl md:text-2xl font-bold">{reviews?.rating ? `${reviews.rating} / 5.0` : "5.0 / 5.0"}</p>
                <p className="text-gray-400 text-xs md:text-sm">Müşteri Memnuniyeti</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-amber-500 font-heading tracking-widest mb-2 text-sm md:text-base">BİZ KİMİZ?</h4>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">SADECE TIRAŞ DEĞİL,<br/>BİR KİMLİK TASARIMI</h2>
              <p className="text-gray-400 mb-6 leading-relaxed font-body text-sm md:text-base">
                {shop?.description || `${shop?.shopName} olarak erkek bakım standartlarını yeniden yazıyoruz. Klasik berber anlayışından sıyrılarak, modern vizyonumuzla her müşterimizin yüz hatlarına ve yaşam tarzına en uygun stili yaratıyoruz.`}
              </p>
              <ul className="space-y-3 md:space-y-4 text-gray-300 font-medium font-body text-sm md:text-base">
                <li className="flex items-center gap-3"><Check className="text-amber-500" size={20}/> Premium Modern Ekipmanlar</li>
                <li className="flex items-center gap-3"><Check className="text-amber-500" size={20}/> Üst Düzey Hijyen Standartları</li>
                <li className="flex items-center gap-3"><Check className="text-amber-500" size={20}/> Kişiye Özel Profesyonel Hizmet</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section id="hizmetler" className="py-20 md:py-24 bg-[#171717] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h4 className="text-amber-500 font-heading tracking-widest mb-2 text-sm md:text-base">HİZMETLERİMİZ</h4>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-heading">PREMIUM BAKIM MENÜSÜ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.slice(0, 6).map((srv) => (
              <div key={srv.id} className="bg-[#0a0a0a] p-6 md:p-8 border border-zinc-800 hover:border-amber-500 transition duration-300 group flex flex-col justify-between rounded-xl">
                <div>
                  <div className="text-amber-500 text-3xl md:text-4xl mb-4"><Scissors size={28}/></div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-amber-500 transition font-heading">{srv.name}</h3>
                  <p className="text-gray-400 mb-4 text-xs md:text-sm font-body"><Clock size={14} className="inline mr-1"/> {srv.duration} Dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-xl md:text-2xl font-bold text-white font-heading">{srv.price} ₺</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERİ */}
      {gallery.length > 0 && (
        <section id="galeri" className="py-20 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h4 className="text-amber-500 font-heading tracking-widest mb-2 text-sm md:text-base">PORTFOLYO</h4>
              <h2 className="text-3xl md:text-5xl font-bold text-white font-heading">USTALIĞIN İMZASI</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {gallery.slice(0, 8).map((img: any, i: number) => (
                <div key={i} className="relative group overflow-hidden bg-[#171717] aspect-[3/4] rounded-lg">
                  <img src={img.imageUrl} alt="Galeri" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500 transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <span className="text-amber-500 font-heading text-sm md:text-lg">{img.modelName || "Stil"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🚀 GOOGLE YORUMLARI (YENİ EKLENDİ VE FAREYLE KAYDIRMA EKLENDİ) */}
      {reviews && reviews.reviews && reviews.reviews.length > 0 && (
        <section id="yorumlar" className="py-20 md:py-24 bg-[#171717] border-y border-zinc-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 text-zinc-800 opacity-20 pointer-events-none">
            <MessageCircle size={300} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
              <div>
                <h4 className="text-amber-500 font-heading tracking-widest mb-2 text-sm md:text-base flex items-center gap-2">
                  MÜŞTERİLERİMİZ NE DİYOR?
                </h4>
                <h2 className="text-3xl md:text-5xl font-bold text-white font-heading">GERÇEK DENEYİMLER</h2>
              </div>
              <div className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                <div className="text-4xl font-black font-heading text-white">{reviews.rating}</div>
                <div>
                  <div className="flex text-amber-500 mb-1">
                    {[...Array(Math.floor(reviews.rating))].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <span className="text-xs text-gray-400">{reviews.totalReviews} Google Değerlendirmesi</span>
                </div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-8 h-8 ml-2 opacity-80 pointer-events-none" />
              </div>
            </div>

            {/* 🚀 Yorum Kartları (Drag to Scroll Özelliği ile) */}
            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex gap-6 overflow-x-auto pb-8 hide-scrollbar select-none ${
                isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x'
              }`}
            >
              {reviews.reviews.map((review: any, index: number) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[300px] md:w-[400px] bg-[#0a0a0a] border border-zinc-800 p-6 md:p-8 rounded-3xl snap-center relative group hover:border-amber-500/50 transition-colors duration-300"
                >
                  <div className="absolute top-6 right-6 text-zinc-800 group-hover:text-amber-500/20 transition-colors pointer-events-none">
                     <MessageCircle size={32} />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6 pointer-events-none">
                    <img src={review.profile_photo_url} alt={review.author_name} className="w-12 h-12 rounded-full border-2 border-zinc-800" />
                    <div>
                      <h4 className="text-white font-bold text-sm md:text-base">{review.author_name}</h4>
                      <p className="text-xs text-gray-500">{review.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex text-amber-500 mb-4 pointer-events-none">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-4 italic pointer-events-none">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RANDEVU BÖLÜMÜ */}
      <section id="randevu" className="py-20 md:py-24 bg-[#0a0a0a] border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h4 className="text-amber-500 font-heading tracking-widest mb-2 text-sm md:text-base">REZERVASYON</h4>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4">KOLTUĞUNUZ HAZIR</h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-body">Tarzınızı bir adım öteye taşımak için şimdi randevu alın. İşleminizi sadece 4 adımda tamamlayın.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 font-body">
            
            <div className="lg:col-span-2 space-y-6 md:space-y-10">
              <div className="bg-[#171717] p-5 md:p-8 rounded-2xl border border-zinc-800 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-base md:text-lg font-heading">1</div>
                  <h3 className="text-xl md:text-2xl font-bold text-white font-heading">Hizmet Seçimi</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  {services.length > 0 ? services.map(srv => (
                    <div 
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 flex justify-between items-center group
                        ${selectedService?.id === srv.id 
                          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                          : 'border-zinc-800 bg-[#0a0a0a] hover:border-amber-500/50'}`}
                    >
                      <div className="pr-2">
                        <h4 className={`font-bold text-base md:text-lg font-heading tracking-wide ${selectedService?.id === srv.id ? 'text-amber-500' : 'text-white'}`}>{srv.name}</h4>
                        <p className="text-xs md:text-sm text-gray-500 mt-1 flex items-center gap-1.5"><Clock size={14}/> {srv.duration} dk</p>
                      </div>
                      <div className="text-right flex flex-col items-end flex-shrink-0">
                        <span className="font-bold text-lg md:text-xl text-white font-heading">{srv.price} ₺</span>
                        {selectedService?.id === srv.id && <Check size={18} className="text-amber-500 mt-1"/>}
                      </div>
                    </div>
                  )) : <p className="text-gray-500 text-sm">Aktif hizmet bulunamadı.</p>}
                </div>
              </div>

              <div className="bg-[#171717] p-5 md:p-8 rounded-2xl border border-zinc-800 animate-fade-in-up delay-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-base md:text-lg font-heading">2</div>
                  <h3 className="text-xl md:text-2xl font-bold text-white font-heading">Uzman Tercihi</h3>
                </div>
                <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                  <div 
                    onClick={() => setSelectedStaff(null)}
                    className={`flex-shrink-0 w-24 h-32 md:w-28 md:h-36 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-2 md:gap-3 transition-all snap-start
                      ${!selectedStaff ? 'border-amber-500 bg-[#0a0a0a]' : 'border-zinc-800 bg-[#0a0a0a] hover:border-amber-500/50'}`}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl ${!selectedStaff ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-400'}`}>?</div>
                    <span className="text-xs md:text-sm font-bold text-white">Farketmez</span>
                  </div>
                  {staffs.map(stf => (
                    <div 
                      key={stf.id}
                      onClick={() => setSelectedStaff(stf)}
                      className={`flex-shrink-0 w-24 h-32 md:w-28 md:h-36 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-2 md:gap-3 transition-all text-center p-2 snap-start
                        ${selectedStaff?.id === stf.id ? 'border-amber-500 bg-[#0a0a0a]' : 'border-zinc-800 bg-[#0a0a0a] hover:border-amber-500/50'}`}
                    >
                      {stf.imageUrl ? 
                        <img src={stf.imageUrl} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-zinc-700"/> : 
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-zinc-800 text-amber-500 flex items-center justify-center font-bold text-lg md:text-xl">{stf.name.charAt(0)}</div>
                      }
                      <span className="text-xs md:text-sm font-bold text-white line-clamp-2 leading-tight">{stf.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#171717] p-5 md:p-8 rounded-2xl border border-zinc-800 animate-fade-in-up delay-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-base md:text-lg font-heading">3</div>
                  <h3 className="text-xl md:text-2xl font-bold text-white font-heading">Zaman Belirle</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tarih Seçin</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" size={20}/>
                      <input 
                        type="date" 
                        min={todayStr}
                        onChange={e => setDate(e.target.value)} 
                        className="w-full p-4 pl-12 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-amber-500 text-white cursor-pointer color-scheme-dark text-sm md:text-base" 
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Saat Seçin</label>
                    <div className="bg-[#0a0a0a] rounded-xl p-3 md:p-4 border border-zinc-800 max-h-64 overflow-y-auto custom-scrollbar">
                      {!date ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                          <Calendar size={28} className="mb-2 opacity-50"/>
                          <p className="text-xs md:text-sm">Önce tarih seçin</p>
                        </div>
                      ) : isShopClosed ? (
                        <div className="text-red-400 text-center py-8 font-bold flex flex-col items-center">
                          <AlertCircle className="mb-2" size={28}/> 
                          <span className="text-xs md:text-sm">Üzgünüz, bu tarihte kapalıyız</span>
                        </div>
                      ) : isSunday ? (
                        <div className="text-red-400 text-center py-8 font-bold flex flex-col items-center">
                          <AlertCircle className="mb-2" size={28}/> 
                          <span className="text-xs md:text-sm">Pazar günleri kapalıyız</span>
                        </div>
                      ) : isPastDate ? (
                        <div className="text-red-400 text-center py-8 font-bold flex flex-col items-center">
                          <Clock className="mb-2" size={28}/> 
                          <span className="text-xs md:text-sm">Geçmişe alınamaz</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 md:gap-3">
                          {generateTimeSlots().map((slotTime) => {
                            const isBusy = isTimeSlotBusy(slotTime);
                            const isPastTime = isSlotInPast(slotTime);
                            const [openH, openM] = (shop.workStart || "09:00").split(':').map(Number);
                            const [slotH, slotM] = slotTime.split(':').map(Number);
                            const isBeforeOpening = (slotH * 60 + slotM) < (openH * 60 + openM);
                            const isDisabled = isBusy || isPastTime || isBeforeOpening;
                            
                            return (
                              <button
                                key={slotTime}
                                onClick={() => setTime(slotTime)}
                                disabled={isDisabled}
                                className={`py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-bold rounded-lg border transition-all duration-300
                                  ${time === slotTime 
                                    ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-105' 
                                    : isDisabled 
                                      ? 'bg-zinc-900 text-zinc-600 border-transparent cursor-not-allowed' 
                                      : 'bg-[#171717] text-white border-zinc-700 hover:border-amber-500 hover:text-amber-500'}`}
                              >
                                {slotTime}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#171717] p-5 md:p-8 rounded-2xl border border-zinc-800 animate-fade-in-up delay-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-base md:text-lg font-heading">4</div>
                  <h3 className="text-xl md:text-2xl font-bold text-white font-heading">İletişim Bilgileri</h3>
                </div>
                <div className="space-y-4 md:space-y-5">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                    <div className="bg-[#0a0a0a] p-3 md:p-4 rounded-xl border border-zinc-800 focus-within:border-amber-500 flex items-center gap-3">
                      <User size={18} className="text-amber-500 flex-shrink-0"/>
                      <input placeholder="Adınız Soyadınız" onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm md:text-base"/>
                    </div>
                    <div className="bg-[#0a0a0a] p-3 md:p-4 rounded-xl border border-zinc-800 focus-within:border-amber-500 flex items-center gap-3">
                      <Phone size={18} className="text-amber-500 flex-shrink-0"/>
                      <input type="tel" placeholder="(5XX) XXX XXXX" value={customerInfo.phone} onChange={handlePhoneChange} className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm md:text-base"/>
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] p-3 md:p-4 rounded-xl border border-zinc-800 focus-within:border-amber-500 flex items-start gap-3">
                    <Scissors size={18} className="text-amber-500 mt-1 flex-shrink-0"/>
                    <textarea placeholder="Kuaförünüze iletmek istediğiniz not..." onChange={e => setCustomerInfo({...customerInfo, note: e.target.value})} className="bg-transparent w-full outline-none text-white h-20 resize-none placeholder-gray-500 text-sm md:text-base"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 md:top-28">
                <div className="bg-[#171717] rounded-2xl border border-amber-500 overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-fade-in-up delay-300">
                  <div className="bg-amber-500 p-4 md:p-6 text-center">
                    <h3 className="text-black font-heading font-bold text-xl md:text-2xl tracking-wider">ÖZET</h3>
                  </div>
                  <div className="p-5 md:p-8 space-y-4 md:space-y-5">
                    <div className="flex justify-between pb-3 md:pb-4 border-b border-zinc-800 text-sm md:text-base">
                      <span className="text-gray-400">Hizmet</span>
                      <span className="font-bold text-white text-right w-1/2 line-clamp-1">{selectedService?.name || "Seçilmedi"}</span>
                    </div>
                    <div className="flex justify-between pb-3 md:pb-4 border-b border-zinc-800 text-sm md:text-base">
                      <span className="text-gray-400">Uzman</span>
                      <span className="font-bold text-white text-right">{selectedStaff?.name || "Farketmez"}</span>
                    </div>
                    <div className="flex justify-between pb-3 md:pb-4 border-b border-zinc-800 text-sm md:text-base">
                      <span className="text-gray-400">Tarih</span>
                      <span className="font-bold text-amber-500">{date ? new Date(date).toLocaleDateString("tr-TR") : "-"} {time ? `| ${time}` : ''}</span>
                    </div>
                    <div className="pt-2 md:pt-4 flex justify-between items-end">
                      <span className="text-gray-400 font-heading tracking-wider text-sm md:text-base">TOPLAM</span>
                      <span className="text-3xl md:text-4xl font-bold text-white font-heading">{selectedService?.price || 0} <span className="text-amber-500 text-xl md:text-2xl">₺</span></span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 pt-0">
                    <button 
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full bg-amber-500 text-black py-3 md:py-4 rounded-xl font-heading font-bold text-lg md:text-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
                    >
                      {submitting ? 'İŞLENİYOR...' : 'ONAYLA'} <ChevronRight size={20}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İLETİŞİM VE HARİTA */}
      <section id="iletisim" className="py-20 md:py-24 bg-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h4 className="text-amber-500 font-heading tracking-widest mb-2 text-sm md:text-base">BİZE ULAŞIN</h4>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-heading">İLETİŞİM & KONUM</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="space-y-8 animate-fade-in-up">
              <div className="bg-[#0a0a0a] p-6 md:p-8 rounded-2xl border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <h3 className="text-xl md:text-2xl font-bold text-white font-heading mb-6 border-b border-zinc-800 pb-4">Salon Bilgileri</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 md:w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-amber-500" size={20}/>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">
                        {shop?.addressTitle || "Açık Adres"}
                      </p>
                      <p className="text-white font-body leading-relaxed text-sm md:text-base">
                        {shop?.fullAddress || shop?.address || "Adres bilgisi henüz eklenmedi."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 md:w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-amber-500" size={20}/>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Telefon</p>
                      <p className="text-white font-body text-base md:text-lg">{shop?.phone || "Telefon numarası henüz eklenmedi."}</p>
                    </div>
                  </div>
                </div>

                <a 
                  href={`https://maps.google.com/?q=$${encodeURIComponent(shop?.address || shop?.shopName || 'Kuaför')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 w-full bg-amber-500 text-black py-3 md:py-4 rounded-xl font-heading font-bold text-lg md:text-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] flex justify-center items-center gap-2"
                >
                  <MapPin size={20}/> YOL TARİFİ AL
                </a>
              </div>
            </div>

            <div className="bg-[#0a0a0a] p-2 rounded-2xl border border-zinc-800 h-full min-h-[300px] md:min-h-[400px] animate-fade-in-up delay-100 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
               <iframe 
                 width="100%" 
                 height="100%" 
                 style={{ borderRadius: '1rem', border: 0, minHeight: '300px' }}
                 loading="lazy" 
                 allowFullScreen 
                 src={`https://maps.google.com/maps?q=$${encodeURIComponent(shop?.address || shop?.shopName || 'Kuaför')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
               ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black pt-16 pb-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-bold tracking-wider text-white">
                {shop?.shopName || "KUAFÖR"}
              </h3>
              <p className="text-gray-400 text-sm font-body leading-relaxed">
                {shop?.tagline || "Premium erkek bakım standartlarını yeniden yazıyoruz. Sadece tıraş değil, bir kimlik tasarımı."}
              </p>
              <div className="flex items-center gap-4 pt-2">
                {shop?.instagram && (
                  <a href={shop.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-zinc-800 transition">
                    <Instagram size={18}/>
                  </a>
                )}
                {shop?.twitter && (
                  <a href={shop.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-zinc-800 transition">
                    <Twitter size={18}/>
                  </a>
                )}
                {shop?.facebook && (
                  <a href={shop.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-zinc-800 transition">
                    <Facebook size={18}/>
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-lg font-bold text-white mb-4 tracking-wide">Hızlı Linkler</h4>
              <ul className="space-y-2 font-body text-sm text-gray-400">
                <li><a href="#hakkimizda" className="hover:text-amber-500 transition">Hakkımızda</a></li>
                <li><a href="#hizmetler" className="hover:text-amber-500 transition">Hizmet Menüsü</a></li>
                <li><a href="#galeri" className="hover:text-amber-500 transition">Galeri / Çalışmalar</a></li>
                <li><a href="#randevu" className="hover:text-amber-500 transition text-white font-bold">Randevu Al</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading text-lg font-bold text-white mb-4 tracking-wide">Çalışma Saatleri</h4>
              <ul className="space-y-3 font-body text-sm text-gray-400">
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span>Pazartesi - Cumartesi</span>
                  <span className="text-white font-bold">{shop?.workStart || "09:00"} - {shop?.workEnd || "20:00"}</span>
                </li>
                <li className="flex justify-between text-red-500 font-bold pt-1">
                  <span>Pazar</span>
                  <span>Kapalı</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading text-lg font-bold text-white mb-4 tracking-wide">İletişim</h4>
              <ul className="space-y-3 font-body text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-amber-500 flex-shrink-0 mt-0.5"/>
                  <div className="flex flex-col">
                    {shop?.addressTitle && <span className="font-bold text-white text-xs uppercase tracking-wider mb-1">{shop.addressTitle}</span>}
                    <span>{shop?.fullAddress || shop?.city || "Adres bilgisi eklenmedi."}</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-amber-500 flex-shrink-0"/>
                  <span className="text-white font-bold">{shop?.phone || "Telefon eklenmedi"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-amber-500 flex-shrink-0"/>
                  <span>{shop?.email || "İletişim e-postası bulunmuyor"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs font-body">
              © {new Date().getFullYear()} {shop?.shopName || "Kuaför"}. Tüm hakları saklıdır.
            </p>
            <p className="text-gray-600 text-xs font-body flex items-center gap-1">
              Powered by <span className="text-amber-500 font-bold font-heading tracking-widest">MUHAMMET KONCA</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}