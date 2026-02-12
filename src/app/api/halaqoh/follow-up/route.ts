import { NextRequest, NextResponse } from "next/server";
import { sendFonnteMessage } from "@/lib/fonnte";

export async function POST(req: NextRequest) {
  try {
    const { targets, message } = await req.json();

    if (!targets || !Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json(
        { status: false, reason: "TARGETS_REQUIRED" },
        { status: 400 },
      );
    }

    if (!message) {
      return NextResponse.json(
        { status: false, reason: "MESSAGE_REQUIRED" },
        { status: 400 },
      );
    }

    const result = await sendFonnteMessage(targets, message);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Follow Up API Error:", error);
    return NextResponse.json(
      { status: false, reason: "INTERNAL_SERVER_ERROR", detail: error },
      { status: 500 },
    );
  }
}
