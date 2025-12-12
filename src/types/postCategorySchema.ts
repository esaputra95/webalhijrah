import { z } from "zod";

// Schema untuk form (tanpa coerce, untuk react-hook-form)
export const PostCategoryFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  user_id: z.number(),
  type: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Schema untuk API (dengan coerce, untuk validation dari API response)
export const PostCategorySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  user_id: z.coerce.number(), // Accept string or number, convert to number
  type: z.string(),
  created_at: z.coerce.date().optional(), // Accept string ISO or Date, convert to Date
  updated_at: z.coerce.date().optional(), // Accept string ISO or Date, convert to Date
});

export const PostCategoryCreateSchema = PostCategorySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type PostCategoryType = z.infer<typeof PostCategorySchema>;
export type PostCategoryCreateType = z.infer<typeof PostCategoryCreateSchema>;
export type PostCategoryFormType = z.infer<typeof PostCategoryFormSchema>;
