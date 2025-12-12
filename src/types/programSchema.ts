import { z } from "zod";

// ====== Constants ======
const TITLE_MAX = 255;
const NAME_MAX = 255;

// ====== Create Schema ======
export const ProgramCreateSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi").max(TITLE_MAX),
  slug: z.string().trim().min(1, "Slug wajib diisi").max(NAME_MAX),
  content: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  user_id: z.coerce.number().int().optional(),
  program_category_id: z.coerce.number().int().min(1, "Kategori wajib dipilih"),
  image: z.string().trim().min(1, "Gambar wajib diisi"),
  date: z.union([z.string(), z.date()]).nullable().optional(),
});

// ====== Update Schema (all optional) ======
export const ProgramUpdateSchema = z
  .object({
    title: z.string().trim().min(1).max(TITLE_MAX).optional(),
    slug: z.string().trim().min(1).max(NAME_MAX).optional(),
    content: z.string().trim().nullable().optional(),
    description: z.string().trim().nullable().optional(),
    user_id: z.coerce.number().int().optional(),
    program_category_id: z.coerce.number().int().min(1).optional(),
    image: z.string().trim().min(1).optional(),
    date: z.union([z.string(), z.date()]).nullable().optional(),
  })
  .strict();

// ====== Types ======
export type ProgramCreateInput = z.infer<typeof ProgramCreateSchema>;
export type ProgramUpdateInput = z.infer<typeof ProgramUpdateSchema>;
export type ProgramType = {
  id: number;
  title: string | null;
  slug: string | null;
  content: string | null;
  description: string | null;
  user_id: number | null;
  program_category_id: number | null;
  image: string | null;
  date: string | Date | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
};
