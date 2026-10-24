// Utilitaires couleur partagés (thème admin + lisibilité des icônes).

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHexColor(value: string): boolean {
  return HEX_RE.test(value.trim());
}

/** Normalise "#abc" / "abc" / "#AABBCC" en "#aabbcc" (ou null si invalide). */
export function normalizeHex(value: string): string | null {
  const m = value.trim().match(HEX_RE);
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  return `#${h.toLowerCase()}`;
}

function toRgb(hex: string): [number, number, number] | null {
  const n = normalizeHex(hex);
  if (!n) return null;
  const v = parseInt(n.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/** Luminance relative WCAG (0 = noir, 1 = blanc). */
export function luminance(hex: string): number | null {
  const rgb = toRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Convertit un hex en triplet « H S% L% » attendu par les tokens CSS. */
export function hexToHslTriplet(hex: string): string | null {
  const rgb = toRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Texte lisible (blanc ou quasi-noir) posé sur une couleur de fond. */
export function readableForeground(hex: string): string {
  const l = luminance(hex) ?? 0;
  return l > 0.45 ? "240 10% 4%" : "0 0% 100%";
}

/**
 * Couleur d'icône de marque utilisable sur fond clair ET sombre : les teintes
 * quasi blanches ou quasi noires (ex. Next.js, GitHub) basculent sur
 * `currentColor` pour rester visibles quel que soit le thème.
 */
export function iconColor(hex?: string | null): string | undefined {
  if (!hex) return undefined;
  const l = luminance(hex);
  if (l === null || l > 0.8 || l < 0.02) return undefined;
  return hex;
}
