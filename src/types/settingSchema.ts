import { z } from "zod";

export const SettingSchema = z.object({
  id: z.number().optional(),
  key: z.string().min(1, "Key is required").max(255),
  label: z.string().min(1, "Label is required"),
  type: z.string().min(1, "Type is required").max(50),
  value: z.string().nullable().optional(),
});

export const SettingCreateSchema = SettingSchema.omit({ id: true });
export const SettingUpdateSchema = SettingSchema.partial();

export type SettingType = z.infer<typeof SettingSchema>;
