import { z } from "./zod-fr";
import { SKILL_CATEGORIES } from "@/lib/skill-categories";

export { SKILL_CATEGORIES };

const optionalColor = z
  .string()
  .trim()
  .max(20)
  .refine(
    (v) => v === "" || /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v),
    "Couleur : format #rrggbb attendu.",
  )
  .default("");

const httpUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => /^https?:\/\//.test(v),
    "URL invalide (doit commencer par https://).",
  );

export const skillInput = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(80),
  category: z.enum(SKILL_CATEGORIES),
  iconKey: z.string().trim().max(80).default(""),
  color: optionalColor,
  active: z.boolean().default(true),
  translations: z.unknown().optional(),
});
export type SkillInput = z.infer<typeof skillInput>;

export const socialInput = z.object({
  platform: z.string().trim().min(1, "La plateforme est requise.").max(60),
  url: httpUrl,
  iconKey: z.string().trim().max(60).default(""),
  color: optionalColor,
  active: z.boolean().default(true),
});
export type SocialInput = z.infer<typeof socialInput>;

export const experienceInput = z.object({
  title: z.string().trim().min(1, "Le titre est requis.").max(200),
  company: z.string().trim().max(160).default(""),
  duration: z.string().trim().max(120).default(""),
  details: z.array(z.string().trim().max(500)).max(20).default([]),
  active: z.boolean().default(true),
  translations: z.unknown().optional(),
});
export type ExperienceInput = z.infer<typeof experienceInput>;

export const educationInput = z.object({
  title: z.string().trim().min(1, "Le titre est requis.").max(200),
  institution: z.string().trim().max(200).default(""),
  duration: z.string().trim().max(120).default(""),
  active: z.boolean().default(true),
  translations: z.unknown().optional(),
});
export type EducationInput = z.infer<typeof educationInput>;

export const idList = z.array(z.string().min(1).max(64)).max(500);
