"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Upload, Image as ImageIcon, Plus } from "lucide-react";
// 🚀 SWEETALERT2 EKLENDİ
import Swal from 'sweetalert2';

export default function GalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [modelName, setModelName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const res = await fetch("https://konca-saas-backend.onrender.com/gallery", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setImages(await res.json());
  };

  // Fotoğraf Seçme İşlemi
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fotoğrafı Yükleme İşlemi (SweetAlert Toast Entegreli)
  const handleUpload = async () => {
    if (!newImage) {
      Swal.fire({
        icon: 'warning',
        title: 'Eksik İşlem',
        text: 'Lütfen önce yüklemek için bir fotoğraf seçin.',
        confirmButtonColor: '#f59e0b',
        background: '#1f2937',
        color: '#fff'
      });
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://konca-saas-backend.onrender.com/gallery", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ image: newImage, modelName: modelName }) 
      });

      if (res.ok) {
        setNewImage(null);
        setModelName("");
        fetchGallery();
        
        // 🚀 ŞIK VE KÜÇÜK BAŞARI BİLDİRİMİ (TOAST)
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Fotoğraf başarıyla eklendi! 📸',
          showConfirmButton: false,
          timer: 3000,
          background: '#1f2937',
          color: '#fff'
        });
      } else {
        throw new Error("Yükleme reddedildi.");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Fotoğraf yüklenirken bir sorun oluştu.',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  // 🚀 FOTOĞRAF SİLME ONAYI EKLENDİ
  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Emin misin?',
      text: "Bu fotoğrafı galerinizden silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'Vazgeç',
      background: '#1f2937',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch(`https://konca-saas-backend.onrender.com/gallery/${id}`, { 
              method: "DELETE", 
              headers: { Authorization: `Bearer ${token}` } 
          });
          
          if (res.ok) {
             Swal.fire({
                title: 'Silindi!',
                text: 'Fotoğraf galeriden kaldırıldı.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1f2937',
                color: '#fff'
             });
             fetchGallery();
          }
        } catch (error) {
           Swal.fire('Hata!', 'Silme işlemi başarısız.', 'error');
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
            <h1 className="text-2xl font-bold">Galeri Yönetimi</h1>
            <p className="text-gray-400 text-sm">Yaptığınız işleri sergileyin.</p>
        </div>
      </div>

      {/* Yükleme Alanı */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 max-w-2xl shadow-lg">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Upload size={20} className="text-blue-500"/> Yeni Fotoğraf Ekle
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* Fotoğraf Önizleme */}
              <div className="w-32 h-32 bg-gray-900 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                  {newImage ? (
                      <img src={newImage} className="w-full h-full object-cover"/>
                  ) : (
                      <ImageIcon className="text-gray-600"/>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
              </div>

              {/* Form Alanı */}
              <div className="flex-1 w-full space-y-3">
                  <div className="text-sm text-gray-400">
                      Fotoğraf seçmek için kutuya tıklayın. (Max 5MB)
                  </div>
                  
                  {/* Model İsmi Input */}
                  <input 
                    type="text" 
                    placeholder="Model İsmi / Saç Tarzı (Örn: Fade Kesim)" 
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                  />

                  <button 
                    onClick={handleUpload}
                    disabled={loading || !newImage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold w-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                  >
                    {loading ? 'Yükleniyor...' : 'Galeriyi Güncelle'}
                    {!loading && <Plus size={18}/>}
                  </button>
              </div>
          </div>
      </div>

      {/* Galeri Listesi */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
              <div key={img.id} className="group relative aspect-square bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-md">
                  <img src={img.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500"/>
                  
                  {/* Resim Üzerindeki Yazı ve Silme Butonu */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                      {img.modelName && (
                          <span className="text-white font-bold text-sm mb-1 drop-shadow-md">{img.modelName}</span>
                      )}
                      <button onClick={() => handleDelete(img.id)} className="bg-red-600/80 p-2 rounded-lg text-white hover:bg-red-600 transition w-fit">
                          <Trash2 size={16}/>
                      </button>
                  </div>
              </div>
          ))}
          {images.length === 0 && (
              <p className="col-span-full text-gray-500 text-center py-10 bg-gray-800/30 rounded-xl border border-gray-800 border-dashed">
                 Henüz fotoğraf yüklemediniz.
              </p>
          )}
      </div>

    </div>
  );
}