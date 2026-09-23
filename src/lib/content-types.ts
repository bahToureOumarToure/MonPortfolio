// View-models consommés par le portfolio public.
// Ils gardent la forme attendue par les composants existants (ex. Project.id numérique)
// afin de minimiser les changements de rendu lors du passage aux données dynamiques.

import type { SkillCategory } from "../../utils/Data/skills";

export interface ProjectVM {
  id: number; // legacyId — préserve les routes /projects/[id] et ProjectCardProps
  name: string;
  description: string;
  tools: string[];
  role: string;
  code: string; // "" si absent
  demo: string; // "" si absent
  date: string;
  images: string[];
  videos?: string[];
  highlights?: string[];
  challenges?: string[];
}

export interface HeroVM {
  tagline: string;
  headingTop: string;
  headingBottom: string;
  name: string;
  designation: string;
  alternateWords: string[];
  subheading: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaResumeLabel: string;
  heroImage: string | null;
  resumeUrl: string;
}

export interface ProfileVM {
  aboutTitle: string;
  aboutHighlight: string;
  description: string;
  image: string;
  name: string;
}

export interface SettingsVM {
  siteTitle: string;
  metaDescription: string;
  contactEmail: string;
  phone: string;
  address: string;
  footerTagline: string;
  resumeUrl: string;
  sections: Record<string, { visible: boolean; order: number }>;
}

export interface SocialVM {
  platform: string;
  url: string;
  iconKey: string;
  color: string;
}

export interface SkillVM {
  name: string;
  iconKey: string;
  color: string | null;
}

export type GroupedSkills = Record<SkillCategory, SkillVM[]>;

export interface ExperienceVM {
  id: string | number;
  title: string;
  company: string;
  duration: string;
  details: string[];
}
