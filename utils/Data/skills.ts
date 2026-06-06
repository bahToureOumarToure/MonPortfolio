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
  | "Tools";

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

  // --- Mobile ---
  { name: "Flutter", category: "Mobile" },

  // --- Tools ---
  { name: "Git", category: "Tools" },
  { name: "Figma", category: "Tools" },
  { name: "Canva", category: "Tools" },
  { name: "Illustrator", category: "Tools" },
  { name: "Photoshop", category: "Tools" },
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
  };

  skillsData.forEach((skill) => {
    grouped[skill.category].push(skill.name);
  });

  return grouped;
};
