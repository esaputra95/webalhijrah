// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { CreateSchema } from "./type";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { AppError, wrap } from "@/lib/errorApi";

// ====== Helpers ======
const ALLOWED_SORT: Record<string, true> = {
  name: true,
  email: true,
  role: true,
  created_at: true,
  updated_at: true,
};

function parsePagination(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(parseInt(sp.get("page") || "1", 10), 1);
  const take = Math.min(
    100,
    Math.max(parseInt(sp.get("limit") || sp.get("take") || "10", 10), 1)
  );
  const skip = (page - 1) * take;

  const sortby = sp.get("sortby") || "createdAt";
  const sortdir =
    (sp.get("sort") || "desc").toLowerCase() === "asc" ? "asc" : "desc";
  const orderBy = ALLOWED_SORT[sortby]
    ? { [sortby]: sortdir }
    : { created_at: "desc" as const };

  // filters
  const q = (sp.get("q") || "").trim();
  const name = (sp.get("name") || "").trim();
  const email = (sp.get("email") || "").trim();
  const role = (sp.get("role") || "").trim();

  const where: Prisma.usersWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
              { role: { contains: q } },
            ],
          }
        : {},
      name ? { name: { contains: name } } : {},
      email ? { email: { contains: email } } : {},
      role ? { role: { equals: role } } : {},
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/users ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, users] = await Promise.all([
      prisma.users.count({ where }),
      prisma.users.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      }),
    ]);

    const totalPage = Math.max(1, Math.ceil(count / take));
    const nextPage = page * take < count ? page + 1 : null;

    return NextResponse.json(
      {
        status: true,
        message: "Data Users Berhasil Diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: users,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Users" },
      { status: 500 }
    );
  }
}

// POST /api/users
export const POST = wrap(async (req: Request) => {
  const body = await req.json();
  const parsed = CreateSchema.parse(body); // ZodError otomatis ditangkap wrap()

  // Cek email unik
  const exists = await prisma.users.findUnique({
    where: { email: parsed.email },
  });
  if (exists) {
    throw new AppError("Email sudah terdaftar", {
      code: "EMAIL_TAK_UNIK",
      field: "email",
      status: 409,
    });
  }

  const hashed = await bcrypt.hash(parsed.password, 10);

  const created = await prisma.users.create({
    data: { ...parsed, password: hashed },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });

  return setResponse(created, "User berhasil dibuat", 201);
});
