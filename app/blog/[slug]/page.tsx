import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/app/components/Breadcrumb'; // Yolu kendi yapına göre düzelt (../../../components/Breadcrumb gibi)

interface Props {
  params: Promise<{ slug: string }>;
}

// 🎯 1. SEO METADATA: Makale başlığına göre dinamik ayarlar
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/blog/${slug}`);
    if (!res.ok) return { title: 'Blog Yazısı Bulunamadı' };
    const post = await res.json();

    return {
      title: `${post.title} | Planın Blog`,
      description: post.excerpt || post.title,
      alternates: { canonical: `https://planin.com.tr/blog/${slug}` },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `https://planin.com.tr/blog/${slug}`,
        type: 'article',
        images: [{ url: post.coverImage || '/blog-default.jpg' }],
        publishedTime: post.createdAt,
        authors: ['Planın Editör'],
      },
    };
  } catch {
    return { title: 'Blog | Planın' };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Backend'den blog verisini çek (ISR: 1 saat cache)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/blog/${slug}`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) notFound();
  const post = await res.json();

  // 🎯 2. STRUCTURED DATA: Google "Makale" Şeması
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImage,
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "author": { "@type": "Organization", "name": "Planın" },
    "description": post.excerpt
  };

  return (
    <article className="min-h-screen bg-white pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Üst Navigasyon */}
      <div className="bg-gray-50 border-b border-gray-100 mb-8">
        <Breadcrumb 
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title, href: `/blog/${slug}` }
          ]} 
        />
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Başlık Grubu */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
            <time>{new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
            <span>•</span>
            <span>5 dk okuma</span>
          </div>
        </header>

        {/* Ana Görsel */}
        <div className="relative h-[300px] md:h-[500px] w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
          <Image 
            src={post.coverImage || '/blog-placeholder.jpg'} 
            alt={post.title} 
            fill 
            priority 
            className="object-cover" 
          />
        </div>

        {/* Makale İçeriği */}
        <div 
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed 
          prose-headings:font-black prose-headings:text-gray-900 prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* 🚀 SEO HAMLESİ: İç Linkleme (Dükkanlara Yönlendir) */}
        <div className="mt-16 p-8 bg-black rounded-3xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Bu stili beğendin mi?</h3>
          <p className="text-gray-400 mb-6">Sana en yakın profesyonel kuaförü bul ve hemen randevunu al.</p>
          <Link 
            href="/duzce/merkez" 
            className="inline-block bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            Hemen Randevu Al →
          </Link>
        </div>
      </div>
    </article>
  );
}