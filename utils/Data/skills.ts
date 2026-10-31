// utils/Data/skills.ts

export interface Skill {
  /** Nom de base (anglais, langue par défaut du site). */
  name: string;
  category: SkillCategory;
  /** Nom traduit quand il diffère (les noms de technologies ne changent pas). */
  translations?: Partial<Record<"fr" | "es" | "ar", string>>;
}

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Langages"
  | "Database"
  | "Data & IA"
  | "Mobile"
  | "Tools"
  | "DevOps"
  | "Soft skills";

export const skillsData: Skill[] = [
  // --- Frontend ---
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
  { name: "Javascript", category: "Frontend" },
  //{ name: "Typescript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  //{ name: "Next JS", category: "Frontend" },
  { name: "Tailwind", category: "Frontend" },
  { name: "MaterialUI", category: "Frontend" },

  // --- Backend ---
  { name: "Spring Boot", category: "Backend" },
  { name: ".NET", category: "Backend" },

  // --- Langages ---
  { name: "Python", category: "Langages" },
  { name: "C#", category: "Langages" },
  { name: "C++", category: "Langages" },
  { name: "C", category: "Langages" },

  // --- Bases de données ---
  { name: "MySQL", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "SQL", category: "Database" },
  { name: "Firebase", category: "Database" },
  { name: "LINQ", category: "Database" },

  // --- Data & IA ---
  { name: "Power BI", category: "Data & IA" },
  {
    name: "AI",
    category: "Data & IA",
    translations: { fr: "IA", es: "IA", ar: "الذكاء الاصطناعي" },
  },
  {
    name: "Machine Learning",
    category: "Data & IA",
    translations: { ar: "تعلم الآلة" },
  },
  {
    name: "Deep Learning",
    category: "Data & IA",
    translations: { ar: "التعلم العميق" },
  },
  { name: "LangChain", category: "Data & IA" },
  { name: "TensorFlow", category: "Data & IA" },
  { name: "Claude Code", category: "Data & IA" },
  { name: "Antigravity", category: "Data & IA" },
  { name: "RAG", category: "Data & IA" },
  {
    name: "Agentic AI",
    category: "Data & IA",
    translations: {
      fr: "IA agentique",
      es: "IA agéntica",
      ar: "الذكاء الاصطناعي الوكيلي",
    },
  },
  {
    name: "Multi-Agent AI",
    category: "Data & IA",
    translations: {
      fr: "IA multi-agents",
      es: "IA multiagente",
      ar: "الأنظمة متعددة الوكلاء",
    },
  },
  { name: "LLM", category: "Data & IA" },
  {
    name: "Prompt Engineering",
    category: "Data & IA",
    translations: { es: "Ingeniería de prompts", ar: "هندسة الأوامر" },
  },

  // --- Mobile ---
  { name: "Flutter", category: "Mobile" },

  // --- Tools ---
  { name: "Git", category: "Tools" },
  { name: "Figma", category: "Tools" },
  { name: "Canva", category: "Tools" },
  { name: "Illustrator", category: "Tools" },
  { name: "Photoshop", category: "Tools" },

  // --- DevOps ---
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "Jenkins", category: "DevOps" },
  { name: "GitHub Actions", category: "DevOps" },
  { name: "CI/CD", category: "DevOps" },
  { name: "Linux", category: "DevOps" },

  // --- Soft skills ---
  { name: "Agile / Scrum", category: "Soft skills" },
  {
    name: "Active listening",
    category: "Soft skills",
    translations: {
      fr: "Écoute active",
      es: "Escucha activa",
      ar: "الإصغاء الفعّال",
    },
  },
  {
    name: "Empathetic",
    category: "Soft skills",
    translations: { fr: "Empathique", es: "Empático", ar: "متعاطف" },
  },
  {
    name: "Curious",
    category: "Soft skills",
    translations: { fr: "Curieux", es: "Curioso", ar: "فضولي" },
  },
  {
    name: "Motivated",
    category: "Soft skills",
    translations: { fr: "Motivé", es: "Motivado", ar: "متحفّز" },
  },
  {
    name: "Continuous learning",
    category: "Soft skills",
    translations: {
      fr: "Apprentissage continu",
      es: "Aprendizaje continuo",
      ar: "التعلم المستمر",
    },
  },
  {
    name: "Team spirit",
    category: "Soft skills",
    translations: {
      fr: "Esprit d'équipe",
      es: "Espíritu de equipo",
      ar: "روح الفريق",
    },
  },
  {
    name: "Autonomous",
    category: "Soft skills",
    translations: { fr: "Autonome", es: "Autónomo", ar: "مستقل" },
  },
];

// Helper pour grouper par catégorie
export const getSkillsByCategory = () => {
  const grouped: Record<SkillCategory, string[]> = {
    Frontend: [],
    Backend: [],
    Langages: [],
    Database: [],
    "Data & IA": [],
    Mobile: [],
    Tools: [],
    DevOps: [],
    "Soft skills": [],
  };

  skillsData.forEach((skill) => {
    grouped[skill.category].push(skill.name);
  });

  return grouped;
};
