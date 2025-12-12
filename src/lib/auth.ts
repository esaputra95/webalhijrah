import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds): Promise<User | null> {
        if (!creds?.email || !creds.password) return null;

        const dbUser = await prisma.users.findUnique({
          where: { email: creds.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
          },
        });
        if (!dbUser) return null;

        const ok = await bcrypt.compare(creds.password, dbUser.password);
        if (!ok) return null;

        const user: User = {
          id: Number(dbUser.id),
          name: dbUser.name,
          email: dbUser.email,
          role: "USER", // Default role karena kolom role tidak ada di database
        };
        return user;
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      // 'token' & 'user' sudah diaugment, jadi aman tanpa any
      if (user) {
        token.id = Number(user.id);
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const u = new URL(url, baseUrl);

      // blokir target login & api/auth sebagai tujuan final
      if (u.pathname === "/login" || u.pathname.startsWith("/api/auth")) {
        return `${baseUrl}/login`;
      }

      // bersihkan callbackUrl kosong / menuju login/api/auth / domain lain
      const rawCb = u.searchParams.get("callbackUrl");
      if (rawCb !== null) {
        const empty = rawCb.trim() === "";
        let bad = empty;
        if (!empty) {
          try {
            const cb = rawCb.startsWith("http")
              ? new URL(rawCb)
              : new URL(rawCb, baseUrl);
            const sameOrigin = cb.origin === baseUrl;
            const badPath =
              cb.pathname === "/login" || cb.pathname.startsWith("/api/auth");
            bad = !sameOrigin || badPath;
          } catch {
            bad = true;
          }
        }
        if (bad) u.searchParams.delete("callbackUrl");
      }

      if (u.origin === baseUrl) return u.toString();
      return baseUrl;
    },
  },
};
