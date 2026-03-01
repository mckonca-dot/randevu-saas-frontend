// Dosya: frontend/app/api/approve/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const action = searchParams.get('action');

  if (!token) {
    return new NextResponse('Hatalı Link', { status: 400 });
  }

  // Randevuyu bul
  const appointment = await prisma.appointment.findUnique({
    where: { actionToken: token },
  });

  if (!appointment) {
    return new NextResponse('Bu işlem zaten yapılmış veya link geçersiz.', { status: 404 });
  }

  // Durumu güncelle
  const newStatus = action === 'ONAYLA' ? 'CONFIRMED' : 'CANCELLED';
  
  await prisma.appointment.update({
    where: { id: appointment.id },
    data: { 
      status: newStatus,
      actionToken: null // Token silinir, link tek kullanımlık olur
    },
  });

  // Basit HTML Yanıtı
  const color = action === 'ONAYLA' ? 'green' : 'red';
  const text = action === 'ONAYLA' ? 'ONAYLANDI ✅' : 'İPTAL EDİLDİ ❌';

  return new NextResponse(`
    <html>
      <body style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; text-align:center;">
        <h1 style="color:${color}; font-size:3rem;">RANDEVU ${text}</h1>
      </body>
    </html>
  `, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}