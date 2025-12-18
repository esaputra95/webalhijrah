import { wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { DonationCreateSchema } from "@/types/donationSchema";
import { NextRequest } from "next/server";

// ====== POST /api/donation-master ======
/**
 * Create donation manually for admins (Without Midtrans)
 * This endpoint will:
 * 1. Generate unique invoice number
 * 2. Store donation in database directly with status 'settled' (or pending if preferred, but usually manual entry implies settlement)
 */
export const POST = wrap(async (req: NextRequest) => {
  const body = await req.json();

  // Pick fields we want to allow for manual entry
  const validationSchema = DonationCreateSchema.pick({
    invoice_number: true,
    name: true,
    amount: true,
    phone_number: true,
    note: true,
    status: true,
  }).partial({
    invoice_number: true,
    phone_number: true,
    note: true,
    status: true,
  });

  const parsed = validationSchema.parse(body);

  const invoiceNumber =
    parsed.invoice_number ?? Math.random().toString(5).substring(2, 9);

  const donation = await prisma.neo_donation_public.create({
    data: {
      invoice_number: invoiceNumber,
      name: parsed.name,
      amount: parsed.amount,
      phone_number: parsed.phone_number,
      note: parsed.note,
      status: parsed.status || "settled",
    },
  });

  return setResponse(donation, "Donasi manual berhasil dibuat", 201);
});
