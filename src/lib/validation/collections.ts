import { z } from "zod";

export const SKILL_CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "LANGAGES",
  "DATABASE",
  "DATA_IA",
  "MOBILE",
  "TOOLS",
] as const;

export const skillInput = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(80),
  category: z.enum(SKILL_CATEGORIES),
  iconKey: z.string().trim().max(80).default(""),
  color: z.string().trim().max(20).default(""),
  order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type SkillInput = z.infer<typeof skillInput>;

export const socialInput = z.object({
  platform: z.string().trim().min(1, "La plateforme est requise.").max(60),
  url: z
    .string()
    .trim()
    .refine((v) => /^https?:\/\//.test(v), "URL invalide."),
  iconKey: z.string().trim().max(60).default(""),
  color: z.string().trim().max(20).default(""),
  order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type SocialInput = z.infer<typeof socialInput>;

export const experienceInput = z.object({
  title: z.string().trim().min(1, "Le titre est requis.").max(200),
  company: z.string().trim().max(160).default(""),
  duration: z.string().trim().max(120).default(""),
  details: z.array(z.string().trim()).default([]),
  order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type ExperienceInput = z.infer<typeof experienceInput>;
