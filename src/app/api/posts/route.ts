// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { PostCreateSchema } from "@/types/postSchema";

// ====== Allowed Sort Fields ======
const ALLOWED_SORT: Record<string, true> = {
  post_title: true,
  post_status: true,
  post_type: true,
  created_at: true,
  updated_at: true,
};

// ====== Select Fields ======
const SELECT_FIELDS = {
  id: true,
  post_title: true,
  post_excerpt: true,
  post_name: true,
  post_content: true,
  post_status: true,
  post_type: true,
  post_mime_type: true,
  user_id: true,
  post_category_id: true,
  created_at: true,
  updated_at: true,
  post_image: true,
  date: true,
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
  const post_status = (sp.get("post_status") || "").trim();
  const post_type = (sp.get("post_type") || "").trim();

  const where: Prisma.neo_postsWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { post_title: { contains: q } },
              { post_name: { contains: q } },
              { post_excerpt: { contains: q } },
            ],
          }
        : {},
      post_status ? { post_status: { equals: post_status } } : {},
      post_type ? { post_type: { equals: post_type } } : {},
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/posts ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, posts] = await Promise.all([
      prisma.neo_posts.count({ where }),
      prisma.neo_posts.findMany({
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
        message: "Data Posts berhasil diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: posts,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Posts" },
      { status: 500 }
    );
  }
}

// ====== POST /api/posts ======
export const POST = wrap(async (req: Request) => {
  const body = await req.json();
  const parsed = PostCreateSchema.parse(body);

  const created = await prisma.neo_posts.create({
    data: {
      post_title: parsed.post_title,
      post_excerpt: parsed.post_excerpt,
      post_name: parsed.post_name,
      post_content: parsed.post_content,
      post_status: parsed.post_status,
      post_type: parsed.post_type,
      post_mime_type: parsed.post_mime_type,
      user_id: parsed.user_id,
      post_category_id: parsed.post_category_id,
      post_image: parsed.post_image,
      date: parsed.date ? new Date(parsed.date) : null,
    },
    select: SELECT_FIELDS,
  });

  return setResponse(created, "Post berhasil dibuat", 201);
});
