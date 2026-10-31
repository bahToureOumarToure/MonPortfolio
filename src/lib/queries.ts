// Couche d'accès aux données du portfolio public.
// - Lectures depuis la DB (Prisma), mises en cache et taguées pour la revalidation.
// - Repli automatique sur le contenu existant (utils/Data/*) si la DB est
//   indisponible ou non encore seedée => parité garantie, build jamais cassé.
// - Multilingue : les colonnes contiennent le texte anglais (langue par
//   défaut) et `translations` les versions fr / es / ar. Le cache garde la
//   ligne complète ; la langue est appliquée à la lecture (translate()).
import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/routing";
import { prisma } from "./db";
import type {
  HeroVM,
  ProfileVM,
  SettingsVM,
  SocialVM,
  GroupedSkills,
  SkillVM,
  ProjectVM,
  ExperienceVM,
  EducationVM,
} from "./content-types";
import { SKILL_CATEGORIES, type SkillCategoryKey } from "./skill-categories";
import { TRANSLATABLE, translate } from "./translate";
import { personalData } from "../../utils/Data/PersonalData";
import { projectsData } from "../../utils/Data/projects-data";
import { skillsData } from "../../utils/Data/skills";
import { experiences as experiencesData } from "../../utils/Data/experience";
import { educations as educationsData } from "../../utils/Data/educations";
import {
  heroContent,
  profileContent,
  settingsContent,
} from "../../utils/Data/site-content";
import { getSocialColor } from "../../utils/social-icons";
import { DEFAULT_THEME, sanitizeTheme, type ThemeVM } from "./theme";

/**
 * Version du cache de données. Le Data Cache de Vercel survit aux
 * redéploiements : à incrémenter quand une migration SQL de prisma/sql modifie
 * des données (sinon l'ancien contenu resterait servi jusqu'à la prochaine
 * modification dans l'admin).
 */
const CACHE_VERSION = "2026-10-31-i18n";

export const CONTENT_TAGS = {
  hero: "hero",
  profile: "profile",
  settings: "settings",
  socials: "socials",
  skills: "skills",
  projects: "projects",
  experiences: "experiences",
  educations: "educations",
  theme: "theme",
} as const;

/** Une ligne de contenu avec ses traductions (forme mise en cache). */
type WithTranslations<T> = T & { translations: unknown };

function localize<T extends object>(
  row: WithTranslations<T>,
  locale: Locale,
  fields: readonly string[],
): T {
  const { translations, ...base } = row;
  return translate(base as T, translations, locale, fields);
}

const DATA_CATEGORY: Record<string, SkillCategoryKey> = {
  Frontend: "FRONTEND",
  Backend: "BACKEND",
  Langages: "LANGAGES",
  Database: "DATABASE",
  "Data & IA": "DATA_IA",
  Mobile: "MOBILE",
  Tools: "TOOLS",
  DevOps: "DEVOPS",
  "Soft skills": "SOFT_SKILLS",
};

const DEFAULT_SECTIONS: SettingsVM["sections"] = {
  hero: { visible: true, order: 0 },
  about: { visible: true, order: 1 },
  experience: { visible: true, order: 2 },
  skills: { visible: true, order: 3 },
  projects: { visible: true, order: 4 },
  contact: { visible: true, order: 5 },
  education: { visible: false, order: 6 },
};

// ------------------------------------------------------------------
// Valeurs par défaut (contenu de utils/Data, avec ses traductions)
// ------------------------------------------------------------------
function defaultSettings(): WithTranslations<SettingsVM> {
  const { translations, ...text } = settingsContent;
  return {
    ...text,
    contactEmail: personalData.email,
    phone: personalData.phone,
    resumeUrl: personalData.resume,
    sections: DEFAULT_SECTIONS,
    translations,
  };
}

function defaultHero(resumeUrl: string): WithTranslations<HeroVM> {
  const { translations, ...text } = heroContent;
  return {
    ...text,
    name: personalData.name,
    ctaPrimaryHref: "/#contact",
    heroImage: null,
    resumeUrl,
    translations,
  };
}

function defaultProfile(): WithTranslations<ProfileVM> {
  const { translations, ...text } = profileContent;
  return {
    ...text,
    image: personalData.profile,
    name: personalData.name,
    translations,
  };
}

function defaultSocials(): SocialVM[] {
  return [
    {
      platform: "GitHub",
      url: personalData.github,
      iconKey: "github",
      color: "#ffffff",
    },
    {
      platform: "LinkedIn",
      url: personalData.linkedIn,
      iconKey: "linkedin",
      color: "#0077b5",
    },
    {
      platform: "Twitter",
      url: personalData.twitter,
      iconKey: "twitter",
      color: "#1da1f2",
    },
    {
      platform: "StackOverflow",
      url: personalData.stackOverflow,
      iconKey: "stackoverflow",
      color: "#f48024",
    },
    {
      platform: "Facebook",
      url: personalData.facebook,
      iconKey: "facebook",
      color: "#1877f2",
    },
    {
      platform: "Instagram",
      url: personalData.Instagram,
      iconKey: "instagram",
      color: "#e4405f",
    },
    {
      platform: "LeetCode",
      url: personalData.leetcode,
      iconKey: "leetcode",
      color: "#ffa116",
    },
  ];
}

type SkillRow = WithTranslations<SkillVM> & { category: SkillCategoryKey };

function defaultSkills(): SkillRow[] {
  return skillsData.map((s) => ({
    name: s.name,
    iconKey: s.name,
    color: null,
    category: DATA_CATEGORY[s.category] ?? "TOOLS",
    translations: Object.fromEntries(
      Object.entries(s.translations ?? {}).map(([l, name]) => [l, { name }]),
    ),
  }));
}

function defaultProjects(): WithTranslations<ProjectVM>[] {
  return projectsData.map((p) => ({
    id: p.id,
    name: p.name.trim(),
    description: p.description,
    tools: p.tools ?? [],
    role: p.role ?? "",
    code: p.code || "",
    demo: p.demo || "",
    date: p.date || "",
    images: (p.images ?? []).filter(Boolean),
    featured: false,
    highlights: p.highlights ?? [],
    challenges: p.challenges ?? [],
    translations: p.translations,
  }));
}

function defaultEducations(): WithTranslations<EducationVM>[] {
  return educationsData.map((e) => ({
    id: e.id,
    title: e.title,
    institution: e.institution,
    duration: e.duration,
    translations: e.translations,
  }));
}

function defaultExperiences(): WithTranslations<ExperienceVM>[] {
  return experiencesData.map((e) => ({
    id: e.id,
    title: e.title,
    company: e.company,
    duration: e.duration,
    details: e.details,
    translations: e.translations,
  }));
}

// ------------------------------------------------------------------
// Lectures en cache (DB -> ligne complète, avec repli)
// ------------------------------------------------------------------
/** Thème du site ; thème clair par défaut si la table n'existe pas encore. */
export const getTheme = unstable_cache(
  async (): Promise<ThemeVM> => {
    try {
      const t = await prisma.siteTheme.findUnique({
        where: { id: "singleton" },
      });
      return t ? sanitizeTheme(t) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  },
  ["theme", CACHE_VERSION],
  { tags: [CONTENT_TAGS.theme] },
);

const loadSettings = unstable_cache(
  async (): Promise<WithTranslations<SettingsVM>> => {
    try {
      const s = await prisma.siteSettings.findUnique({
        where: { id: "singleton" },
        include: { publishedResume: true },
      });
      if (!s) return defaultSettings();
      return {
        siteTitle: s.siteTitle,
        metaDescription: s.metaDescription,
        contactEmail: s.contactEmail,
        phone: s.phone,
        address: s.address,
        footerTagline: s.footerTagline,
        resumeUrl:
          s.publishedResume?.url ?? s.resumeExternalUrl ?? personalData.resume,
        sections:
          (s.sections as SettingsVM["sections"] | null) ?? DEFAULT_SECTIONS,
        translations: s.translations,
      };
    } catch {
      return defaultSettings();
    }
  },
  ["settings", CACHE_VERSION],
  { tags: [CONTENT_TAGS.settings] },
);

const loadHero = unstable_cache(
  async (): Promise<WithTranslations<HeroVM>> => {
    try {
      const [hero, settings] = await Promise.all([
        prisma.hero.findUnique({
          where: { id: "singleton" },
          include: { heroImage: true },
        }),
        loadSettings(),
      ]);
      if (!hero) return defaultHero(settings.resumeUrl);
      return {
        tagline: hero.tagline,
        headingTop: hero.headingTop,
        headingBottom: hero.headingBottom,
        name: hero.name,
        designation: hero.designation,
        alternateWords: hero.alternateWords,
        subheading: hero.subheading,
        ctaPrimaryLabel: hero.ctaPrimaryLabel,
        ctaPrimaryHref: hero.ctaPrimaryHref,
        ctaResumeLabel: hero.ctaResumeLabel,
        heroImage: hero.heroImage?.url ?? null,
        resumeUrl: settings.resumeUrl,
        translations: hero.translations,
      };
    } catch {
      return defaultHero(personalData.resume);
    }
  },
  ["hero", CACHE_VERSION],
  { tags: [CONTENT_TAGS.hero, CONTENT_TAGS.settings] },
);

const loadProfile = unstable_cache(
  async (): Promise<WithTranslations<ProfileVM>> => {
    try {
      const p = await prisma.profile.findUnique({
        where: { id: "singleton" },
        include: { image: true },
      });
      if (!p) return defaultProfile();
      return {
        aboutTitle: p.aboutTitle,
        aboutHighlight: p.aboutHighlight,
        description: p.description,
        image: p.image?.url ?? personalData.profile,
        name: personalData.name,
        translations: p.translations,
      };
    } catch {
      return defaultProfile();
    }
  },
  ["profile", CACHE_VERSION],
  { tags: [CONTENT_TAGS.profile] },
);

export const getSocialLinks = unstable_cache(
  async (): Promise<SocialVM[]> => {
    try {
      const rows = await prisma.socialLink.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      });
      if (!rows.length) return defaultSocials();
      return rows.map((r) => ({
        platform: r.platform,
        url: r.url,
        iconKey: r.iconKey ?? r.platform.toLowerCase(),
        color: r.color ?? getSocialColor(r.iconKey ?? r.platform),
      }));
    } catch {
      return defaultSocials();
    }
  },
  ["socials", CACHE_VERSION],
  { tags: [CONTENT_TAGS.socials] },
);

const loadSkills = unstable_cache(
  async (): Promise<SkillRow[]> => {
    try {
      const skills = await prisma.skill.findMany({
        where: { active: true },
        orderBy: [{ category: "asc" }, { order: "asc" }],
      });
      if (!skills.length) return defaultSkills();
      return skills.map((s) => ({
        name: s.name,
        iconKey: s.iconKey ?? s.name,
        color: s.color,
        category: s.category,
        translations: s.translations,
      }));
    } catch {
      return defaultSkills();
    }
  },
  ["skills", CACHE_VERSION],
  { tags: [CONTENT_TAGS.skills] },
);

const loadExperiences = unstable_cache(
  async (): Promise<WithTranslations<ExperienceVM>[]> => {
    try {
      const rows = await prisma.experience.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      });
      if (!rows.length) return defaultExperiences();
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        company: r.company,
        duration: r.duration,
        details: r.details,
        translations: r.translations,
      }));
    } catch {
      return defaultExperiences();
    }
  },
  ["experiences", CACHE_VERSION],
  { tags: [CONTENT_TAGS.experiences] },
);

const loadEducations = unstable_cache(
  async (): Promise<WithTranslations<EducationVM>[]> => {
    try {
      const rows = await prisma.education.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      });
      if (!rows.length) return defaultEducations();
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        institution: r.institution,
        duration: r.duration,
        translations: r.translations,
      }));
    } catch {
      return defaultEducations();
    }
  },
  ["educations", CACHE_VERSION],
  { tags: [CONTENT_TAGS.educations] },
);

type ProjectWithImages = {
  legacyId: number | null;
  featured: boolean;
  name: string;
  description: string;
  tools: string[];
  role: string;
  codeUrl: string | null;
  demoUrl: string | null;
  date: string | null;
  highlights: string[];
  challenges: string[];
  translations: unknown;
  primaryImage: { url: string } | null;
  images: { media: { url: string } }[];
};

function projectToRow(p: ProjectWithImages): WithTranslations<ProjectVM> {
  const urls = p.images.map((i) => i.media.url);
  const primaryUrl = p.primaryImage?.url;
  const images = primaryUrl
    ? [primaryUrl, ...urls.filter((u) => u !== primaryUrl)]
    : urls;
  return {
    id: p.legacyId ?? 0,
    name: p.name.trim(),
    description: p.description,
    tools: p.tools,
    role: p.role,
    code: p.codeUrl ?? "",
    demo: p.demoUrl ?? "",
    date: p.date ?? "",
    images,
    featured: p.featured,
    highlights: p.highlights,
    challenges: p.challenges,
    translations: p.translations,
  };
}

const PROJECT_INCLUDE = {
  primaryImage: true,
  images: { include: { media: true }, orderBy: { order: "asc" as const } },
};

const loadProjects = unstable_cache(
  async (): Promise<WithTranslations<ProjectVM>[]> => {
    try {
      const rows = await prisma.project.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        include: PROJECT_INCLUDE,
      });
      if (!rows.length) return defaultProjects();
      return rows.map(projectToRow);
    } catch {
      return defaultProjects();
    }
  },
  ["projects", CACHE_VERSION],
  { tags: [CONTENT_TAGS.projects] },
);

function loadProject(id: number) {
  return unstable_cache(
    async (): Promise<WithTranslations<ProjectVM> | null> => {
      try {
        const p = await prisma.project.findFirst({
          where: { legacyId: id, active: true },
          include: PROJECT_INCLUDE,
        });
        return p ? projectToRow(p) : null;
      } catch {
        return defaultProjects().find((x) => x.id === id) ?? null;
      }
    },
    ["project", String(id), CACHE_VERSION],
    { tags: [CONTENT_TAGS.projects, `project:${id}`] },
  )();
}

// ------------------------------------------------------------------
// Lectures publiques, dans la langue demandée
// ------------------------------------------------------------------
export async function getSettings(locale: Locale = "en"): Promise<SettingsVM> {
  return localize(await loadSettings(), locale, TRANSLATABLE.settings);
}

export async function getHero(locale: Locale = "en"): Promise<HeroVM> {
  return localize(await loadHero(), locale, TRANSLATABLE.hero);
}

export async function getProfile(locale: Locale = "en"): Promise<ProfileVM> {
  return localize(await loadProfile(), locale, TRANSLATABLE.profile);
}

export async function getSkillsGrouped(
  locale: Locale = "en",
): Promise<GroupedSkills> {
  const out: GroupedSkills = {};
  for (const row of await loadSkills()) {
    const { category, ...skill } = row;
    const vm = localize(skill, locale, TRANSLATABLE.skill);
    (out[category] ??= []).push(vm);
  }
  // Ordre d'affichage stable, quel que soit l'ordre des catégories en base.
  return Object.fromEntries(
    SKILL_CATEGORIES.filter((c) => out[c]?.length).map((c) => [c, out[c]]),
  );
}

export async function getExperiences(
  locale: Locale = "en",
): Promise<ExperienceVM[]> {
  return (await loadExperiences()).map((r) =>
    localize(r, locale, TRANSLATABLE.experience),
  );
}

export async function getEducations(
  locale: Locale = "en",
): Promise<EducationVM[]> {
  return (await loadEducations()).map((r) =>
    localize(r, locale, TRANSLATABLE.education),
  );
}

export async function getProjects(locale: Locale = "en"): Promise<ProjectVM[]> {
  return (await loadProjects()).map((r) =>
    localize(r, locale, TRANSLATABLE.project),
  );
}

/** Projets « mis en avant » d'abord (ordre admin), complétés par les suivants. */
export async function getFeaturedProjects(
  locale: Locale = "en",
  limit = 3,
): Promise<ProjectVM[]> {
  const all = await getProjects(locale);
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getProjectByLegacyId(
  id: number,
  locale: Locale = "en",
): Promise<ProjectVM | null> {
  const row = await loadProject(id);
  return row ? localize(row, locale, TRANSLATABLE.project) : null;
}
