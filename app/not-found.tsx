import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <p className="text-2xl font-bold text-gray-800 -mt-8">Aradığınız dükkan burada değil!</p>
      <p className="text-gray-500 mt-4 max-w-md">
        Belki dükkan ismini yanlış yazdınız ya da dükkan sahibi profilini güncelledi. 
        Üzülmeyin, sizin için harika dükkanlarımız var:
      </p>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link 
          href="/" 
          className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition"
        >
          Ana Sayfaya Dön
        </Link>
        <Link 
          href="/duzce/merkez" 
          className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
        >
          Popüler Dükkanlara Bak
        </Link>
      </div>
    </div>
  );
}