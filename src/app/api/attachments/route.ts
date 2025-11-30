// src/app/api/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateSchema } from "./type";
import { Prisma, ServiceType } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";

// ====== Helpers ======
const ALLOWED_SORT: Record<string, true> = {
  name: true,
  createdAt: true,
  updatedAt: true,
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
    : { createdAt: "desc" as const };

  // filters
  const q = (sp.get("q") || "").trim();
  const name = (sp.get("name") || "").trim();
  const type = (sp.get("type") || "").trim();

  const where: Prisma.servicesWhereInput = {
    AND: [
      q
        ? {
            OR: [{ name: { contains: q, mode: "insensitive" } }],
          }
        : {},
      name ? { name: { contains: name, mode: "insensitive" } } : {},
      type ? { type: type as ServiceType } : {},
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/services ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, services] = await Promise.all([
      prisma.services.count({ where }),
      prisma.services.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const totalPage = Math.max(1, Math.ceil(count / take));
    const nextPage = page * take < count ? page + 1 : null;

    return NextResponse.json(
      {
        status: true,
        message: "Data services Berhasil Diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: services,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/services error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data services" },
      { status: 500 }
    );
  }
}

// POST /api/services
export const POST = wrap(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = CreateSchema.parse(body); // ZodError otomatis ditangkap wrap()

  const created = await prisma.services.create({
    data: { ...parsed },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return setResponse(created, "User berhasil dibuat", 201);
});
