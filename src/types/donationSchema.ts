import { z } from "zod";

// ====== Constants ======
const NAME_MAX = 255;
const PHONE_MAX = 255;
const NOTE_MAX = 255;

// ====== Enums ======
export const DonationStatusEnum = z.enum([
  "pending",
  "settled",
  "expired",
  "failed",
]);

// ====== Create Schema ======
export const DonationCreateSchema = z.object({
  id: z.number().optional(),
  invoice_number: z
    .string()
    .trim()
    .min(1, "Nomor invoice wajib diisi")
    .max(NAME_MAX),
  name: z.string().trim().min(1, "Nama wajib diisi").max(NAME_MAX),
  phone_number: z.string().trim().max(PHONE_MAX).nullable().optional(),
  note: z.string().trim().max(NOTE_MAX).nullable().optional(),
  amount: z.coerce.number().min(0, "Jumlah tidak boleh negatif"),
  payment_link: z.string().nullable().optional(),
  status: DonationStatusEnum.default("pending"),
  image: z.string().nullable().optional(),
});

// ====== Update Schema (all optional) ======
export const DonationUpdateSchema = z
  .object({
    id: z.number().optional(),
    invoice_number: z.string().trim().min(1).max(NAME_MAX).optional(),
    name: z.string().trim().min(1).max(NAME_MAX).optional(),
    phone_number: z.string().trim().max(PHONE_MAX).nullable().optional(),
    note: z.string().trim().max(NOTE_MAX).nullable().optional(),
    amount: z.coerce.number().min(0).optional(),
    payment_link: z.string().url().nullable().optional(),
    status: DonationStatusEnum.optional(),
    image: z.string().nullable().optional(),
  })
  .strict();

// ====== Types ======
export type DonationCreateInput = z.infer<typeof DonationCreateSchema>;
export type DonationUpdateInput = z.infer<typeof DonationUpdateSchema>;
export type DonationType = {
  id: string;
  invoice_number: string;
  name: string;
  phone_number?: string | null;
  note?: string | null;
  amount: number;
  payment_link?: string | null;
  status: "pending" | "settled" | "expired" | "failed";
  image?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};
