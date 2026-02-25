const EXCLUDED_PREFIXES = [
  "/api",
  "/admins",
  "/_next",
  "/favicon.ico",
  "/manifest",
  "/uploads",
];

const STATIC_EXCLUDED_PATHS = ["/robots.txt", "/sitemap.xml"];

export function sanitizePath(path: string): string {
  if (!path) return "/";
  const onlyPath = path.split("?")[0] || "/";
  if (onlyPath.length > 1 && onlyPath.endsWith("/")) {
    return onlyPath.slice(0, -1);
  }
  return onlyPath;
}

export function shouldTrackPath(path: string): boolean {
  const cleanPath = sanitizePath(path);

  if (!cleanPath.startsWith("/")) return false;
  if (STATIC_EXCLUDED_PATHS.includes(cleanPath)) return false;

  return !EXCLUDED_PREFIXES.some(
    (prefix) => cleanPath === prefix || cleanPath.startsWith(`${prefix}/`),
  );
}

export function normalizeRouteKey(path: string): string {
  const cleanPath = sanitizePath(path);

  if (/^\/articles\/[^/]+$/.test(cleanPath)) return "/articles/[slug]";
  if (/^\/donasi\/[^/]+$/.test(cleanPath)) return "/donasi/[slug]";
  if (/^\/programs\/[^/]+$/.test(cleanPath)) return "/programs/[id]";
  if (/^\/halaqoh\/register\/[^/]+$/.test(cleanPath))
    return "/halaqoh/register/[id]";
  if (/^\/halaqoh\/registration-success\/[^/]+$/.test(cleanPath))
    return "/halaqoh/registration-success/[id]";
  if (/^\/dashboard\/halaqoh\/[^/]+$/.test(cleanPath))
    return "/dashboard/halaqoh/[id]";

  const segments = cleanPath.split("/");
  const mapped = segments.map((seg, i) => {
    if (i === 0 || seg.length === 0) return seg;
    if (/^\d+$/.test(seg)) return "[id]";
    if (/^[0-9a-f]{24}$/i.test(seg)) return "[id]";
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        seg,
      )
    ) {
      return "[id]";
    }
    return seg;
  });

  return mapped.join("/") || "/";
}
