/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { CreateSchema } from "./type";
// import { Prisma, ServiceType } from "@prisma/client";
// import { setResponse } from "@/lib/http";
// import { wrap } from "@/lib/errorApi";

// ......

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { status: false, message: "Fitur tidak tersedia" },
    { status: 501 }
  );
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { status: false, message: "Fitur tidak tersedia" },
    { status: 501 }
  );
}
