import { z } from "./zod-fr";

export const registerMediaInput = z.object({
  url: z
    .string()
    .trim()
    .max(1000)
    .refine(
      (v) => /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(v),
      "Le fichier doit provenir du stockage Vercel Blob.",
    ),
  pathname: z.string().trim().max(500).default(""),
  filename: z.string().trim().max(255).default("fichier"),
  mimeType: z.string().trim().max(120).default("application/octet-stream"),
  size: z.coerce.number().int().nonnegative().default(0),
  width: z.coerce.number().int().nonnegative().optional(),
  height: z.coerce.number().int().nonnegative().optional(),
  kind: z.enum(["IMAGE", "DOCUMENT"]),
  alt: z.string().trim().max(200).optional(),
});
export type RegisterMediaInput = z.infer<typeof registerMediaInput>;

export const mediaAltInput = z.object({
  alt: z.string().trim().max(200),
});
