// Formats attendus par chaque emplacement d'image du site public.
export type SlotAspect = "portrait" | "video" | "square";

export const SLOT: Record<
  SlotAspect,
  { ratio: number; label: string; cls: string }
> = {
  portrait: { ratio: 4 / 5, label: "portrait 4:5", cls: "aspect-[4/5]" },
  video: { ratio: 16 / 9, label: "paysage 16:9", cls: "aspect-video" },
  square: { ratio: 1, label: "carré 1:1", cls: "aspect-square" },
};

const TOLERANCE = 0.15; // 15 % d'écart de ratio toléré

/** true si l'image ne correspond pas (sera recadrée) au format du slot. */
export function ratioMismatch(
  width: number | null | undefined,
  height: number | null | undefined,
  slot: SlotAspect,
): boolean {
  if (!width || !height) return false; // dimensions inconnues → pas d'alerte
  const r = width / height;
  const target = SLOT[slot].ratio;
  return Math.abs(r - target) / target > TOLERANCE;
}

/** Décrit grossièrement l'orientation d'une image. */
export function describeOrientation(
  width: number | null | undefined,
  height: number | null | undefined,
): string {
  if (!width || !height) return "format inconnu";
  const r = width / height;
  if (r > 1.2) return "paysage";
  if (r < 0.85) return "portrait";
  return "carré";
}
