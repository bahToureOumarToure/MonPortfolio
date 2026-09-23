import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//.test(v), "URL invalide.")
  .optional()
  .default("");

export const projectInput = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(200),
  description: z.string().trim().min(1, "La description est requise."),
  role: z.string().trim().max(120).default(""),
  tools: z.array(z.string().trim()).default([]),
  highlights: z.array(z.string().trim()).default([]),
  challenges: z.array(z.string().trim()).default([]),
  codeUrl: optionalUrl,
  demoUrl: optionalUrl,
  date: z.string().trim().max(40).default(""),
  status: z.string().trim().max(80).default(""),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
  images: z
    .array(
      z
        .string()
        .trim()
        .refine((v) => /^(https?:\/\/|\/)/.test(v), "URL/chemin invalide."),
    )
    .default([]),
});

export type ProjectInput = z.infer<typeof projectInput>;
