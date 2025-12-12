// src/lib/auth-session.ts
import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null; // sudah ada id & role dari callback
}
