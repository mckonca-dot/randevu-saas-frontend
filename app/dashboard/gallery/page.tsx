"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Upload, Image as ImageIcon, Plus, Scissors } from "lucide-react";
import Swal from 'sweetalert2';

export default function GalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [modelName, setModelName] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚀 LOGO STATELERİ
  const [logo, setLogo] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
    fetchLogo(); // Sayfa açılınca mevcut logoyu getir
  }, []);

  // 🚀 MEVCUT LOGOYU ÇEKME (DOĞRU ADRES: /users/me)
  const fetchLogo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLogoLoading(true);
      const res = await fetch("https://planin.onrender.com/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const userData = await res.json();
        setLogo(userData.logo);
      }
    } catch (error) {
      console.error("Logo yüklenirken hata oluştu:", error);
    } finally {
      setLogoLoading(false);
    }
  };

  // 🚀 LOGO YÜKLEME VE GÜNCELLEME (DOĞRU ADRES: /users/me)
  const handleLogoChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Logo = reader.result as string;
      setLogoLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("https://planin.onrender.com/users/me", {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ logo: base64Logo })
        });

        if (res.ok) {
          setLogo(base64Logo);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Salon logosu güncellendi! ✨',
            showConfirmButton: false,
            timer: 3000,
            background: '#1f2937',
            color: '#fff'
          });
        } else if (res.status === 413) {
           Swal.fire('Hata', 'Dosya çok büyük! Lütfen daha küçük boyutlu bir resim seçin.', 'error');
        } else {
           throw new Error("Güncelleme başarısız.");
        }
      } catch (err) {
        Swal.fire('Hata', 'Sunucuya ulaşılamadı. Lütfen internetinizi veya backend push durumunu kontrol edin.', 'error');
      } finally {
        setLogoLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- GALERİ İŞLEMLERİ ---
  const fetchGallery = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const res = await fetch("https://planin.onrender.com/gallery", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setImages(await res.json());
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setNewImage(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!newImage) {
      Swal.fire({ icon: 'warning', title: 'Eksik İşlem', text: 'Lütfen bir fotoğraf seçin.', background: '#1f2937', color: '#fff' });
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://planin.onrender.com/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image: newImage, modelName: modelName }) 
      });

      if (res.ok) {
        setNewImage(null);
        setModelName("");
        fetchGallery();
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Galeriye eklendi! 📸', showConfirmButton: false, timer: 3000, background: '#1f2937', color: '#fff' });
      } else if (res.status === 413) {
        Swal.fire('Hata', 'Fotoğraf boyutu çok büyük!', 'error');
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Hata', text: 'Yükleme başarısız.', background: '#1f2937', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Emin misin?',
      text: "Bu fotoğraf silinecek.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Evet, Sil!',
      background: '#1f2937',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://planin.onrender.com/gallery/${id}`, { 
            method: "DELETE", 
            headers: { Authorization: `Bearer ${token}` } 
        });
        if (res.ok) {
           Swal.fire({ title: 'Silindi!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: '#1f2937', color: '#fff' });
           fetchGallery();
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-10 font-sans">
      
      {/* Üst Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
            <ArrowLeft size={24}/>
        </button>
        <div>
            <h1 className="text-2xl font-bold">Görsel Yönetimi</h1>
            <p className="text-gray-400 text-sm">Logonuzu ve çalışma portfolyonuzu güncelleyin.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* LOGO YÖNETİMİ */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-500">
                <Scissors size={20}/> Salon Logosu
            </h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 bg-gray-900 rounded-full border-4 border-amber-500/20 flex items-center justify-center overflow-hidden relative group">
                {logo ? (
                  <img src={logo} className="w-full h-full object-contain p-4"/>
                ) : (
                  <ImageIcon size={48} className="text-gray-700"/>
                )}
                {logoLoading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs">Yükleniyor...</div>
                )}
                
                <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer z-10"/>
                
                {!logoLoading && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                     <span className="text-[10px] font-bold">DEĞİŞTİR</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-500 text-center italic">
                * Kare formatta ve şeffaf (PNG) logolar önerilir.
              </p>
            </div>
          </div>
        </div>

        {/* GALERİ YÖNETİMİ */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Upload size={20} className="text-blue-500"/> Galeriye Ekle
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 bg-gray-900 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                  {newImage ? (
                      <img src={newImage} className="w-full h-full object-cover"/>
                  ) : (
                      <ImageIcon className="text-gray-600"/>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
              </div>
              <div className="flex-1 w-full space-y-4">
                  <input 
                    type="text" 
                    placeholder="Saç Kesim Modeli (Örn: Modern Fade)" 
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white outline-none focus:border-amber-500 transition"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                  />
                  <button 
                    onClick={handleUpload}
                    disabled={loading || !newImage}
                    className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-bold w-full transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'YÜKLENİYOR...' : 'GALERİYE EKLE'}
                    {!loading && <Plus size={18}/>}
                  </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img) => (
                  <div key={img.id} className="group relative aspect-square bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                      <img src={img.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                          <span className="text-white font-bold text-[10px] mb-2">{img.modelName || "Model"}</span>
                          <button onClick={() => handleDelete(img.id)} className="bg-red-600 p-2 rounded-lg text-white hover:bg-red-500 transition w-fit">
                              <Trash2 size={14}/>
                          </button>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}