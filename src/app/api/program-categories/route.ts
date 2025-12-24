import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { ProgramCategoryCreateSchema } from "@/types/programCategorySchema";

// ====== Allowed Sort Fields ======
const ALLOWED_SORT: Record<string, true> = {
  title: true,
  createdAt: true,
  updatedAt: true,
};

// ====== Select Fields ======
// We select all logic fields. No relations set up yet.
const SELECT_FIELDS = {
  id: true,
  title: true,
  description: true,
  userCreate: true,
  account: true,
  createdAt: true,
  updatedAt: true,
  image: true,
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
  const sortby = sp.get("sortby") || "createdAt";
  const sortdir =
    (sp.get("sort") || "desc").toLowerCase() === "asc" ? "asc" : "desc";
  const orderBy = ALLOWED_SORT[sortby]
    ? { [sortby]: sortdir }
    : { createdAt: "desc" as const };

  // Filters
  const q = (sp.get("q") || "").trim();

  const where: Prisma.program_categoriesWhereInput = {
    AND: [
      q
        ? {
            OR: [{ title: { contains: q } }, { description: { contains: q } }],
          }
        : {},
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/program-categories ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, categories] = await Promise.all([
      prisma.program_categories.count({ where }),
      prisma.program_categories.findMany({
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
        message: "Data Program Categories berhasil diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: categories,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/program-categories error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Program Categories" },
      { status: 500 }
    );
  }
}

// ====== POST /api/program-categories ======
export const POST = wrap(async (req: Request) => {
  try {
    const body = await req.json();
    const parsed = ProgramCategoryCreateSchema.parse(body);

    const created = await prisma.program_categories.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        userCreate: parsed.userCreate,
        account: parsed.account,
        image: parsed.image,
      },
      select: SELECT_FIELDS,
    });

    return setResponse(created, "Program Category berhasil dibuat", 201);
  } catch (error) {
    console.log({ error });

    return setResponse(error, "Gagal membuat Program Category", 500);
  }
});
