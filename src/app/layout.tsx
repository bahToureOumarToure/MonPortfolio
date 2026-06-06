import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "@/../utils/ScrollToTopButton";

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

const SITE_URL = "https://www.bahoumartoure.com";

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
      "Étudiant ingénieur ENIAD Berkane - IA & Deep Learning (LSTM, NLP), Data & BI (Power BI), DevOps, Full-Stack (Spring Boot, Next.js, Flutter). Disponible pour Stage PFA.",
    url: SITE_URL,
    siteName: "Bah Oumar Touré Portfolio",
    images: [
      {
        url: "/Website-overview.png",
        width: 1200,
        height: 630,
        alt: "Portfolio de Bah Oumar Touré - Junior Developer IA, Data, DevOps & Full-Stack",
      },
    ],
    locale: "fr_FR",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bah Oumar Touré | Junior Developer - IA, Data, DevOps & Full-Stack",
    description:
      "Étudiant ingénieur ENIAD - Deep Learning, Power BI, DevOps, Full-Stack. Disponible Stage PFA Été 2026.",
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
    "Étudiant Ingénieur en Génie Informatique - Junior Developer IA, Data, DevOps & Full-Stack",
  description:
    "Étudiant en 2e année du cycle d'ingénieur en Génie Informatique à l'ENIAD Berkane, spécialisé en Intelligence Artificielle, Data, DevOps et développement Full-Stack. Conception de modèles Deep Learning (LSTM, Seq2Seq), architectures microservices Spring Boot, dashboards Power BI et applications Next.js / Flutter. À la recherche d'un Stage de Fin d'Année (PFA).",
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
  seeks: {
    "@type": "Demande",
    name: "Stage de Fin d'Année (PFA) - IA, Data, DevOps ou Full-Stack",
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <Script
          id="json-ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="text-white">
          <div className="container">{children}</div>
        </main>
        <ScrollToTopButton />
        <Footer />
      </body>
    </html>
  );
}
