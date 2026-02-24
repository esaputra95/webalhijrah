import { z } from "zod";
// ====== Zod Schemas ======
export const CreateSchema = z.object({
  name: z.string().min(1).max(150),
  email: z.string().email().max(150),
  role: z.string().max(50).nullable().optional(),
  password: z.string().min(6).max(255),
});

export const UpdateSchema = z
  .object({
    name: z.string().min(1).max(150).optional(),
    email: z.string().email().max(150).optional(),
    role: z.string().max(50).nullable().optional(),
    password: z.string().min(6).max(255).optional(),
  })
  .strict();
