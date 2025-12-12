// src/app/api/terms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { TermCreateSchema } from "@/types/termSchema";

// ====== Allowed Sort Fields ======
const ALLOWED_SORT: Record<string, true> = {
  name: true,
  slug: true,
  created_at: true,
  updated_at: true,
};

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  name: true,
  slug: true,
  created_at: true,
  updated_at: true,
} as const;

// ====== Parse Pagination & Filters ======
function parsePagination(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  // Pagination
  const page = Math.max(parseInt(sp.get("page") || "1", 10), 1);
  const take = Math.min(
    100,
    Math.max(parseInt(sp.get("limit") || "10", 10), 1)
  );
  const skip = (page - 1) * take;

  // Sorting
  const sortby = sp.get("sortby") || "created_at";
  const sortdir =
    (sp.get("sort") || "desc").toLowerCase() === "asc" ? "asc" : "desc";
  const orderBy = ALLOWED_SORT[sortby]
    ? { [sortby]: sortdir }
    : { created_at: "desc" as const };

  // Filters
  const q = (sp.get("q") || "").trim();
  const name = (sp.get("name") || "").trim();
  const slug = (sp.get("slug") || "").trim();

  const where: Prisma.neo_termsWhereInput = {
    AND: [
      q
        ? {
            OR: [{ name: { contains: q } }, { slug: { contains: q } }],
          }
        : {},
      name ? { name: { contains: name } } : {},
      slug ? { slug: { contains: slug } } : {},
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/terms ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, terms] = await Promise.all([
      prisma.neo_terms.count({ where }),
      prisma.neo_terms.findMany({
        where,
        orderBy,
        skip,
        take,
        select: SELECT_FIELDS,
      }),
    ]);

    const totalPage = Math.max(1, Math.ceil(count / take));
    const nextPage = page * take < count ? page + 1 : null;

    return NextResponse.json(
      {
        status: true,
        message: "Data Terms berhasil diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: terms,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/terms error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Terms" },
      { status: 500 }
    );
  }
}

// ====== POST /api/terms ======
export const POST = wrap(async (req: Request) => {
  const body = await req.json();
  const parsed = TermCreateSchema.parse(body);

  const created = await prisma.neo_terms.create({
    data: {
      name: parsed.name,
      slug: parsed.slug,
    },
    select: SELECT_FIELDS,
  });

  return setResponse(created, "Term berhasil dibuat", 201);
});
