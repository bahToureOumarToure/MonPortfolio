import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { getTheme } from "@/lib/queries";
import { SYSTEM_MODE_SCRIPT, themeCss } from "@/lib/theme";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const LIGHT_BG = "#ffffff";
const DARK_BG = "#09090b";

export async function generateViewport(): Promise<Viewport> {
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Bah Oumar Touré | Junior Developer - IA, Data, DevOps & Full-Stack",
    template: "%s | Bah Oumar Touré",
  },
  description:
    "Portfolio de Bah Oumar Touré - Étudiant ingénieur en Génie Informatique à l'ENIAD Berkane. Spécialisé en IA (Deep Learning, ML,..), Data & BI (Power BI), DevOps et développement Full-Stack (Spring Boot, Next.js, React, Flutter). Disponible pour Stage PFA.",
  keywords: [
    "Bah Oumar Touré",
    "Junior Developer",
    "Stage PFA",
    "Étudiant Ingénieur ENIAD Berkane",
    // IA / Data
    "Intelligence Artificielle",
    "Deep Learning",
    "Machine Learning",
    "LSTM",
    "Seq2Seq",
    "NLP",
    "TensorFlow",
    "Keras",
    "Gemini Flash 2.5",
    "Power BI",
    "DAX",
    "Data Analyst",
    "Business Intelligence",
    // DevOps
    "DevOps",
    "Docker",
    "CI/CD",
    "Git",
    "GitHub",
    "Linux",
    // Back-end
    "Java Spring Boot",
    "Spring Cloud",
    "Microservices",
    "API REST",
    "Spring Security",
    "JPA Hibernate",
    "Jakarta EE",
    // Front-end / Mobile
    "Full-Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Flutter",
    "Firebase",
    // BD
    "MySQL",
    "PostgreSQL",
    "SQLi",
    "SQL",
    // Localisation
    "portfolio développeur",
    "Berkane",
    "Oujda",
    "Maroc",
  ],
  authors: [{ name: "Bah Oumar Touré", url: SITE_URL }],
  creator: "Bah Oumar Touré",
  publisher: "Bah Oumar Touré",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bah Oumar Touré | Junior Developer - IA, Data, DevOps & Full-Stack",
    description:
      "Étudiant ingénieur ENIAD Berkane - Full-Stack ,DevOps, IA , Data,  Disponible pour Stage PFA.",
    url: SITE_URL,
    siteName: "Bah Oumar Touré Portfolio",
    images: [
      {
        url: "/Website-overview.png",
        width: 1031,
        height: 1024,
        alt: "Portfolio de Bah Oumar Touré - Junior Developer IA, Data, DevOps & Full-Stack",
      },
    ],
    locale: "fr_FR",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bah Oumar Touré | Junior Developer - Full-Stack, IA",
    description:
      "Étudiant ingénieur à ENIAD - Full-Stack, DevOps. Disponible Stage PFA Été 2026.",
    images: ["/Website-overview.png"],
    creator: "@bahoumartoure",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/Pwa-logos/new-icons/manifest-icon-192.maskable.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bah Oumar Touré",
  givenName: "Oumar",
  familyName: "Touré",
  url: SITE_URL,
  image: `${SITE_URL}/profile.png`,
  email: "mailto:bahoumartoure70@gmail.com",
  jobTitle:
    "Étudiant Ingénieur en Génie Informatique - Junior Developer Full-Stack, Data, DevOps & IA",
  description:
    "Étudiant en 2e année du cycle d'ingénieur en Génie Informatique à l'ENIAD Berkane, développement Full-StackDevOps , architectures microservices Spring Boot, Intelligence Artificielle, Data,. À la recherche d'un Stage de Fin d'Année (PFA).",
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "École Nationale de l'Intelligence Artificielle et du Digital (ENIAD)",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Berkane",
        addressCountry: "MA",
      },
    },
    {
      "@type": "EducationalOrganization",
      name: "Université Mohammed Premier",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Oujda",
        addressCountry: "MA",
      },
    },
  ],
  knowsAbout: [
    // IA / Data
    "Intelligence Artificielle",
    "Deep Learning",
    "Machine Learning",
    "Python",
    "Power BI",
    "DAX",
    "Business Intelligence",
    "Data Analysis",
    // DevOps
    "DevOps",
    "Docker",
    "CI/CD",
    "Git",
    "GitHub",
    // Back-end
    "Java",
    "Spring Boot",
    "Spring Cloud",
    "Spring Security",
    "JPA",
    "Hibernate",
    "REST API",
    "Microservices",
    "Java EE",
    // Front-end / Mobile
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Flutter",
    "Firebase",
    // BD
    "MySQL",
    "PostgreSQL",
    "SQLite",
    "SQL",
  ],
  knowsLanguage: [
    { "@type": "Language", name: "Français", alternateName: "fr" },
    { "@type": "Language", name: "Arabe (Darija)", alternateName: "ar" },
    { "@type": "Language", name: "Anglais", alternateName: "en" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Berkane / Oujda",
    addressCountry: "MA",
  },
  sameAs: [
    "https://github.com/bahToureOumarToure",
    "https://www.linkedin.com/in/bahoumartoure",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();
  const fonts = `${geistSans.variable} ${geistMono.variable}`;

  return (
    <html
      lang="fr"
      className={theme.mode === "dark" ? `${fonts} dark` : fonts}
      // Le mode « automatique » ajoute .dark côté client avant l'affichage.
      suppressHydrationWarning={theme.mode === "system"}
    >
      <head>
        <style
          id="theme-tokens"
          dangerouslySetInnerHTML={{ __html: themeCss(theme) }}
        />
        {theme.mode === "system" && (
          <script dangerouslySetInnerHTML={{ __html: SYSTEM_MODE_SCRIPT }} />
        )}
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
