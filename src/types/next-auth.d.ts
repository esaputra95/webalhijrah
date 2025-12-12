import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  type UserRole = "ADMIN" | "USER" | "Gubernur" | string;

  interface Session {
    user: {
      id: string; // Changed from number to string in v5
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Changed from number to string in v5
    name: string | null;
    email: string | null;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string; // Changed from number to string in v5
    role: UserRole;
  }
}
