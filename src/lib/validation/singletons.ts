import { z } from "zod";

const optionalImage = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || /^(https?:\/\/|\/)/.test(v),
    "URL/chemin invalide.",
  )
  .default("");

export const heroInput = z.object({
  tagline: z.string().trim().max(120).default(""),
  headingTop: z.string().trim().max(120).default(""),
  headingBottom: z.string().trim().max(120).default(""),
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
  designation: z.string().trim().max(160).default(""),
  alternateWords: z.array(z.string().trim()).default([]),
  subheading: z.string().trim().max(400).default(""),
  ctaPrimaryLabel: z.string().trim().max(60).default("Let's Collaborate"),
  ctaPrimaryHref: z.string().trim().max(200).default("/#contact"),
  ctaResumeLabel: z.string().trim().max(60).default("Get Resume"),
  heroImage: optionalImage,
});
export type HeroInput = z.infer<typeof heroInput>;

export const profileInput = z.object({
  aboutTitle: z.string().trim().max(80).default("About"),
  aboutHighlight: z.string().trim().max(120).default(""),
  description: z.string().trim().min(1, "La description est requise."),
  image: optionalImage,
});
export type ProfileInput = z.infer<typeof profileInput>;

export const settingsInput = z.object({
  siteTitle: z.string().trim().max(160).default(""),
  metaDescription: z.string().trim().max(320).default(""),
  contactEmail: z.string().trim().max(160).default(""),
  phone: z.string().trim().max(60).default(""),
  address: z.string().trim().max(160).default(""),
  footerTagline: z.string().trim().max(400).default(""),
  resumeExternalUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\//.test(v), "URL invalide.")
    .default(""),
});
export type SettingsInput = z.infer<typeof settingsInput>;
