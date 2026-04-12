"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Save, Smartphone, CheckCheck, Info, Bell, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("onay");

  // Şablon State'leri
  const [templates, setTemplates] = useState({
    onay: "Merhaba [MUSTERI_ADI],\n\n[TARIH] günü saat [SAAT] için [ISLEM] randevunuz başarıyla oluşturulmuştur. ✂️\n\nBizi tercih ettiğiniz için teşekkür ederiz.\n📍 [DUKKAN_ADI]",
    iptal: "Sayın [MUSTERI_ADI],\n\n[TARIH] - [SAAT] tarihli [ISLEM] randevunuz iptal edilmiştir. Yeni bir randevu oluşturmak için sitemizi ziyaret edebilirsiniz. 😔\n\nİyi günler dileriz.\n📍 [DUKKAN_ADI]",
    hatirlatma: "Merhaba [MUSTERI_ADI]! 🌟\n\nYarın saat [SAAT]'te [ISLEM] randevunuz olduğunu hatırlatmak isteriz. Görüşmek üzere!\n\n📍 [DUKKAN_ADI]"
  });

  // 🚀 Sayfa Yüklendiğinde Veritabanındaki Şablonları Çek
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://planin.onrender.com/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if(data) {
        setTemplates({
          onay: data.msgTemplateOnay || templates.onay,
          iptal: data.msgTemplateIptal || templates.iptal,
          hatirlatma: data.msgTemplateHatirlatma || templates.hatirlatma
        });
      }
    }).catch(err => console.error(err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dinamik Değişkenler
  const variables = [
    { tag: "[MUSTERI_ADI]", desc: "Müşterinin Adı" },
    { tag: "[TARIH]", desc: "Randevu Tarihi" },
    { tag: "[SAAT]", desc: "Randevu Saati" },
    { tag: "[ISLEM]", desc: "Yapılacak İşlem" },
    { tag: "[DUKKAN_ADI]", desc: "Dükkanınızın Adı" },
  ];

  const handleTemplateChange = (e: any) => {
    setTemplates({ ...templates, [activeTab]: e.target.value });
  };

  const insertVariable = (tag: string) => {
    setTemplates({ ...templates, [activeTab]: templates[activeTab as keyof typeof templates] + " " + tag });
  };

  // 🚀 Değişiklikleri Veritabanına (Backend) Kaydet
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      Swal.fire({ 
        title: 'Kaydediliyor...', 
        background: '#171717', 
        color: '#fff', 
        didOpen: () => Swal.showLoading() 
      });

      const res = await fetch("https://planin.onrender.com/users/me/templates", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(templates)
      });

      if (!res.ok) throw new Error("Kaydedilemedi");

      Swal.fire({
        title: "Başarılı!",
        text: "Mesaj şablonlarınız sisteme başarıyla kaydedildi.",
        icon: "success",
        background: "#171717",
        color: "#fff",
        confirmButtonColor: "#f59e0b",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire({ 
        icon: 'error', 
        title: 'Hata', 
        text: 'Kaydedilirken bir sorun oluştu.', 
        background: '#171717', 
        color: '#fff' 
      });
    }
  };

  // WhatsApp Canlı Önizleme İçin Sahte Veri Yerleştirme
  const getPreviewText = (text: string) => {
    return text
      .replace(/\[MUSTERI_ADI\]/g, "Ahmet Yılmaz")
      .replace(/\[TARIH\]/g, "15 Nisan Cuma")
      .replace(/\[SAAT\]/g, "14:30")
      .replace(/\[ISLEM\]/g, "Saç Kesimi & Yıkama")
      .replace(/\[DUKKAN_ADI\]/g, "Konca Kuaför");
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in text-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <MessageSquare className="text-amber-500" size={32} />
            Mesaj Şablonları
          </h1>
          <p className="text-gray-400 mt-1">Müşterilerinize giden otomatik WhatsApp ve SMS metinlerini düzenleyin.</p>
        </div>
        <button onClick={handleSave} className="bg-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Save size={20} /> Değişiklikleri Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL TARAF: EDİTÖR */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB MENÜSÜ */}
          <div className="flex overflow-x-auto bg-[#171717] p-2 rounded-2xl border border-zinc-800 gap-2 hide-scrollbar">
            <button onClick={() => setActiveTab("onay")} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === "onay" ? "bg-amber-500 text-black" : "text-gray-400 hover:bg-zinc-800"}`}>
              <CheckCheck size={18} /> Randevu Onaylandı
            </button>
            <button onClick={() => setActiveTab("hatirlatma")} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === "hatirlatma" ? "bg-amber-500 text-black" : "text-gray-400 hover:bg-zinc-800"}`}>
              <Bell size={18} /> Randevu Hatırlatıcı
            </button>
            <button onClick={() => setActiveTab("iptal")} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === "iptal" ? "bg-amber-500 text-black" : "text-gray-400 hover:bg-zinc-800"}`}>
              <AlertTriangle size={18} /> Randevu İptal Edildi
            </button>
          </div>

          <div className="bg-[#171717] rounded-3xl p-6 border border-zinc-800 shadow-xl">
            <label className="block text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Mesaj İçeriği</label>
            <textarea 
              value={templates[activeTab as keyof typeof templates]} 
              onChange={handleTemplateChange}
              className="w-full h-48 bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition resize-none font-medium leading-relaxed"
              placeholder="Mesajınızı buraya yazın..."
            />

            {/* DİNAMİK DEĞİŞKENLER */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider flex items-center gap-1"><Info size={14}/> Dinamik Etiketler (Tıklayıp Ekleyin)</p>
              <div className="flex flex-wrap gap-2">
                {variables.map((v, i) => (
                  <button 
                    key={i} 
                    onClick={() => insertVariable(v.tag)}
                    title={v.desc}
                    className="bg-zinc-800 hover:bg-amber-500 hover:text-black text-gray-300 text-xs py-2 px-3 rounded-lg font-mono transition-all"
                  >
                    {v.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF: WHATSAPP ÖNİZLEME */}
        <div className="lg:col-span-1 flex justify-center">
          {/* Sahte Telefon Kasası */}
          <div className="w-[300px] h-[600px] bg-black rounded-[40px] border-[8px] border-zinc-800 relative shadow-2xl overflow-hidden flex flex-col">
            {/* Çentik (Notch) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-10"></div>
            
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] text-white p-4 pt-8 flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet" alt="Avatar" className="w-full h-full" />
              </div>
              <div>
                <div className="font-bold text-sm">Ahmet Yılmaz</div>
                <div className="text-[10px] opacity-80">çevrimiçi</div>
              </div>
            </div>

            {/* WhatsApp Chat Arkaplanı */}
            <div className="flex-1 bg-[#efeae2] p-4 flex flex-col justify-end" style={{backgroundImage: "url('https://w0.peakpx.com/wallpaper/508/136/HD-wallpaper-whatsapp-dark-background-texture.jpg')", backgroundSize: "cover", backgroundBlendMode: "multiply", backgroundColor: "#0b141a"}}>
              
              {/* Tarih Etiketi */}
              <div className="flex justify-center mb-4">
                <span className="bg-[#182229] text-gray-300 text-[10px] px-3 py-1 rounded-lg">Bugün</span>
              </div>

              {/* Mesaj Balonu (Giden) */}
              <div className="bg-[#005c4b] text-[#e9edef] p-3 rounded-2xl rounded-tr-none text-sm shadow-sm relative max-w-[90%] self-end break-words whitespace-pre-wrap">
                {getPreviewText(templates[activeTab as keyof typeof templates])}
                <div className="text-[10px] text-gray-400 text-right mt-1 flex justify-end items-center gap-1">
                  14:32 <CheckCheck size={14} className="text-[#53bdeb]"/>
                </div>
                {/* Balon Ucu */}
                <div className="absolute top-0 -right-2 w-4 h-4 bg-[#005c4b]" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }}></div>
              </div>

            </div>

            {/* WhatsApp Footer (Klavye alanı) */}
            <div className="bg-[#202c33] p-3 flex items-center gap-2">
              <div className="bg-[#2a3942] rounded-full flex-1 h-10 flex items-center px-4 text-gray-400 text-sm">
                Mesaj yazın
              </div>
              <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-white">
                <Smartphone size={18} fill="currentColor"/>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}