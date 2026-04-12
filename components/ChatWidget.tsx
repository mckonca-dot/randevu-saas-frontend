"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

export default function ChatWidget({ shopId }: { shopId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Merhaba! 👋 Ben asistanınız. Sizin için hızlıca bir randevu oluşturabilirim. (Örn: Randevu almak istiyorum)" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // 🚀 DÜZELTME 1: Port 3001 yapıldı ve endpoint /appointments olarak güncellendi
      const res = await fetch(`https://planin.onrender.com/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🚀 DÜZELTME 2: Backend'deki createAppointment fonksiyonunun beklediği veriler gönderiliyor
        body: JSON.stringify({ 
          message: userMsg, // Chat mesajı
          customerId: 1,    // Test için varsayılan müşteri ID (Gerçekte seçimden gelmeli)
          serviceId: 1,     // Test için varsayılan hizmet ID
          staffId: 1,       // Test için varsayılan personel ID
          dateTime: "25.02.2026 15:00", // Test için ileri bir tarih
          userId: Number(shopId)
        }),
      });
      
      if (!res.ok) throw new Error("Bağlantı hatası");

      const data = await res.json();
      
      // Backend başarılıysa asistan onay verir
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "Talebinizi aldım! 🔔 Randevu isteğiniz dükkan sahibine WhatsApp üzerinden iletildi. Onay geldiğinde size bilgi vereceğiz." 
      }]);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Üzgünüm, şu an randevu sistemine ulaşamıyorum. Lütfen daha sonra tekrar deneyin." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* CHAT PENCERESİ */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up flex flex-col h-[500px]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-500 rounded-full text-black"><Bot size={20} /></div>
              <div>
                <h3 className="font-bold text-sm">Kuaför Asistanı</h3>
                <p className="text-[10px] text-gray-300 opacity-80">Online ●</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
              <X size={20} />
            </button>
          </div>

          {/* Mesaj Alanı */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-gray-200 text-gray-500 text-xs px-3 py-2 rounded-full animate-pulse">İşleniyor...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Alanı */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Randevu almak istiyorum..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* BALONCUK BUTONU */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-110 active:scale-95 transition-all duration-300 rounded-full shadow-xl shadow-blue-500/40 flex items-center justify-center text-white"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}