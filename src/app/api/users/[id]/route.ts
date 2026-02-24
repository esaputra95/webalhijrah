// app/api/users/[id]/route.ts
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UpdateSchema } from "../type";
import { NextRequest } from "next/server";

// GET /api/users/[id]
export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new AppError("User tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(user, "Detail User");
  },
);

// PUT /api/users/[id]
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();

    const parsed = UpdateSchema.parse(body);

    const exists = await prisma.users.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("User tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Check unique email if email is changed
    if (parsed.email && parsed.email !== exists.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email: parsed.email },
      });
      if (emailExists) {
        throw new AppError("Email sudah terdaftar", {
          code: "EMAIL_TAK_UNIK",
          field: "email",
          status: 409,
        });
      }
    }

    // hanya ambil field yang dikirim
    const data: Record<string, unknown> = {};
    if (parsed.name !== undefined) data.name = parsed.name;
    if (parsed.email !== undefined) data.email = parsed.email;
    if (parsed.role !== undefined) data.role = parsed.role;
    if (parsed.password !== undefined && parsed.password !== "") {
      data.password = await bcrypt.hash(parsed.password, 10);
    }

    const updated = await prisma.users.update({
      where: { id: Number(id) },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return setResponse(updated, "User diupdate");
  },
);

// DELETE /api/users/[id]
export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const exists = await prisma.users.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("User tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const deleted = await prisma.users.delete({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true },
    });

    return setResponse(deleted, "User dihapus");
  },
);
