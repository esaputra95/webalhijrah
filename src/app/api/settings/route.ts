import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { SettingCreateSchema } from "@/types/settingSchema";

// ====== Allowed Sort Fields ======
const ALLOWED_SORT: Record<string, true> = {
  key: true,
  label: true,
  type: true,
};

// ====== Parse Pagination & Filters ======
function parsePagination(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  // Pagination
  const page = Math.max(parseInt(sp.get("page") || "1", 10), 1);
  const take = Math.min(
    100,
    Math.max(parseInt(sp.get("limit") || "100", 10), 1)
  );
  const skip = (page - 1) * take;

  // Sorting
  const sortby = sp.get("sortby") || "key";
  const sortdir =
    (sp.get("sort") || "desc").toLowerCase() === "asc" ? "asc" : "desc";
  const orderBy = ALLOWED_SORT[sortby]
    ? { [sortby]: sortdir }
    : { key: "desc" as const };

  // Filters
  const key = (sp.get("key") || "").trim();
  const label = (sp.get("label") || "").trim();
  const type = (sp.get("type") || "").trim();

  const where: Prisma.settingsWhereInput = {
    AND: [
      {
        key: key ? { contains: key } : undefined,
        label: label ? { contains: label } : undefined,
        type: type ? { contains: type } : undefined,
      },
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/settings ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, settings] = await Promise.all([
      prisma.settings.count({ where }),
      prisma.settings.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    const totalPage = Math.max(1, Math.ceil(count / take));
    const nextPage = page * take < count ? page + 1 : null;

    return NextResponse.json(
      {
        status: true,
        message: "Data Settings berhasil diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: settings,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data Settings" },
      { status: 500 }
    );
  }
}

// ====== POST /api/settings ======
export const POST = wrap(async (req: Request) => {
  const body = await req.json();
  const parsed = SettingCreateSchema.parse(body);

  const created = await prisma.settings.create({
    data: {
      key: parsed.key,
      label: parsed.label,
      type: parsed.type,
      value: parsed.value,
    },
  });

  return setResponse(created, "Setting berhasil dibuat", 201);
});
