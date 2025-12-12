import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: true,
      message: "Data Dashboard Berhasil Diambil (Stub)",
      data: {
        room: [],
        schedule: [],
      },
    },
    { status: 200 }
  );
}
