import { z } from "zod";

export const ProgramCategorySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  userCreate: z.coerce.number().optional(),
  account: z.coerce.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ProgramCategoryCreateSchema = ProgramCategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ProgramCategoryType = z.infer<typeof ProgramCategorySchema>;
export type ProgramCategoryCreateType = z.infer<
  typeof ProgramCategoryCreateSchema
>;
