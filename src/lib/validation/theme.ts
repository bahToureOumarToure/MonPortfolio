import { z } from "./zod-fr";
import { THEME_MODES, THEME_RADII } from "@/lib/theme";

export const themeInput = z.object({
  mode: z.enum(THEME_MODES as [string, ...string[]]),
  accent: z
    .string()
    .trim()
    .regex(
      /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
      "Couleur d'accent : format #rrggbb attendu.",
    ),
  radius: z.enum(THEME_RADII as [string, ...string[]]),
});
