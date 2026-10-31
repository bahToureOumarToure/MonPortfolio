import localFont from "next/font/local";

export const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Glyphes arabes (Geist n'en a pas). Limité à la plage Unicode arabe : le
// navigateur ne le télécharge que si la page contient du texte arabe.
export const notoArabic = localFont({
  src: "../app/fonts/NotoSansArabicVF.woff2",
  variable: "--font-arabic",
  weight: "100 900",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC",
    },
  ],
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${notoArabic.variable}`;
