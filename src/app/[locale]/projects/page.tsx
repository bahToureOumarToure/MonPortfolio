import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import ProjectsExplorer from "@/components/site/projects-explorer";
import { getProjects } from "@/lib/queries";
import { localeAlternates, routing, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("projectsTitle"),
    description: t("projectsDescription"),
    alternates: localeAlternates(locale, "/projects"),
  };
}

export default async function ProjectsPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [projects, t] = await Promise.all([
    getProjects(locale),
    getTranslations({ locale, namespace: "Projects" }),
  ]);
  return (
    <Container className="py-14 sm:py-20">
      <header className="mb-10 flex max-w-2xl flex-col gap-3">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {t("pageDescription")}
        </p>
      </header>
      <ProjectsExplorer projects={projects} />
    </Container>
  );
}
