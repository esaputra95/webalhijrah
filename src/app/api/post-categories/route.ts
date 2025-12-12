import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { PostCategoryCreateSchema } from "@/types/postCategorySchema";

// ====== Allowed Sort Fields ======
const ALLOWED_SORT: Record<string, true> = {
  title: true,
  created_at: true,
  updated_at: true,
};

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  title: true,
  description: true,
  user_id: true,
  created_at: true,
  updated_at: true,
  type: true,
  users: {
    select: { id: true, name: true, email: true },
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

  const where: Prisma.neo_post_categoriesWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { type: { contains: q } },
            ],
          }
        : {},
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/post-categories ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, categories] = await Promise.all([
      prisma.neo_post_categories.count({ where }),
      prisma.neo_post_categories.findMany({
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
        message: "Data Post Categories berhasil diambil",
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
    console.error("GET /api/post-categories error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Post Categories" },
      { status: 500 }
    );
  }
}

// ====== POST /api/post-categories ======
export const POST = wrap(async (req: Request) => {
  const body = await req.json();
  const parsed = PostCategoryCreateSchema.parse(body);

  const created = await prisma.neo_post_categories.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      user_id: parsed.user_id,
      type: parsed.type,
    },
    select: SELECT_FIELDS,
  });

  return setResponse(created, "Post Category berhasil dibuat", 201);
});
