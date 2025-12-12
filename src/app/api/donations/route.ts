// src/app/api/donations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { DonationCreateSchema } from "@/types/donationSchema";

// ====== Allowed Sort Fields ======
const ALLOWED_SORT: Record<string, true> = {
  invoice_number: true,
  name: true,
  amount: true,
  status: true,
  created_at: true,
  updated_at: true,
};

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

// ====== Parse Pagination & Filters ======
function parsePagination(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  // Pagination
  const page = Math.max(parseInt(sp.get("page") || "1", 10), 1);
  const take = Math.min(
    100,
    Math.max(parseInt(sp.get("limit") || "10", 10), 1)
  );
  const skip = (page - 1) * take;

  // Sorting
  const sortby = sp.get("sortby") || "created_at";
  const sortdir =
    (sp.get("sort") || "desc").toLowerCase() === "asc" ? "asc" : "desc";
  const orderBy = ALLOWED_SORT[sortby]
    ? { [sortby]: sortdir }
    : { created_at: "desc" as const };

  // Filters
  const q = (sp.get("q") || "").trim();
  const status = (sp.get("status") || "").trim();
  const name = (sp.get("name") || "").trim();

  const where: Prisma.neo_donation_publicWhereInput = {
    AND: [
      // Exclude soft-deleted
      { deleted_at: null },
      q
        ? {
            OR: [
              { name: { contains: q } },
              { invoice_number: { contains: q } },
              { phone_number: { contains: q } },
            ],
          }
        : {},
      status
        ? {
            status: {
              equals: status as "pending" | "settled" | "expired" | "failed",
            },
          }
        : {},
      name ? { name: { contains: name } } : {},
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/donations ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, donations] = await Promise.all([
      prisma.neo_donation_public.count({ where }),
      prisma.neo_donation_public.findMany({
        where,
        orderBy,
        skip,
        take,
        select: SELECT_FIELDS,
      }),
    ]);

    const totalPage = Math.max(1, Math.ceil(count / take));
    const nextPage = page * take < count ? page + 1 : null;

    return NextResponse.json(
      {
        status: true,
        message: "Data Donations berhasil diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: donations,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/donations error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Donations" },
      { status: 500 }
    );
  }
}

// ====== POST /api/donations ======
/**
 * Create donation invoice with Midtrans payment integration
 * This endpoint will:
 * 1. Generate unique invoice number
 * 2. Create Midtrans Snap transaction
 * 3. Store donation in database
 * 4. Return payment redirect URL
 */
export const POST = wrap(async (req: Request) => {
  const body = await req.json();

  // Validate input - only need name, amount, phone_number, note
  const validationSchema = DonationCreateSchema.pick({
    name: true,
    amount: true,
    phone_number: true,
    note: true,
  }).partial({ phone_number: true, note: true });

  const parsed = validationSchema.parse(body);

  // Import the service dynamically to avoid circular dependencies
  const { createInvoiceDonation } = await import("@/lib/donationService");

  // Create invoice and Midtrans transaction
  const result = await createInvoiceDonation({
    name: parsed.name,
    amount: parsed.amount,
    phoneNumber: parsed.phone_number,
    note: parsed.note,
  });

  if (!result.success) {
    return NextResponse.json(
      {
        status: false,
        message: result.message,
        redirect_url: result.redirect_url,
      },
      { status: 400 }
    );
  }

  return setResponse(
    {
      donation: result.donation,
      redirect_url: result.redirect_url,
      token: result.token,
    },
    result.message,
    201
  );
});
