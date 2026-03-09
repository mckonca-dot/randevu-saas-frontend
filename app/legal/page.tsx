import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-amber-500 hover:text-yellow-400 mb-8 font-bold">
          <ArrowLeft size={20} /> Ana Sayfaya Dön
        </Link>
        
        <div className="flex items-center gap-4 mb-12 border-b border-zinc-800 pb-8">
          <ShieldCheck size={48} className="text-amber-500" />
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Yasal Bilgiler</h1>
            <p className="text-gray-500 mt-2">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>

        <div className="space-y-16">
          <section id="gizlilik" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-amber-500 mb-4 uppercase tracking-wider">Gizlilik Politikası</h2>
            <p className="mb-4">Konca SaaS ("Şirket", "Biz") olarak kullanıcılarımızın gizliliğine ve kişisel verilerinin güvenliğine büyük önem vermekteyiz. Platformumuz üzerinden toplanan isim, telefon, e-posta gibi bilgiler sadece randevu süreçlerinin kusursuz ilerlemesi için kullanılmaktadır.</p>
            <p>Müşteri verileri, ilgili işletmenin (Kuaför/Salon) veritabanı alanında 256-bit SSL şifreleme yöntemleriyle korunmaktadır. Verileriniz hiçbir şekilde 3. taraf reklam şirketleriyle paylaşılmaz.</p>
          </section>

          <section id="sartlar" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-amber-500 mb-4 uppercase tracking-wider">Kullanım Şartları</h2>
            <p className="mb-4">Bu web sitesini (ve alt alan adlarını) kullanarak aşağıdaki şartları kabul etmiş sayılırsınız:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>İşletmeler, platform üzerinden aldıkları randevuların sorumluluğunu kendileri taşır.</li>
              <li>Abonelik paketleri aylık olarak yenilenir ve iptal edilmediği sürece devam eder.</li>
              <li>Sistemde gerçekleştirilen zararlı işlemler, bot saldırıları ve sahte randevu kayıtları tespit edildiğinde hesaplar uyarısız silinir.</li>
            </ul>
          </section>

          <section id="kvkk" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-amber-500 mb-4 uppercase tracking-wider">KVKK Aydınlatma Metni</h2>
            <p className="mb-4">6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca; Konca SaaS platformuna kayıt olurken veya randevu alırken girdiğiniz telefon numarası ve isim bilgileriniz "Hizmetin İfası" hukuki sebebine dayanarak işlenmektedir.</p>
            <p>Bu veriler, yalnızca tarafınıza WhatsApp/SMS onayı göndermek ve işletme sahibinin randevuyu takip edebilmesi amacıyla kullanılmaktadır. KVKK Madde 11 kapsamındaki haklarınızı kullanmak için destek@koncasaas.com adresine mail atabilirsiniz.</p>
          </section>

          <section id="cerez" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-amber-500 mb-4 uppercase tracking-wider">Çerez (Cookie) Politikası</h2>
            <p>Sitemizin doğru çalışabilmesi (örn. sisteme giriş yaptığınızı hatırlaması) için zorunlu oturum çerezleri kullanmaktayız. Ayrıca sistem performansını ölçmek amacıyla anonim analiz çerezleri kullanılmaktadır. Tarayıcınızın ayarlarından bu çerezleri istediğiniz zaman kapatabilirsiniz ancak bu durum platformun çalışmasını etkileyebilir.</p>
          </section>
        </div>
      </div>
    </div>
  );
}