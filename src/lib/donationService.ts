// src/lib/donationService.ts
import { prisma } from "./prisma";
import { createSnapClient } from "./midtrans";
import { Prisma } from "@prisma/client";

/**
 * Configuration constants
 */
const DONATION_CODE_PREFIX = process.env.DONATION_CODE_PREFIX || "DON";

/**
 * Generate unique invoice number
 */
export function generateInvoiceNumber(prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const finalPrefix = prefix || DONATION_CODE_PREFIX;
  return `${finalPrefix}-${timestamp}-${random}`;
}

/**
 * Prepare Midtrans transaction data
 */
interface MidtransTransactionParams {
  invoiceNumber: string;
  amount: number;
  name?: string;
  phoneNumber?: string | null;
  note?: string | null;
  finishUrl?: string;
  errorUrl?: string;
}

export function prepareMidtransTransaction({
  invoiceNumber,
  amount,
  name,
  phoneNumber,
  note,
  finishUrl,
  errorUrl,
}: MidtransTransactionParams) {
  const transaction = {
    transaction_details: {
      order_id: invoiceNumber,
      gross_amount: Math.round(amount), // Ensure integer
    },
    customer_details: {
      first_name: name,
      phone: phoneNumber || undefined,
    },
    callbacks: {
      finish:
        finishUrl || `${process.env.NEXT_PUBLIC_APP_URL}/donasi/terima-kasih`,
      error: errorUrl || `${process.env.NEXT_PUBLIC_APP_URL}/donasi`,
    },
    custom_field1: note || "",
    item_details: [
      {
        id: "donation-001",
        price: Math.round(amount),
        quantity: 1,
        name: "Donasi",
      },
    ],
  };

  return transaction;
}

/**
 * Create donation invoice and initiate Midtrans payment
 */
interface CreateInvoiceParams {
  name: string;
  phoneNumber?: string | null;
  note?: string | null;
  amount: number;
  finishUrl?: string;
  errorUrl?: string;
  postSlug?: string;
  postCode?: string;
}

export async function createInvoiceDonation(params: CreateInvoiceParams) {
  try {
    // 1. Resolve prefix from post code or slug
    let prefix = DONATION_CODE_PREFIX;

    if (params.postCode) {
      prefix = params.postCode;
    } else if (params.postSlug) {
      const post = await prisma.neo_posts.findFirst({
        where: {
          post_name: params.postSlug,
        },
        select: {
          code: true,
        },
      });
      if (post?.code) {
        prefix = post.code;
      }
    }

    // 2. Generate invoice number
    const invoiceNumber = generateInvoiceNumber(prefix);

    // 3. Prepare Midtrans transaction
    const midtransTransaction = prepareMidtransTransaction({
      invoiceNumber,
      amount: params.amount,
      name: params.name,
      phoneNumber: params.phoneNumber,
      note: params.note,
      finishUrl: params.finishUrl,
      errorUrl: params.errorUrl,
    });

    // 4. Create Midtrans Snap transaction
    const snap = createSnapClient();
    const snapResponse = await snap.createTransaction(midtransTransaction);

    // 5. Store donation in database
    const donation = await prisma.neo_donation_public.create({
      data: {
        invoice_number: invoiceNumber,
        name: params.name ?? "Hamba Allah",
        phone_number: params.phoneNumber,
        note: params.note,
        amount: new Prisma.Decimal(params.amount),
        payment_link: snapResponse.redirect_url,
        status: "pending",
      },
    });

    return {
      success: true,
      message: "Transaction created successfully",
      redirect_url: snapResponse.redirect_url,
      token: snapResponse.token,
      donation,
    };
  } catch (error) {
    console.error("createInvoiceDonation error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? `Gagal memproses donasi: ${error.message}`
          : "Gagal memproses donasi",
      redirect_url: params.errorUrl || "/donations",
    };
  }
}

/**
 * Check if donation exists by order ID
 */
export async function checkDonationByOrderId(invoiceNumber: string) {
  return await prisma.neo_donation_public.findFirst({
    where: {
      invoice_number: invoiceNumber,
      deleted_at: null,
    },
  });
}

/**
 * Update donation status from webhook
 */
/**
 * Update donation status from webhook with idempotency check
 */
export async function updateStatusByWebhook(
  invoiceNumber: string,
  newStatus: "pending" | "settled" | "expired" | "failed"
) {
  // 1. Get current donation status
  const donation = await prisma.neo_donation_public.findFirst({
    where: {
      invoice_number: invoiceNumber,
      deleted_at: null,
    },
    select: {
      status: true,
    },
  });

  if (!donation) return null;

  // 2. If current status is settled, don't update to anything else
  // Once settled, it's final.
  if (donation.status === "settled") {
    console.log(
      `ℹ️ Donation ${invoiceNumber} is already settled. Skipping update.`
    );
    return { skipped: true, status: donation.status };
  }

  // 3. If new status is the same as current status, skip
  if (donation.status === newStatus) {
    console.log(
      `ℹ️ Donation ${invoiceNumber} already has status: ${newStatus}. Skipping update.`
    );
    return { skipped: true, status: donation.status };
  }

  // 4. Update the status
  return await prisma.neo_donation_public.updateMany({
    where: {
      invoice_number: invoiceNumber,
      deleted_at: null,
    },
    data: {
      status: newStatus,
      updated_at: new Date(),
    },
  });
}

/**
 * Map Midtrans transaction status to our donation status
 */
export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string
): "pending" | "settled" | "expired" | "failed" {
  // Mapping based on Midtrans documentation
  if (transactionStatus === "capture") {
    if (fraudStatus === "accept") {
      return "settled";
    }
    return "pending";
  } else if (transactionStatus === "settlement") {
    return "settled";
  } else if (
    transactionStatus === "cancel" ||
    transactionStatus === "deny" ||
    transactionStatus === "expire"
  ) {
    return transactionStatus === "expire" ? "expired" : "failed";
  } else if (transactionStatus === "pending") {
    return "pending";
  }

  return "pending";
}
