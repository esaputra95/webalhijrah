import { prisma } from "@/lib/prisma";
import { sendFonnteMessage } from "@/lib/fonnte";
import { NextResponse } from "next/server";

interface Participant {
  name: string;
  phone: string;
  address: string;
  identitas: string;
  umur: string | number;
  gender: string;
  surat_izin?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { participants } = body;

    if (
      !participants ||
      !Array.isArray(participants) ||
      participants.length === 0
    ) {
      return NextResponse.json(
        { ok: false, message: "Data peserta tidak valid" },
        { status: 400 },
      );
    }

    // Validate data for each participant
    for (const p of participants) {
      if (
        !p.name ||
        !p.phone ||
        !p.address ||
        !p.identitas ||
        !p.umur ||
        !p.gender
      ) {
        return NextResponse.json(
          {
            ok: false,
            message: "Semua field harus diisi untuk setiap peserta",
          },
          { status: 400 },
        );
      }
    }

    // Save all participants
    const result = await prisma.itikaf.createMany({
      data: participants.map((p: Participant) => ({
        name: p.name,
        phone: p.phone,
        address: p.address,
        identitas: p.identitas,
        umur: parseInt(p.umur.toString()),
        gender: p.gender,
        surat_izin: p.surat_izin || "",
      })),
    });

    // Send WhatsApp Notifications to unique phone numbers
    try {
      const uniquePhones = Array.from(
        new Set(participants.map((p: Participant) => p.phone)),
      );
      const waMessage = `*Pendaftaran I'tikaf Berhasil!*

Assalamu'alaikum Warahmatullahi Wabarakatuh.
Terima kasih telah mendaftar I'tikaf Ramadhan di Masjid Markaz Al Hijrah Nusantara.

*FASILITAS YANG DISEDIAKAN:*
• Ta'jil & Makan Berbuka, Sahur, Snack Malam
• Pelayanan Kesehatan Ringan
• ID Card & Safety Box

*TATA TERTIB & LARANGAN:*
• Berpakaian Muslim & Rapi
• Selalu memakai ID Card
• Fokus ibadah, bukan main HP/Game
• Dilarang membawa tas > 1 (Satu)
• Dilarang membawa LAPTOP/Notebook
• Dilarang membawa barang berharga

*PENTING:* Barang yang dititipkan di safety box hanya bisa diambil pada akhir hari I'tikaf. Syarat lengkap ada di lokasi.

Jazaakumullahu Khayran.`;

      await sendFonnteMessage(uniquePhones, waMessage);
    } catch (waError) {
      console.error("Failed to send WA notifications:", waError);
    }

    return NextResponse.json(
      {
        ok: true,
        message: `${result.count} peserta berhasil didaftarkan`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Itikaf registration error:", error);
    return NextResponse.json(
      { ok: false, message: "Terjadi kesalahan saat pendaftaran" },
      { status: 500 },
    );
  }
}
