import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/app/uploads";

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  // Images
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",

  // Documents
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Default
  "": "application/octet-stream",
};

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPES[ext] || MIME_TYPES[""];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;

    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Join path segments
    const requestedPath = pathSegments.join("/");

    // Security: Prevent directory traversal attacks
    const normalizedPath = path.normalize(requestedPath);
    if (normalizedPath.includes("..") || path.isAbsolute(normalizedPath)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Construct full file path
    const filePath = path.join(UPLOAD_DIR, normalizedPath);

    // Check if file exists
    try {
      const stats = await fs.stat(filePath);

      if (!stats.isFile()) {
        return NextResponse.json({ error: "Not a file" }, { status: 404 });
      }
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file and return with proper headers
    const fileBuffer = await fs.readFile(filePath);
    const mimeType = getMimeType(normalizedPath);

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(fileBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${path.basename(
          normalizedPath
        )}"`,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
