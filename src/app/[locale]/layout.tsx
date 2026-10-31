import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import RootDocument, { themeViewport } from "@/components/root-document";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import ScrollToTop from "@/components/site/scroll-to-top";
import { getSettings, getSocialLinks } from "@/lib/queries";
import { OWNER_NAME, SITE_URL } from "@/lib/site";
import {
  LOCALE_META,
  localeAlternates,
  locales,
  routing,
  type Locale,
} from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateViewport(): Promise<Viewport> {
  return themeViewport();
}

const KEYWORDS = [
  "Bah Oumar Touré",
  "Junior Developer",
  "ENIAD Berkane",
  "Artificial Intelligence",
  "Agentic AI",
  "RAG",
  "Deep Learning",
  "Machine Learning",
  "TensorFlow",
  "LangChain",
  "Power BI",
  "Business Intelligence",
  "DevOps",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Java Spring Boot",
  "Spring Cloud",
  "Microservices",
  "REST API",
  "Full-Stack Developer",
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Flutter",
  "Firebase",
  "PostgreSQL",
  "MySQL",
  "Berkane",
  "Oujda",
  "Morocco",
];

/** Métadonnées par langue : textes traduits + titre/description de l'admin. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  const settings = await getSettings(locale);
  const description = settings.metaDescription || t("description");
  const siteName = settings.siteTitle || `${OWNER_NAME} Portfolio`;
  const title = t("title");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${OWNER_NAME}` },
    description,
    applicationName: siteName,
    keywords: KEYWORDS,
    authors: [{ name: OWNER_NAME, url: SITE_URL }],
    creator: OWNER_NAME,
    publisher: OWNER_NAME,
    alternates: localeAlternates(locale, "/"),
    openGraph: {
      title,
      description: t("ogDescription"),
      url: SITE_URL,
      siteName,
      images: [
        {
          url: "/Website-overview.png",
          width: 1031,
          height: 1024,
          alt: t("ogImageAlt"),
        },
      ],
      locale: LOCALE_META[locale].og,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => LOCALE_META[l].og),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("ogDescription"),
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
}

async function personJsonLd(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: OWNER_NAME,
    givenName: "Oumar",
    familyName: "Touré",
    url: SITE_URL,
    image: `${SITE_URL}/profile.png`,
    email: "mailto:bahoumartoure70@gmail.com",
    jobTitle: t("jobTitle"),
    description: t("personDescription"),
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "École Nationale de l'Intelligence Artificielle et du Digital de Berkane (ENIADB)",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Berkane",
          addressCountry: "MA",
        },
      },
      {
        "@type": "EducationalOrganization",
        name: "Faculté des Sciences d'Oujda — Université Mohammed Premier",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Oujda",
          addressCountry: "MA",
        },
      },
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Agentic AI",
      "Retrieval-Augmented Generation",
      "Deep Learning",
      "Machine Learning",
      "Python",
      "Power BI",
      "Business Intelligence",
      "DevOps",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Java",
      "Spring Boot",
      "Spring Cloud",
      "Microservices",
      "REST API",
      "Next.js",
      "React",
      "TypeScript",
      "Flutter",
      "PostgreSQL",
      "MySQL",
    ],
    knowsLanguage: [
      { "@type": "Language", name: "Français", alternateName: "fr" },
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "العربية", alternateName: "ar" },
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
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [settings, socials, t, jsonLd] = await Promise.all([
    getSettings(locale),
    getSocialLinks(),
    getTranslations({ locale, namespace: "Common" }),
    personJsonLd(locale),
  ]);

  return (
    <RootDocument lang={locale} dir={LOCALE_META[locale].dir}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NextIntlClientProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow"
        >
          {t("skipToContent")}
        </a>
        <Navbar siteName={OWNER_NAME} />
        <main id="main">{children}</main>
        <Footer settings={settings} socials={socials} siteName={OWNER_NAME} />
        <ScrollToTop />
      </NextIntlClientProvider>
      <Analytics />
      <SpeedInsights />
    </RootDocument>
  );
}
