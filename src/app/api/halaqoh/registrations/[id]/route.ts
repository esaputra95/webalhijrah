import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { HalaqohRegistrationSchema } from "@/types/halaqohSchema";

export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const registration = await prisma.halaqoh_registrations.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { name: true, email: true } },
        category: true,
      },
    });

    if (!registration) {
      throw new AppError("Pendaftaran tidak ditemukan", { status: 404 });
    }

    return setResponse(registration, "Detail pendaftaran");
  },
);

export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = HalaqohRegistrationSchema.partial().parse(body);

    const updated = await prisma.halaqoh_registrations.update({
      where: { id: Number(id) },
      data: parsed,
    });

    // If status is ACCEPTED, we might want to manually add them to a participant list later,
    // but for now we just update the registration record.

    return setResponse(updated, "Pendaftaran berhasil diperbarui");
  },
);
