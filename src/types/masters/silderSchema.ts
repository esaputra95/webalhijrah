import { z } from "zod";

export const SliderSchema = z.object({
  id: z.number().optional(),
  image: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  user_id: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const SliderCreateSchema = SliderSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type SliderType = z.infer<typeof SliderSchema>;
export type SliderCreateType = z.infer<typeof SliderCreateSchema>;
