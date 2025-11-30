// app/login/page.tsx
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function Page(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const raw =
    typeof searchParams.callbackUrl === "string"
      ? searchParams.callbackUrl
      : undefined;

  // Bersihkan kondisi buruk DI SERVER (stabil di prod/build)
  if (raw !== undefined) {
    const val = raw.trim();

    // kosong -> buang
    if (val === "") {
      redirect("/login");
    }

    try {
      const url = val.startsWith("http")
        ? new URL(val)
        : new URL(val, process.env.NEXTAUTH_URL ?? "http://localhost:3000");
      const isAuthPath = url.pathname.startsWith("/api/auth");
      const isLogin = url.pathname === "/login";

      // jika bukan same-origin, atau mengarah ke /login atau /api/auth -> buang
      const sameOrigin =
        url.origin === (process.env.NEXTAUTH_URL ?? "http://localhost:3000");
      if (!sameOrigin || isLogin || isAuthPath) {
        redirect("/login");
      }
    } catch {
      // kalau parse gagal dan bukan path internal yang valid -> buang
      if (!(val.startsWith("/") && !val.startsWith("/login"))) {
        redirect("/login");
      }
    }
  }

  return <LoginClient />;
}
