// src/app/api/donations/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  checkDonationByOrderId,
  updateStatusByWebhook,
  mapMidtransStatus,
} from "@/lib/donationService";

/**
 * Verify Midtrans notification signature
 * This ensures the webhook request is genuinely from Midtrans
 */
function verifySignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    console.error("MIDTRANS_SERVER_KEY not configured");
    return false;
  }

  const { order_id, status_code, gross_amount, signature_key } = payload;

  // Create hash: SHA512(order_id + status_code + gross_amount + ServerKey)
  const hash = crypto
    .createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest("hex");

  return hash === signature_key;
}

/**
 * POST /api/donations/webhook
 * Handles Midtrans payment notification webhook
 *
 * This endpoint will be called by Midtrans when:
 * - Payment is successful
 * - Payment is pending
 * - Payment is failed
 * - Payment is expired
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📥 Midtrans Webhook received:", {
      order_id: body.order_id,
      transaction_status: body.transaction_status,
      fraud_status: body.fraud_status,
    });

    // 1. Verify signature
    const isValid = verifySignature({
      order_id: body.order_id,
      status_code: body.status_code,
      gross_amount: body.gross_amount,
      signature_key: body.signature_key,
    });

    if (!isValid) {
      console.error("❌ Invalid signature from Midtrans webhook");
      return NextResponse.json(
        { status: false, message: "Invalid signature" },
        { status: 403 }
      );
    }

    // 2. Check if donation exists
    const donation = await checkDonationByOrderId(body.order_id);
    if (!donation) {
      console.error(`❌ Donation not found: ${body.order_id}`);
      return NextResponse.json(
        { status: false, message: "Donation not found" },
        { status: 404 }
      );
    }

    // 3. Map Midtrans status to our status
    const newStatus = mapMidtransStatus(
      body.transaction_status,
      body.fraud_status
    );

    // 4. Update donation status
    await updateStatusByWebhook(body.order_id, newStatus);

    console.log(`✅ Donation ${body.order_id} status updated to: ${newStatus}`);

    return NextResponse.json(
      {
        status: true,
        message: "Webhook processed successfully",
        new_status: newStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/donations/webhook (for testing purposes)
 */
export async function GET() {
  return NextResponse.json(
    {
      status: true,
      message: "Midtrans webhook endpoint is active",
      endpoint: "/api/donations/webhook",
      note: "This endpoint accepts POST requests from Midtrans",
    },
    { status: 200 }
  );
}
