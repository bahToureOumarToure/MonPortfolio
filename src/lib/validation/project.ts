import { z } from "./zod-fr";
import { isAllowedImageUrl } from "@/lib/media-format";

const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === "" || /^https?:\/\//.test(v),
      `${label} : URL invalide (https://…).`,
    )
    .optional()
    .default("");

export const projectInput = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(200),
  description: z
    .string()
    .trim()
    .min(1, "La description est requise.")
    .max(4000),
  role: z.string().trim().max(120).default(""),
  tools: z.array(z.string().trim().max(60)).max(40).default([]),
  highlights: z.array(z.string().trim().max(500)).max(20).default([]),
  challenges: z.array(z.string().trim().max(500)).max(20).default([]),
  codeUrl: optionalUrl("Lien code"),
  demoUrl: optionalUrl("Lien démo"),
  date: z.string().trim().max(40).default(""),
  status: z.string().trim().max(80).default(""),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  images: z
    .array(
      z
        .string()
        .trim()
        .refine(
          isAllowedImageUrl,
          "Image : lien invalide (https://… ou fichier de la médiathèque).",
        ),
    )
    .max(30)
    .default([]),
  translations: z.unknown().optional(),
});

export type ProjectInput = z.infer<typeof projectInput>;
