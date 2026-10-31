import type { Locale } from "@/i18n/routing";

/** Langues traduites (l'anglais est le texte de base, dans les colonnes). */
export const TRANSLATED_LOCALES = ["fr", "es", "ar"] as const;
export type TranslatedLocale = (typeof TRANSLATED_LOCALES)[number];

export type Translations<T> = Partial<Record<TranslatedLocale, Partial<T>>>;

/** Champs traduisibles de chaque contenu (repris par l'admin). */
export const TRANSLATABLE = {
  hero: [
    "tagline",
    "headingTop",
    "headingBottom",
    "designation",
    "alternateWords",
    "subheading",
    "ctaPrimaryLabel",
    "ctaResumeLabel",
  ],
  profile: ["aboutTitle", "aboutHighlight", "description"],
  settings: ["siteTitle", "metaDescription", "footerTagline", "address"],
  project: ["name", "description", "role", "highlights", "challenges"],
  experience: ["title", "company", "duration", "details"],
  education: ["title", "institution", "duration"],
  skill: ["name"],
} as const;

function cleanList(v: unknown[]): string[] {
  return v
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Limites des traductions saisies dans l'admin. */
const MAX_TEXT = 4000;
const MAX_ITEMS = 30;
const MAX_ITEM = 500;

/**
 * Remplace chaque champ par sa traduction dans `locale` quand elle existe ;
 * sinon le texte de base (anglais) est conservé.
 */
export function translate<T extends object>(
  base: T,
  translations: unknown,
  locale: Locale,
  fields: readonly string[],
): T {
  if (locale === "en" || !translations || typeof translations !== "object") {
    return base;
  }
  const tr = (translations as Record<string, unknown>)[locale];
  if (!tr || typeof tr !== "object") return base;
  const values = tr as Record<string, unknown>;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const field of fields) {
    const v = values[field];
    if (typeof v === "string" && v.trim()) out[field] = v.trim();
    else if (Array.isArray(v) && cleanList(v).length) out[field] = cleanList(v);
  }
  return out as T;
}

/**
 * Nettoie des traductions saisies dans l'admin : seules les langues et
 * champs connus sont gardés, les valeurs vides retirées. `null` si rien.
 */
export function sanitizeTranslations(
  input: unknown,
  fields: readonly string[],
): Translations<Record<string, string | string[]>> | null {
  if (!input || typeof input !== "object") return null;
  const out: Translations<Record<string, string | string[]>> = {};
  for (const locale of TRANSLATED_LOCALES) {
    const tr = (input as Record<string, unknown>)[locale];
    if (!tr || typeof tr !== "object") continue;
    const entry: Record<string, string | string[]> = {};
    for (const field of fields) {
      const v = (tr as Record<string, unknown>)[field];
      if (typeof v === "string" && v.trim()) {
        entry[field] = v.trim().slice(0, MAX_TEXT);
      } else if (Array.isArray(v) && cleanList(v).length) {
        entry[field] = cleanList(v)
          .slice(0, MAX_ITEMS)
          .map((x) => x.slice(0, MAX_ITEM));
      }
    }
    if (Object.keys(entry).length) out[locale] = entry;
  }
  return Object.keys(out).length ? out : null;
}
