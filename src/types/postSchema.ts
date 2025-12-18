import { z } from "zod";

// ====== Constants ======
const TITLE_MAX = 500;
const NAME_MAX = 255;
const MIME_MAX = 30;

// ====== Enums ======
export const PostStatusEnum = z.enum([
  "draft",
  "publish",
  "pending",
  "private",
  "trash",
]);
export const PostTypeEnum = z.enum([
  "post",
  "page",
  "attachment",
  "gallery",
  "donation",
]);

// ====== Create Schema ======
export const PostCreateSchema = z.object({
  post_title: z.string().trim().min(1, "Judul wajib diisi").max(TITLE_MAX),
  post_excerpt: z.string().trim().max(500).nullable().optional(),
  post_name: z.string().trim().min(1, "Slug wajib diisi").max(NAME_MAX),
  post_content: z.string().trim().nullable().optional(),
  post_status: PostStatusEnum.default("draft"),
  code: z.string().trim().nullable().optional(),
  post_type: PostTypeEnum.default("post"),
  post_mime_type: z.string().trim().max(MIME_MAX).nullable().optional(),
  user_id: z.coerce.number().int(),
  post_category_id: z.coerce.number().int().nullable().optional(),
  post_image: z.string().trim().min(1, "Gambar wajib diisi"),
  date: z.union([z.string(), z.date()]).nullable().optional(),
  account: z.number().optional(),
});

// ====== Update Schema (all optional) ======
export const PostUpdateSchema = z
  .object({
    post_title: z.string().trim().min(1).max(TITLE_MAX).optional(),
    post_excerpt: z.string().trim().max(500).nullable().optional(),
    post_name: z.string().trim().min(1).max(NAME_MAX).optional(),
    post_content: z.string().trim().nullable().optional(),
    post_status: PostStatusEnum.optional(),
    code: z.string().trim().nullable().optional(),
    post_type: PostTypeEnum.optional(),
    post_mime_type: z.string().trim().max(MIME_MAX).nullable().optional(),
    user_id: z.coerce.number().int().optional(),
    post_category_id: z.coerce.number().int().nullable().optional(),
    post_image: z.string().trim().min(1, "Gambar wajib diisi"),
    date: z.union([z.string(), z.date()]).nullable().optional(),
    account: z.number().optional(),
  })
  .strict();

// ====== Types ======
export type PostCreateInput = z.infer<typeof PostCreateSchema>;
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>;
export type PostType = {
  id: string;
  post_title: string;
  post_excerpt?: string | null;
  post_name: string;
  post_content?: string | null;
  post_status: "draft" | "publish" | "pending" | "private" | "trash";
  code?: string | null;
  post_type: "post" | "page" | "attachment" | "gallery" | "donation";
  post_mime_type?: string | null;
  user_id: string;
  post_category_id?: number | null;
  post_image: string;
  account?: number;
  date?: string | Date | null;
  created_at?: string | null;
  updated_at?: string | null;
};
