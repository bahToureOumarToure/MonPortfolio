import { LOCALE_META, type Locale } from "@/i18n/routing";

/** "2025-12-20" → "December 2025" / "décembre 2025"… ; brut si non datable. */
export function formatProjectDate(
  value: string,
  locale: Locale = "en",
): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    month: "long",
    year: "numeric",
  }).format(d);
}
