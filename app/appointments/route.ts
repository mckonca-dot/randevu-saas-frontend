// app/appointments/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto"; // Rastgele token üretmek için

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, serviceId, dateTime } = body;

    // 1. Token Oluştur (Rastgele şifre)
    const actionToken = crypto.randomBytes(20).toString("hex");

    // 2. Randevuyu Kaydet
    const newAppointment = await prisma.appointment.create({
      data: {
        customerId: Number(customerId),
        serviceId: Number(serviceId),
        dateTime: new Date(dateTime),
        status: "BEKLIYOR",
        actionToken: actionToken, // Token'ı buraya kaydediyoruz
      },
      // İlişkili verileri çekiyoruz ki mesajda isim kullanabilelim
      // (Eğer relation tanımlı değilse buraları silmen gerekebilir)
      /* include: {
        customer: true, 
        service: true
      } 
      */
    });

    // 3. Linkleri Hazırla
    const baseUrl = "https://konca-saas-backend.onrender.com"; // Canlıya alınca burayı site adın yap
    const approveLink = `${baseUrl}/api/approve?token=${actionToken}&action=ONAYLA`;
    const cancelLink = `${baseUrl}/api/approve?token=${actionToken}&action=IPTAL`;

    // 4. Mesajı Hazırla (Burada Customer ve Service verilerini veritabanından çektiğini varsayıyorum)
    // Gerçek senaryoda prisma.customer.findUnique ile telefonunu bulmalısın.
    
    const whatsappMessage = `
🔔 *Yeni Randevu İsteği!*

Tarih: ${new Date(dateTime).toLocaleDateString('tr-TR')}
Saat: ${new Date(dateTime).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}

Hızlı İşlem:
✅ *Onayla:* ${approveLink}
❌ *İptal Et:* ${cancelLink}
`;

    // 5. WhatsApp Gönder (Burada kendi fonksiyonunu çağıracaksın)
    console.log("------------------------------------------");
    console.log("📨 ÇALIŞANA GİDECEK WHATSAPP MESAJI:");
    console.log(whatsappMessage);
    console.log("------------------------------------------");

    return NextResponse.json(newAppointment, { status: 201 });

  } catch (error: any) {
    console.error("Randevu oluşturma hatası:", error);
    return NextResponse.json(
      { message: "Randevu oluşturulamadı", error: error.message },
      { status: 500 }
    );
  }
}

// GET metodu (listeleme için) varsa silme, altına bu POST metodunu ekle.
export async function GET() {
    const appointments = await prisma.appointment.findMany();
    return NextResponse.json(appointments);
}