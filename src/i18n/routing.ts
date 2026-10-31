import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fr", "es", "ar"] as const;
export type Locale = (typeof locales)[number];

// Anglais par défaut, sans préfixe (/, /projects) ; les autres langues sont
// préfixées (/fr, /es/projects…). La langue vient uniquement de l'URL : un
// visiteur arrive toujours en anglais sur /, puis choisit sa langue.
export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export const LOCALE_META: Record<
  Locale,
  { label: string; dir: "ltr" | "rtl"; og: string; intl: string }
> = {
  en: { label: "English", dir: "ltr", og: "en_US", intl: "en-US" },
  fr: { label: "Français", dir: "ltr", og: "fr_FR", intl: "fr-FR" },
  es: { label: "Español", dir: "ltr", og: "es_ES", intl: "es-ES" },
  // Chiffres latins, comme au Maroc.
  ar: { label: "العربية", dir: "rtl", og: "ar_AR", intl: "ar-u-nu-latn" },
};

/** Chemin public d'une page dans une langue (« / » + préfixe sauf anglais). */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

/** Balises hreflang + canonique pour une page. */
export function localeAlternates(locale: Locale, path: string) {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizedPath(l, path)])),
      "x-default": localizedPath(routing.defaultLocale, path),
    },
  };
}
