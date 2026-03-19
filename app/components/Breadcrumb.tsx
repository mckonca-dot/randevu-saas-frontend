import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  // Google için yapılandırılmış veri (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://planin.com.tr${item.href}`
    }))
  };

  return (
    <nav className="flex py-4 text-sm text-gray-500 container mx-auto px-4" aria-label="Breadcrumb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" className="hover:text-black">Ana Sayfa</Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <Link href={item.href} className="hover:text-black capitalize">
              {item.label.replace(/-/g, ' ')}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}