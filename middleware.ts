import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Eğer gelen adres localhost, normal planin.com.tr veya www.planin.com.tr ise hiçbir şey yapma, normal çalışsın
  if (
    hostname.includes('localhost') || 
    hostname === 'planin.com.tr' || 
    hostname === 'www.planin.com.tr'
  ) {
    return NextResponse.next();
  }

  // EĞER BİR ALT DOMAİN GİRDİYSE (Örn: kuafor.planin.com.tr)
  // Domain'in ilk kısmını alıyoruz -> 'kuafor'
  const subdomain = hostname.split('.')[0];

  // Adres çubuğunda "kuafor.planin.com.tr" yazmaya devam eder ama arkada senin /salon/[slug] sayfanı çalıştırır!
  return NextResponse.rewrite(new URL(`/salon/${subdomain}${url.pathname}`, req.url));
}

export const config = {
  matcher: [
    // API isteklerini, resimleri ve sistem dosyalarını bu yönlendirmeden muaf tutuyoruz
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};