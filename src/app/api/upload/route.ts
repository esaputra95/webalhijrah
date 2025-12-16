// app/api/local-upload/route.ts
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs"; // penting: pakai Node, bukan Edge
export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",

  // Text (for testing)
  "text/plain",
]);

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/app/uploads";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll("file"); // name field = "file" (bisa multiple)

    if (!files.length) {
      return NextResponse.json(
        { ok: false, message: "Tidak ada file" },
        { status: 400 }
      );
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const saved: Array<{
      originalName: string;
      storedName: string;
      url: string;
      size: number;
      type: string;
    }> = [];

    for (const f of files) {
      if (!(f instanceof File)) continue;
      if (!ALLOWED.has(f.type)) {
        return NextResponse.json(
          { ok: false, message: `Tipe tidak diizinkan: ${f.type}` },
          { status: 400 }
        );
      }

      const bytes = Buffer.from(await f.arrayBuffer());
      const ext = path.extname(f.name) || guessExtFromMime(f.type);
      const storedName = `${Date.now()}-${randomUUID()}${ext}`;
      const filePath = path.join(UPLOAD_DIR, storedName);

      await fs.writeFile(filePath, bytes);

      saved.push({
        originalName: f.name,
        storedName,
        url: `/api/files/${storedName}`,
        size: bytes.length,
        type: f.type,
      });
    }

    return NextResponse.json({ ok: true, files: saved }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Upload gagal" },
      { status: 500 }
    );
  }
}

function guessExtFromMime(mime: string) {
  switch (mime) {
    // docs
    case "application/pdf":
      return ".pdf";
    case "application/msword":
      return ".doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return ".docx";

    // images
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "image/svg+xml":
      return ".svg";

    default:
      return "";
  }
}
