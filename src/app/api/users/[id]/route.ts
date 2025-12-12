// app/api/users/[id]/route.ts
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextRequest } from "next/server";

const UpdateSchema = z
  .object({
    name: z.string().min(1).max(150).optional(),
    email: z.string().email().max(150).optional(),
    role: z.string().max(50).nullable().optional(),
    password: z.string().min(6).max(255).optional(),
  })
  .strict();

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
  }
);

// PUT /api/users/[id]
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();

    const parsed = UpdateSchema.parse(body);

    // hanya ambil field yang dikirim
    const data: Record<string, unknown> = {};
    if (parsed.name !== undefined) data.name = parsed.name;
    if (parsed.email !== undefined) data.email = parsed.email;
    if (parsed.role !== undefined) data.role = parsed.role;
    if (parsed.password !== undefined) {
      // ⚠️ sebaiknya hash password di sini
      data.password = parsed.password;
    }

    const exists = await prisma.users.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("User tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
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
  }
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
  }
);
