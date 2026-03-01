"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

      const res = await fetch("https://konca-saas-backend.onrender.com/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, []);

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

  // O güne ait randevuları bul
  const getAppointmentsForDay = (day: number) => {
    return appointments.filter(app => {
      const appDate = new Date(app.dateTime);
      return (
        appDate.getDate() === day &&
        appDate.getMonth() === currentMonth &&
        appDate.getFullYear() === currentYear
      );
    });
  };

  if (loading) return <div className="p-10 text-white">Takvim Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Üst Başlık */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-400">
          {monthNames[currentMonth]} {currentYear}
        </h1>
        <button 
          onClick={() => router.push("/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
        >
          &larr; Panele Dön
        </button>
      </div>

      {/* Takvim Izgarası */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-400 font-bold">
        <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div><div>Paz</div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Boş kutular (Ayın başındaki boşluklar) */}
        {Array.from({ length: startingSlot }).map((_, i) => (
          <div key={`empty-${i}`} className="h-32 bg-gray-800/50 rounded-lg"></div>
        ))}

        {/* Günler */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayAppointments = getAppointmentsForDay(day);
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

          return (
            <div key={day} className={`h-32 bg-gray-800 rounded-lg p-2 border ${isToday ? 'border-blue-500' : 'border-gray-700'} overflow-y-auto`}>
              <div className="text-right text-gray-500 text-sm mb-1">{day}</div>
              
              <div className="space-y-1">
                {dayAppointments.map(app => (
                  <div key={app.id} className="text-xs p-1 bg-blue-600/20 text-blue-200 rounded truncate">
                    {new Date(app.dateTime).toLocaleTimeString("tr-TR", {hour: '2-digit', minute:'2-digit'})} - {app.customer?.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}