import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const dbUser = await prisma.users.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
          },
        });

        if (!dbUser || !dbUser.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, dbUser.password);
        if (!isPasswordValid) {
          return null;
        }

        // Return user object
        return {
          id: String(dbUser.id),
          name: dbUser.name,
          email: dbUser.email,
          role: String(dbUser.role || "USER").toUpperCase(),
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const existingUser = await prisma.users.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const newUser = await prisma.users.create({
            data: {
              email: user.email,
              name: user.name || user.email.split("@")[0],
              password: "", // Google users don't have local password
              role: "USER",
            },
          });
          user.id = String(newUser.id);
          user.role = String(newUser.role || "USER").toUpperCase();
        } else {
          user.id = String(existingUser.id);
          user.role = String(existingUser.role || "USER").toUpperCase();
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // If it's a credentials login, use the id from user object
        // If it's an OAuth login, we should have the DB id from the signIn callback already
        // But to be super safe, let's ensure we have the numeric ID
        if (account?.provider === "google") {
          const dbUser = await prisma.users.findUnique({
            where: { email: user.email as string },
            select: { id: true, role: true },
          });
          if (dbUser) {
            token.id = String(dbUser.id);
            token.role = String(dbUser.role || "USER").toUpperCase();
          }
        } else {
          token.id = user.id as string;
          token.role = String(user.role as string).toUpperCase();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = String(token.role);
      }
      return session;
    },
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // Protect /admins routes
      if (pathname.startsWith("/admins")) {
        const allowedAdminRoles = ["ADMIN", "ADMIN_TAKMIR", "ADMIN_KESANTRIAN"];
        return allowedAdminRoles.includes(auth?.user?.role || "");
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
