// Thème du site (mode clair/sombre, couleur d'accent, arrondis).
// Module pur, partagé entre le serveur (génération CSS) et l'admin (aperçu).
import {
  hexToHslTriplet,
  luminance,
  normalizeHex,
  readableForeground,
} from "./color";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeRadius = "sm" | "md" | "lg" | "xl";

export interface ThemeVM {
  mode: ThemeMode;
  accent: string; // #rrggbb
  radius: ThemeRadius;
}

export const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
export const THEME_RADII: ThemeRadius[] = ["sm", "md", "lg", "xl"];

export const DEFAULT_THEME: ThemeVM = {
  mode: "light",
  accent: "#dc2626",
  radius: "lg",
};

export const ACCENT_PRESETS: { name: string; value: string }[] = [
  { name: "Rouge", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Ambre", value: "#d97706" },
  { name: "Émeraude", value: "#059669" },
  { name: "Turquoise", value: "#0d9488" },
  { name: "Bleu", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#db2777" },
  { name: "Graphite", value: "#18181b" },
];

export const RADIUS_VALUES: Record<ThemeRadius, string> = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
};

export const RADIUS_LABELS: Record<ThemeRadius, string> = {
  sm: "Nets",
  md: "Doux",
  lg: "Arrondis",
  xl: "Très arrondis",
};

export const MODE_LABELS: Record<
  ThemeMode,
  { label: string; description: string }
> = {
  light: { label: "Clair", description: "Fond blanc — recommandé" },
  dark: { label: "Sombre", description: "Fond noir" },
  system: {
    label: "Automatique",
    description: "Suit le réglage de l'appareil",
  },
};

/** Valide/normalise un thème venant de la base (valeurs inconnues → défaut). */
export function sanitizeTheme(
  raw: Partial<Record<keyof ThemeVM, unknown>> | null | undefined,
): ThemeVM {
  const mode = THEME_MODES.includes(raw?.mode as ThemeMode)
    ? (raw!.mode as ThemeMode)
    : DEFAULT_THEME.mode;
  const radius = THEME_RADII.includes(raw?.radius as ThemeRadius)
    ? (raw!.radius as ThemeRadius)
    : DEFAULT_THEME.radius;
  const accent =
    (typeof raw?.accent === "string" && normalizeHex(raw.accent)) ||
    DEFAULT_THEME.accent;
  return { mode, accent, radius };
}

const NEAR_WHITE = 0.85;
const NEAR_BLACK = 0.03;

/**
 * Variables de la couleur d'accent pour un fond donné. Une teinte presque
 * blanche (sur fond clair) ou presque noire (sur fond sombre) serait
 * invisible : on bascule alors sur la couleur du texte.
 */
export function brandVars(
  accent: string,
  surface: "light" | "dark",
): { brand: string; foreground: string } {
  const hex = normalizeHex(accent) ?? DEFAULT_THEME.accent;
  const l = luminance(hex) ?? 0.2;
  if (surface === "light" && l > NEAR_WHITE)
    return { brand: "240 10% 4%", foreground: "0 0% 100%" };
  if (surface === "dark" && l < NEAR_BLACK)
    return { brand: "0 0% 98%", foreground: "240 10% 4%" };
  return { brand: hexToHslTriplet(hex)!, foreground: readableForeground(hex) };
}

/** Feuille de style injectée dans <head> : surcharge des tokens du design system. */
export function themeCss(theme: ThemeVM): string {
  const light = brandVars(theme.accent, "light");
  const dark = brandVars(theme.accent, "dark");
  return (
    `:root{--brand:${light.brand};--brand-foreground:${light.foreground};--radius:${RADIUS_VALUES[theme.radius]}}` +
    `.dark{--brand:${dark.brand};--brand-foreground:${dark.foreground}}`
  );
}

/** Ratio de contraste WCAG entre deux couleurs hex. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a) ?? 0;
  const lb = luminance(b) ?? 0;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Avertissements de lisibilité de l'accent selon le mode choisi. */
export function accentWarnings(theme: ThemeVM): string[] {
  const out: string[] = [];
  const onLight = contrastRatio(theme.accent, "#ffffff");
  const onDark = contrastRatio(theme.accent, "#09090b");
  if (theme.mode !== "dark" && onLight < 3) {
    out.push(
      "Cette couleur est claire : les textes d'accent seront peu lisibles sur fond blanc.",
    );
  }
  if (theme.mode !== "light" && onDark < 3) {
    out.push(
      "Cette couleur est foncée : les textes d'accent seront peu lisibles sur fond sombre.",
    );
  }
  return out;
}

/** Script anti-flash du mode automatique (exécuté avant l'affichage). */
export const SYSTEM_MODE_SCRIPT =
  "(function(){try{var m=window.matchMedia('(prefers-color-scheme: dark)');" +
  "var a=function(){document.documentElement.classList.toggle('dark',m.matches)};" +
  "a();m.addEventListener('change',a)}catch(e){}})()";
