import { z } from "zod";

export const HalaqohCategorySchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional(),
  image: z.string().optional(),
  date_test: z.preprocess(
    (val) => (val === "" ? null : val),
    z.coerce.date().nullable().optional(),
  ),
  link_meet: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional(),
  ),
});
export type HalaqohCategoryType = z.infer<typeof HalaqohCategorySchema>;

export const HalaqohMentorSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number(),
  bio: z.string().optional(),
  specialization: z.string().optional(),
  is_active: z.boolean().default(true),
});
export type HalaqohMentorType = z.infer<typeof HalaqohMentorSchema>;

export const HalaqohSchema = z.object({
  id: z.coerce.number().optional(),
  category_id: z.coerce.number(),
  mentor_id: z.coerce.number(),
  title: z.string().min(1, "Judul kelas wajib diisi"),
  schedule_info: z.string().optional(),
  location_type: z.enum(["ONLINE", "OFFLINE"]).default("ONLINE"),
  meeting_link: z.string().url().optional().or(z.literal("")),
  status: z.enum(["OPEN", "CLOSED"]).default("OPEN"),
});
export type HalaqohType = z.infer<typeof HalaqohSchema>;

export const HalaqohRegistrationSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number().optional(),
  category_id: z.coerce.number(),
  status: z
    .enum(["PENDING", "TESTING", "ACCEPTED", "REJECTED", "COMPLETED"])
    .default("PENDING"),
  test_score: z.coerce.number().optional(),
  phone_number: z.string().min(1, "Nomor HP wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  gender: z.enum(["IKHWAN", "AKHWAT"]),
  notes: z.string().optional(),
  date: z.coerce.date().nullable().optional(),
  date_test: z.coerce.date().nullable().optional(),
});
export type HalaqohRegistrationType = z.infer<typeof HalaqohRegistrationSchema>;

export const HalaqohAttendanceSchema = z.object({
  id: z.coerce.number().optional(),
  halaqoh_id: z.coerce.number(),
  user_id: z.coerce.number(),
  date: z.coerce.date(),
  status: z.enum(["HADIR", "IZIN", "SAKIT", "ALPA"]),
  notes: z.string().optional(),
});
