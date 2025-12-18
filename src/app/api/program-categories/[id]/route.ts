import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { ProgramCategoryCreateSchema } from "@/types/programCategorySchema";
import { NextRequest } from "next/server";

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  title: true,
  description: true,
  userCreate: true,
  account: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ====== GET /api/program-categories/[id] ======
export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const category = await prisma.program_categories.findUnique({
      where: { id: Number(id) },
      select: SELECT_FIELDS,
    });

    if (!category) {
      throw new AppError("Program Category tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(category, "Detail Program Category");
  }
);

// ====== PUT /api/program-categories/[id] ======
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = ProgramCategoryCreateSchema.partial().parse(body);

    // Check if exists
    const exists = await prisma.program_categories.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Program Category tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Build update data
    const data: Record<string, unknown> = {};
    if (parsed.title !== undefined) data.title = parsed.title;
    if (parsed.description !== undefined) data.description = parsed.description;
    if (parsed.userCreate !== undefined) data.userCreate = parsed.userCreate;
    if (parsed.account !== undefined) data.account = parsed.account;

    const updated = await prisma.program_categories.update({
      where: { id: Number(id) },
      data,
      select: SELECT_FIELDS,
    });

    return setResponse(updated, "Program Category berhasil diupdate");
  }
);

// ====== DELETE /api/program-categories/[id] ======
export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const exists = await prisma.program_categories.findUnique({
      where: { id: Number(id) },
    });
    if (!exists) {
      throw new AppError("Program Category tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const deleted = await prisma.program_categories.delete({
      where: { id: Number(id) },
      select: { id: true, title: true },
    });

    return setResponse(deleted, "Program Category berhasil dihapus");
  }
);
