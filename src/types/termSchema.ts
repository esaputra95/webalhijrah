import { z } from "zod";

// ====== Constants ======
const NAME_MAX = 255;
const SLUG_MAX = 255;

// ====== Create Schema ======
export const TermCreateSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(NAME_MAX),
  slug: z.string().trim().min(1, "Slug wajib diisi").max(SLUG_MAX),
});

// ====== Update Schema (all optional) ======
export const TermUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(NAME_MAX).optional(),
    slug: z.string().trim().min(1).max(SLUG_MAX).optional(),
  })
  .strict();

// ====== Types ======
export type TermCreateInput = z.infer<typeof TermCreateSchema>;
export type TermUpdateInput = z.infer<typeof TermUpdateSchema>;
export type TermType = {
  id: string;
  name: string;
  slug: string;
  created_at?: string | null;
  updated_at?: string | null;
};
