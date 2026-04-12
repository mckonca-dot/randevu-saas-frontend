"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
// 🚀 SWEETALERT2 EKLENDİ
import Swal from 'sweetalert2';

export default function CalendarPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Bugünün tarihi
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("https://planin.onrender.com/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        } else {
           throw new Error("Veri çekilemedi");
        }
      } catch (error) {
        Swal.fire({
          title: "Hata!",
          text: "Randevular yüklenirken bir sorun oluştu.",
          icon: "error",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#ef4444"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  // Ayın günlerini hesapla
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0: Pazar, 1: Pzt...
  
  // Pazartesi'den başlaması için düzenleme (0=Pazar -> 6, 1=Pzt -> 0)
  const startingSlot = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  // 🚀 Aylar Arası Gezinme
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // O güne ait randevuları bul
  const getAppointmentsForDay = (day: number) => {
    return appointments.filter(app => {
      const appDate = new Date(app.dateTime);
      return (
        appDate.getDate() === day &&
        appDate.getMonth() === currentMonth &&
        appDate.getFullYear() === currentYear &&
        app.status !== 'CANCELLED' // İptal edilenleri takvimde göstermeyelim
      );
    });
  };

  // 🚀 RANDEVU DETAYINI GÖSTEREN ŞIK MODAL
  const handleAppointmentClick = (app: any) => {
    const time = new Date(app.dateTime).toLocaleTimeString("tr-TR", {hour: '2-digit', minute:'2-digit'});
    const date = new Date(app.dateTime).toLocaleDateString("tr-TR");
    
    Swal.fire({
      title: 'Randevu Detayı',
      html: `
        <div style="text-align: left; padding: 10px; font-size: 15px; line-height: 1.6;">
          <p><strong>👤 Müşteri:</strong> <span style="color: #60a5fa">${app.customer?.name || 'Bilinmiyor'}</span></p>
          <p><strong>📞 Telefon:</strong> ${app.customer?.phone || '-'}</p>
          <hr style="border-color: #374151; margin: 10px 0;">
          <p><strong>✂️ Hizmet:</strong> ${app.service?.name || '-'}</p>
          <p><strong>👨‍💼 Personel:</strong> ${app.staff?.name || 'Farketmez'}</p>
          <hr style="border-color: #374151; margin: 10px 0;">
          <p><strong>🗓 Tarih:</strong> ${date} - Saat: <span style="color: #f59e0b; font-weight: bold;">${time}</span></p>
          ${app.customer?.notes ? `<p style="color: #a78bfa; margin-top: 10px;"><strong>📝 Not:</strong> ${app.customer.notes}</p>` : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Kapat',
      background: '#1f2937',
      color: '#e5e7eb'
    });
  };

  if (loading) return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-blue-500 gap-4">
      <Loader2 className="animate-spin" size={48} />
      <p className="font-bold tracking-widest animate-pulse">TAKVİM YÜKLENİYOR...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      
      {/* Üst Başlık ve Kontroller */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition text-sm font-bold border border-gray-700 w-full md:w-auto justify-center"
        >
          <ArrowLeft size={18} /> Panele Dön
        </button>

        <div className="flex items-center gap-4 bg-gray-800 p-2 rounded-xl border border-gray-700 shadow-lg">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-700 rounded-lg transition"><ChevronLeft size={24}/></button>
          <h1 className="text-xl md:text-2xl font-bold text-blue-400 w-40 text-center flex items-center justify-center gap-2">
            <CalendarIcon size={20} className="text-gray-400"/> {monthNames[currentMonth]} {currentYear}
          </h1>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-700 rounded-lg transition"><ChevronRight size={24}/></button>
        </div>
      </div>

      {/* Takvim Izgarası */}
      <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-800 shadow-2xl overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-7 gap-2 mb-4 text-center text-gray-400 font-bold uppercase text-xs tracking-wider">
            <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div><div>Paz</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Boş kutular (Ayın başındaki boşluklar) */}
            {Array.from({ length: startingSlot }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 md:h-32 bg-gray-800/30 rounded-xl border border-gray-800/50"></div>
            ))}

            {/* Günler */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayAppointments = getAppointmentsForDay(day);
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

              return (
                <div key={day} className={`h-24 md:h-32 bg-gray-800 rounded-xl p-2 border transition-all ${isToday ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-gray-700 hover:border-gray-500'} overflow-y-auto custom-scrollbar flex flex-col`}>
                  <div className={`text-right text-sm font-bold mb-2 ${isToday ? 'text-blue-400' : 'text-gray-500'}`}>
                    {day}
                  </div>
                  
                  <div className="space-y-1.5 flex-1">
                    {dayAppointments.map(app => (
                      <div 
                        key={app.id} 
                        onClick={() => handleAppointmentClick(app)}
                        className={`text-xs p-1.5 rounded truncate cursor-pointer transition transform hover:scale-[1.02] border
                          ${app.status === 'CONFIRMED' ? 'bg-blue-600/20 text-blue-300 border-blue-900/50 hover:bg-blue-600/40' : 'bg-yellow-600/20 text-yellow-300 border-yellow-900/50 hover:bg-yellow-600/40'}`}
                      >
                        <span className="font-bold">{new Date(app.dateTime).toLocaleTimeString("tr-TR", {hour: '2-digit', minute:'2-digit'})}</span> - {app.customer?.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
}