// utils/Data/skills.ts

export interface Skill {
  name: string;
  category: SkillCategory;
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
  { name: "IA", category: "Data & IA" },
  { name: "Machine Learning", category: "Data & IA" },
  { name: "Deep Learning", category: "Data & IA" },
  { name: "LangChain", category: "Data & IA" },
  { name: "TensorFlow", category: "Data & IA" },
  { name: "Claude Code", category: "Data & IA" },
  { name: "Antigravity", category: "Data & IA" },
  { name: "RAG", category: "Data & IA" },
  { name: "Agentic AI", category: "Data & IA" },
  { name: "Multi-Agent AI", category: "Data & IA" },
  { name: "LLM", category: "Data & IA" },
  { name: "Prompt Engineering", category: "Data & IA" },

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
  { name: "Écoute active", category: "Soft skills" },
  { name: "Empathique", category: "Soft skills" },
  { name: "Curieux", category: "Soft skills" },
  { name: "Motivé", category: "Soft skills" },
  { name: "Apprentissage continu", category: "Soft skills" },
  { name: "Esprit d'équipe", category: "Soft skills" },
  { name: "Autonome", category: "Soft skills" },
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
