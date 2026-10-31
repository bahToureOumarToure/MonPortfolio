import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/site/hero";
import About from "@/components/site/about";
import Journey from "@/components/site/journey";
import Skills from "@/components/site/skills";
import ProjectsSection from "@/components/site/projects-section";
import Contact from "@/components/site/contact";
import {
  getHero,
  getSocialLinks,
  getProfile,
  getExperiences,
  getEducations,
  getSkillsGrouped,
  getFeaturedProjects,
  getSettings,
} from "@/lib/queries";
import { localeAlternates, routing, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return { alternates: localeAlternates(locale, "/") };
}

export default async function Home({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const [
    hero,
    socials,
    profile,
    experiences,
    educations,
    grouped,
    featured,
    settings,
  ] = await Promise.all([
    getHero(locale),
    getSocialLinks(),
    getProfile(locale),
    getExperiences(locale),
    getEducations(locale),
    getSkillsGrouped(locale),
    getFeaturedProjects(locale, 3),
    getSettings(locale),
  ]);

  return (
    <>
      <Hero hero={hero} socials={socials} />
      <About profile={profile} settings={settings} />
      <Journey experiences={experiences} educations={educations} />
      <Skills grouped={grouped} />
      <ProjectsSection projects={featured} />
      <Contact settings={settings} socials={socials} />
    </>
  );
}
