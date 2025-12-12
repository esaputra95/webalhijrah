import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  type UserRole = "ADMIN" | "USER" | "Gubernur" | string;

  interface Session {
    user: {
      id: number;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    name: string | null;
    email: string | null;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: number;
    role: UserRole;
  }
}
