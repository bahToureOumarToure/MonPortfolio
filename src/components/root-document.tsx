import type { Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { getTheme } from "@/lib/queries";
import { SYSTEM_MODE_SCRIPT, themeCss } from "@/lib/theme";

const LIGHT_BG = "#ffffff";
const DARK_BG = "#09090b";

/** Couleur de la barre du navigateur selon le thème choisi dans l'admin. */
export async function themeViewport(): Promise<Viewport> {
  const { mode } = await getTheme();
  if (mode === "dark") return { themeColor: DARK_BG, colorScheme: "dark" };
  if (mode === "system") {
    return {
      themeColor: [
        { media: "(prefers-color-scheme: light)", color: LIGHT_BG },
        { media: "(prefers-color-scheme: dark)", color: DARK_BG },
      ],
      colorScheme: "light dark",
    };
  }
  return { themeColor: LIGHT_BG, colorScheme: "light" };
}

/**
 * Document HTML commun (site dans chaque langue, admin, 404 hors langue) :
 * polices, jetons du thème injectés sans flash, langue et sens d'écriture.
 */
export default async function RootDocument({
  lang,
  dir = "ltr",
  children,
}: {
  lang: string;
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  return (
    <html
      lang={lang}
      dir={dir}
      className={
        theme.mode === "dark" ? `${fontVariables} dark` : fontVariables
      }
      // Le mode « automatique » ajoute .dark côté client avant l'affichage.
      suppressHydrationWarning={theme.mode === "system"}
    >
      {/* Layout racine (App Router) : <head> est le bon élément ici. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <style
          id="theme-tokens"
          dangerouslySetInnerHTML={{ __html: themeCss(theme) }}
        />
        {theme.mode === "system" && (
          <script dangerouslySetInnerHTML={{ __html: SYSTEM_MODE_SCRIPT }} />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
