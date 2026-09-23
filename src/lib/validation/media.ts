import { z } from "zod";

export const registerMediaInput = z.object({
  url: z
    .string()
    .trim()
    .refine((v) => /^https?:\/\//.test(v), "URL invalide."),
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
