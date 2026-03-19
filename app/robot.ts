import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/dashboard/', 
        '/api/',
        '/*/settings'
      ],
    },
    sitemap: 'https://planin.com.tr/sitemap.xml',
  };
}