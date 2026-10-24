// Catégories de compétences (sans dépendance : importable côté client).
export const SKILL_CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "LANGAGES",
  "DATABASE",
  "DATA_IA",
  "MOBILE",
  "TOOLS",
] as const;

export type SkillCategoryKey = (typeof SKILL_CATEGORIES)[number];

export const SKILL_CATEGORY_LABELS: Record<SkillCategoryKey, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  LANGAGES: "Langages",
  DATABASE: "Database",
  DATA_IA: "Data & IA",
  MOBILE: "Mobile",
  TOOLS: "Tools",
};
