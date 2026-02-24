import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nama tidak boleh kosong").max(150),
  email: z.string().email("Format email tidak valid").max(150),
  role: z.string().max(50).nullable().optional(),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(255)
    .optional(),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export type UserType = z.infer<typeof UserSchema>;

// Public-facing type (includes id)
export type UserPublicType = UserType & { id: number };

// Input types for create/update
export type UserCreateInputType = Omit<
  UserType,
  "id" | "created_at" | "updated_at"
>;
export type UserUpdateInputType = UserCreateInputType & { id: number };
