// src/app/api/donations/[id]/route.ts
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { DonationUpdateSchema } from "@/types/donationSchema";
import { NextRequest } from "next/server";

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  invoice_number: true,
  name: true,
  phone_number: true,
  note: true,
  amount: true,
  payment_link: true,
  status: true,
  created_at: true,
  updated_at: true,
} as const;

// ====== GET /api/donations/[id] ======
export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const donation = await prisma.neo_donation_public.findFirst({
      where: {
        id: Number(id),
        deleted_at: null, // Exclude soft-deleted
      },
      select: SELECT_FIELDS,
    });

    if (!donation) {
      throw new AppError("Donation tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(donation, "Detail Donation");
  }
);

// ====== PUT /api/donations/[id] ======
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = DonationUpdateSchema.parse(body);

    // Check if exists and not deleted
    const exists = await prisma.neo_donation_public.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });
    if (!exists) {
      throw new AppError("Donation tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Build update data
    const data: Record<string, unknown> = {};
    if (parsed.invoice_number !== undefined)
      data.invoice_number = parsed.invoice_number;
    if (parsed.name !== undefined) data.name = parsed.name;
    if (parsed.phone_number !== undefined)
      data.phone_number = parsed.phone_number;
    if (parsed.note !== undefined) data.note = parsed.note;
    if (parsed.amount !== undefined) data.amount = parsed.amount;
    if (parsed.payment_link !== undefined)
      data.payment_link = parsed.payment_link;
    if (parsed.status !== undefined) data.status = parsed.status;

    const updated = await prisma.neo_donation_public.update({
      where: { id: Number(id) },
      data,
      select: SELECT_FIELDS,
    });

    return setResponse(updated, "Donation berhasil diupdate");
  }
);

// ====== DELETE /api/donations/[id] (Soft Delete) ======
export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const exists = await prisma.neo_donation_public.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });
    if (!exists) {
      throw new AppError("Donation tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Soft delete
    const deleted = await prisma.neo_donation_public.update({
      where: { id: Number(id) },
      data: { deleted_at: new Date() },
      select: { id: true, name: true, invoice_number: true },
    });

    return setResponse(deleted, "Donation berhasil dihapus");
  }
);
