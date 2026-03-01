"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Yönlendirme için

export default function LandingPage() {
  const router = useRouter();
  
  // --- STATE ---
  const images = ["/slide1.png", "/slide2.png", "/slide3.png", "/slide4.png", "/slide5.png", "/slide6.png", "/slide7.png" ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Demo Butonu Yükleniyor Durumu
  const [demoLoading, setDemoLoading] = useState(false);

  // --- SLIDER MANTIĞI ---
  useEffect(() => {
    if (isModalOpen) return;
    const slideInterval = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(slideInterval);
  }, [currentIndex, isModalOpen]);

  const nextSlide = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToSlide = (index: number) => setCurrentIndex(index);

  // --- DEMO GİRİŞ FONKSİYONU (YENİ) ---
  const handleDemoLogin = async () => {
    setDemoLoading(true); // Yükleniyor başlat
    try {
      // Arka planda giriş yap
      const res = await fetch("https://konca-saas-backend.onrender.com/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "demo@konca.com", // <-- Senin oluşturduğun demo maili
          password: "demo123"      // <-- Senin oluşturduğun demo şifresi
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Demo hesabı bulunamadı. Lütfen önce demo@konca.com hesabını oluşturun.");
      }

      // Token'ı kaydet ve yönlendir
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard"); // Direkt panele at
      
    } catch (error: any) {
      alert("Hata: " + error.message);
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-lg">K</div>
            <span className="text-xl font-bold tracking-tight">Konca<span className="text-blue-500">Randevu</span></span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition text-sm font-medium hidden md:block">
              Giriş Yap
            </Link>
            <Link href="/register" className="bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow-lg shadow-white/10">
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 border border-blue-500/30 rounded-full bg-blue-500/10 backdrop-blur-sm">
            <span className="text-blue-400 text-xs font-bold tracking-wider uppercase">✨ Yeni Nesil Randevu Sistemi</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            Randevularınızı <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Otomatiğe Bağlayın</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Telefon trafiğinden kurtulun. Müşterileriniz 7/24 online randevu alsın.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-20">
            
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25">
              Hemen Başla 🚀
            </Link>
            
            {/* DEMO BUTONU (GÜNCELLENDİ) */}
            <button 
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {demoLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Giriliyor...
                </>
              ) : (
                "Demo Hesaba Gir"
              )}
            </button>

          </div>

          {/* SLIDER ALANI */}
          <div className="relative mx-auto max-w-5xl group">
            <div 
              className="relative rounded-2xl border border-gray-800 bg-gray-800/50 p-2 md:p-4 shadow-2xl overflow-hidden aspect-video cursor-zoom-in"
              onClick={() => setIsModalOpen(true)}
              title="Büyütmek için tıklayın"
            >
               <img 
                  src={images[currentIndex]} 
                  alt="Dashboard Slider" 
                  className="rounded-xl w-full h-full object-cover transition-all duration-500 ease-in-out hover:scale-[1.02]"
                />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/20 pointer-events-none">
                  <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm"><span className="text-3xl">🔍</span></div>
               </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              {images.map((_, slideIndex) => (
                <div key={slideIndex} onClick={() => goToSlide(slideIndex)} className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? "bg-blue-500 w-8" : "bg-gray-600 hover:bg-gray-400"}`}></div>
              ))}
            </div>
            
            <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-blue-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-sm">❮</button>
            <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-blue-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-sm">❯</button>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white text-4xl font-bold transition z-50">&times;</button>
          <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 md:left-10 text-white/70 hover:text-blue-500 text-4xl md:text-6xl p-4 transition z-50 select-none">❮</button>
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={images[currentIndex]} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-gray-800" alt="Full Screen Preview" />
          </div>
          <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 md:right-10 text-white/70 hover:text-blue-500 text-4xl md:text-6xl p-4 transition z-50 select-none">❯</button>
          <p className="absolute bottom-6 text-center text-gray-500 text-sm">Kapatmak için boşluğa tıklayın</p>
        </div>
      )}

      {/* ÖZELLİKLER */}
      <section className="py-20 bg-gray-800/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition group"><div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center text-3xl mb-6">📱</div><h3 className="text-xl font-bold mb-3">Online Randevu</h3><p className="text-gray-400">Müşterileriniz uygulama indirmeden web sitenizden randevu alsın.</p></div>
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-green-500/50 transition group"><div className="w-14 h-14 bg-green-900/30 rounded-xl flex items-center justify-center text-3xl mb-6">💬</div><h3 className="text-xl font-bold mb-3">WhatsApp Bildirim</h3><p className="text-gray-400">Randevular otomatik olarak WhatsApp üzerinden bildirilsin.</p></div>
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition group"><div className="w-14 h-14 bg-purple-900/30 rounded-xl flex items-center justify-center text-3xl mb-6">📊</div><h3 className="text-xl font-bold mb-3">Kolay Yönetim</h3><p className="text-gray-400">Personel, hizmet ve kazanç takibi tek bir ekranda.</p></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t border-gray-800 bg-gray-900"><p className="mb-2">© 2026 Konca Randevu Sistemleri.</p></footer>
    </div>
  );
}