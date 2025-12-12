import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { ProgramCreateSchema } from "@/types/programSchema";

// ====== Allowed Sort Fields ======
const ALLOWED_SORT: Record<string, true> = {
  title: true,
  created_at: true,
  updated_at: true,
  date: true,
};

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  title: true,
  slug: true,
  content: true,
  description: true,
  user_id: true,
  program_category_id: true,
  image: true,
  date: true,
  created_at: true,
  updated_at: true,
  programCategories: {
    select: { id: true, title: true },
  },
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
  const slug = sp.get("slug");
  const program_category_id = sp.get("program_category_id");

  const where: Prisma.neo_programsWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q } },
              { slug: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {},
      slug ? { slug: { equals: slug } } : {},
      program_category_id
        ? { program_category_id: parseInt(program_category_id) }
        : {},
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/programs ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, programs] = await Promise.all([
      prisma.neo_programs.count({ where }),
      prisma.neo_programs.findMany({
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
        message: "Data Programs berhasil diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: programs,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/programs error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Programs" },
      { status: 500 }
    );
  }
}

// ====== POST /api/programs ======
export const POST = wrap(async (req: Request) => {
  const body = await req.json();
  const parsed = ProgramCreateSchema.parse(body);

  const created = await prisma.neo_programs.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      content: parsed.content,
      description: parsed.description,
      user_id: parsed.user_id,
      program_category_id: parsed.program_category_id,
      image: parsed.image,
      date: parsed.date ? new Date(parsed.date) : null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    select: SELECT_FIELDS,
  });

  return setResponse(created, "Program berhasil dibuat", 201);
});
