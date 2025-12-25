import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { SettingUpdateSchema } from "@/types/settingSchema";

// ====== GET /api/settings/[id] ======
export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { status: false, message: "ID Setting tidak valid" },
        { status: 400 }
      );
    }

    const setting = await prisma.settings.findUnique({
      where: { id },
    });

    if (!setting) {
      return NextResponse.json(
        { status: false, message: "Setting tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "Data Setting berhasil diambil",
        data: setting,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/settings/[id] error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Setting" },
      { status: 500 }
    );
  }
}

// ====== PUT /api/settings/[id] ======
export const PUT = wrap(
  async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return setResponse(null, "ID Setting tidak valid", 400);
    }

    const body = await req.json();
    const parsed = SettingUpdateSchema.parse(body);

    const existing = await prisma.settings.findUnique({
      where: { id },
    });

    if (!existing) {
      return setResponse(null, "Setting tidak ditemukan", 404);
    }

    const updated = await prisma.settings.update({
      where: { id },
      data: {
        key: parsed.key,
        label: parsed.label,
        type: parsed.type,
        value: parsed.value,
      },
    });

    return setResponse(updated, "Setting berhasil diupdate", 200);
  }
);

// ====== DELETE /api/settings/[id] ======
export const DELETE = wrap(
  async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return setResponse(null, "ID Setting tidak valid", 400);
    }

    const existing = await prisma.settings.findUnique({
      where: { id },
    });

    if (!existing) {
      return setResponse(null, "Setting tidak ditemukan", 404);
    }

    await prisma.settings.delete({
      where: { id },
    });

    return setResponse(null, "Setting berhasil dihapus", 200);
  }
);
