// app/api/approve/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // URL'den parametreleri al
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const action = searchParams.get('action');

  if (!token || !action) {
    return new NextResponse('Geçersiz Link.', { status: 400 });
  }

  // Randevuyu bul
  const appointment = await prisma.appointment.findUnique({
    where: { actionToken: token },
  });

  if (!appointment) {
    return new NextResponse('Bu işlem bağlantısı geçersiz veya daha önce kullanılmış.', { status: 404 });
  }

  // Durumu güncelle
  let newStatus = "";
  let message = "";
  let color = "";

  if (action === "ONAYLA") {
    newStatus = "ONAYLANDI";
    message = "Randevu Başarıyla Onaylandı! ✅";
    color = "green";
  } else {
    newStatus = "IPTAL";
    message = "Randevu İptal Edildi. ❌";
    color = "red";
  }

  // Veritabanını güncelle ve token'ı sil (tekrar tıklanmasın diye)
  await prisma.appointment.update({
    where: { id: appointment.id },
    data: { 
      status: newStatus,
      actionToken: null // Token silinir, link tek kullanımlık olur
    },
  });

  // Ekrana Basit Bir HTML Bas
  const html = `
    <html>
      <body style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; text-align:center;">
        <div>
          <h1 style="color:${color}; font-size: 2rem;">${message}</h1>
          <p>Pencereyi kapatabilirsiniz.</p>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}