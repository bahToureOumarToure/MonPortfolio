// Couche d'accès aux données du portfolio public.
// - Lectures depuis la DB (Prisma), mises en cache et taguées pour la revalidation.
// - Repli automatique sur le contenu existant (utils/Data/*) si la DB est
//   indisponible ou non encore seedée => parité garantie, build jamais cassé.
import { unstable_cache } from "next/cache";
import { SkillCategory as PrismaSkillCategory } from "@prisma/client";
import { prisma } from "./db";
import type {
  HeroVM,
  ProfileVM,
  SettingsVM,
  SocialVM,
  GroupedSkills,
  ProjectVM,
  ExperienceVM,
} from "./content-types";
import { personalData } from "../../utils/Data/PersonalData";
import { projectsData } from "../../utils/Data/projects-data";
import {
  getSkillsByCategory,
  type SkillCategory,
} from "../../utils/Data/skills";
import { experiences as experiencesData } from "../../utils/Data/experience";
import { getSocialColor } from "../../utils/social-icons";

export const CONTENT_TAGS = {
  hero: "hero",
  profile: "profile",
  settings: "settings",
  socials: "socials",
  skills: "skills",
  projects: "projects",
  experiences: "experiences",
} as const;

const CATEGORY_LABEL: Record<PrismaSkillCategory, SkillCategory> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  LANGAGES: "Langages",
  DATABASE: "Database",
  DATA_IA: "Data & IA",
  MOBILE: "Mobile",
  TOOLS: "Tools",
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
// Valeurs par défaut (parité avec le contenu actuellement hardcodé)
// ------------------------------------------------------------------
function defaultSettings(): SettingsVM {
  return {
    siteTitle: "Bah Oumar Touré Portfolio",
    metaDescription:
      "Portfolio de Bah Oumar Touré — Étudiant ingénieur ENIAD Berkane. IA, Data, DevOps & Full-Stack.",
    contactEmail: personalData.email,
    phone: personalData.phone,
    address: personalData.address,
    footerTagline:
      "A curated showcase of high-performance full-stack applications, AI experiments, and intuitive digital experiences built with purpose.",
    resumeUrl: personalData.resume,
    sections: DEFAULT_SECTIONS,
  };
}

function defaultHero(resumeUrl: string): HeroVM {
  return {
    tagline: "WELCOME TO MY UNIVERSE",
    headingTop: "Crafting Digital",
    headingBottom: "Masterpieces",
    name: personalData.name,
    designation: personalData.designation,
    alternateWords: personalData.designationAlternateWords,
    subheading:
      "dedicated to building high-performance, user-focused digital products",
    ctaPrimaryLabel: "Let's Collaborate",
    ctaPrimaryHref: "/#contact",
    ctaResumeLabel: "Get Resume",
    heroImage: null,
    resumeUrl,
  };
}

function defaultProfile(): ProfileVM {
  return {
    aboutTitle: "About",
    aboutHighlight: "The Software Engineer",
    description: personalData.description,
    image: personalData.profile,
    name: personalData.name,
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

function defaultSkillsGrouped(): GroupedSkills {
  const grouped = getSkillsByCategory();
  const out = {} as GroupedSkills;
  (Object.keys(grouped) as SkillCategory[]).forEach((cat) => {
    out[cat] = grouped[cat].map((name) => ({
      name,
      iconKey: name,
      color: null,
    }));
  });
  return out;
}

function defaultProjects(): ProjectVM[] {
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
    videos: p.videos,
    highlights: p.highlights,
    challenges: p.challenges,
  }));
}

function defaultExperiences(): ExperienceVM[] {
  return experiencesData.map((e) => ({
    id: e.id,
    title: e.title,
    company: e.company,
    duration: e.duration,
    details: e.details,
  }));
}

// ------------------------------------------------------------------
// Lectures (DB -> VM, avec repli)
// ------------------------------------------------------------------
export const getSettings = unstable_cache(
  async (): Promise<SettingsVM> => {
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
      };
    } catch {
      return defaultSettings();
    }
  },
  ["settings"],
  { tags: [CONTENT_TAGS.settings] },
);

export const getHero = unstable_cache(
  async (): Promise<HeroVM> => {
    try {
      const [hero, settings] = await Promise.all([
        prisma.hero.findUnique({
          where: { id: "singleton" },
          include: { heroImage: true },
        }),
        getSettings(),
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
      };
    } catch {
      return defaultHero(personalData.resume);
    }
  },
  ["hero"],
  { tags: [CONTENT_TAGS.hero, CONTENT_TAGS.settings] },
);

export const getProfile = unstable_cache(
  async (): Promise<ProfileVM> => {
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
      };
    } catch {
      return defaultProfile();
    }
  },
  ["profile"],
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
  ["socials"],
  { tags: [CONTENT_TAGS.socials] },
);

export const getSkillsGrouped = unstable_cache(
  async (): Promise<GroupedSkills> => {
    try {
      const skills = await prisma.skill.findMany({
        where: { active: true },
        orderBy: [{ category: "asc" }, { order: "asc" }],
      });
      if (!skills.length) return defaultSkillsGrouped();
      const out: GroupedSkills = {
        Frontend: [],
        Backend: [],
        Langages: [],
        Database: [],
        "Data & IA": [],
        Mobile: [],
        Tools: [],
      };
      for (const s of skills) {
        const label = CATEGORY_LABEL[s.category];
        out[label].push({
          name: s.name,
          iconKey: s.iconKey ?? s.name,
          color: s.color,
        });
      }
      return out;
    } catch {
      return defaultSkillsGrouped();
    }
  },
  ["skills"],
  { tags: [CONTENT_TAGS.skills] },
);

export const getExperiences = unstable_cache(
  async (): Promise<ExperienceVM[]> => {
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
      }));
    } catch {
      return defaultExperiences();
    }
  },
  ["experiences"],
  { tags: [CONTENT_TAGS.experiences] },
);

type ProjectWithImages = {
  legacyId: number | null;
  name: string;
  description: string;
  tools: string[];
  role: string;
  codeUrl: string | null;
  demoUrl: string | null;
  date: string | null;
  highlights: string[];
  challenges: string[];
  primaryImage: { url: string } | null;
  images: { media: { url: string } }[];
};

function projectToVM(p: ProjectWithImages): ProjectVM {
  const urls = p.images.map((i) => i.media.url);
  const primaryUrl = p.primaryImage?.url;
  const images = primaryUrl
    ? [primaryUrl, ...urls.filter((u) => u !== primaryUrl)]
    : urls;
  return {
    id: p.legacyId ?? 0,
    name: p.name,
    description: p.description,
    tools: p.tools,
    role: p.role,
    code: p.codeUrl ?? "",
    demo: p.demoUrl ?? "",
    date: p.date ?? "",
    images,
    highlights: p.highlights,
    challenges: p.challenges,
  };
}

const PROJECT_INCLUDE = {
  primaryImage: true,
  images: { include: { media: true }, orderBy: { order: "asc" as const } },
};

export const getProjects = unstable_cache(
  async (): Promise<ProjectVM[]> => {
    try {
      const rows = await prisma.project.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        include: PROJECT_INCLUDE,
      });
      if (!rows.length) return defaultProjects();
      return rows.map(projectToVM);
    } catch {
      return defaultProjects();
    }
  },
  ["projects"],
  { tags: [CONTENT_TAGS.projects] },
);

export async function getFeaturedProjects(limit = 3): Promise<ProjectVM[]> {
  const all = await getProjects();
  return all.slice(0, limit);
}

export function getProjectByLegacyId(id: number): Promise<ProjectVM | null> {
  return unstable_cache(
    async (): Promise<ProjectVM | null> => {
      try {
        const p = await prisma.project.findFirst({
          where: { legacyId: id, active: true },
          include: PROJECT_INCLUDE,
        });
        return p ? projectToVM(p) : null;
      } catch {
        return defaultProjects().find((x) => x.id === id) ?? null;
      }
    },
    ["project", String(id)],
    { tags: [CONTENT_TAGS.projects, `project:${id}`] },
  )();
}
