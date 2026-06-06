import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiFirebase,
  SiGit,
  SiFigma,
  SiBootstrap,
  SiMui,
  SiCanva,
  SiFreelancer,
  SiFlutter,
  SiPython,
  SiSpringboot,
  SiDotnet,
  SiCplusplus,
  SiC,
  SiOpenai,
} from "react-icons/si";
import { IconType } from "react-icons";
import { TbBrandCSharp, TbSql } from "react-icons/tb";
import { FaDatabase, FaBrain, FaChartBar } from "react-icons/fa";

// ============================================
// MAPPING DES ICÔNES
// ============================================
export const getSkillIcon = (skill: string): IconType => {
  const skillLower = skill.toLowerCase().trim();

  switch (skillLower) {
    // --- Frontend ---
    case "html":
    case "html5":
      return SiHtml5;
    case "css":
    case "css3":
      return SiCss3;
    case "javascript":
    case "js":
      return SiJavascript;
    case "typescript":
    case "ts":
      return SiTypescript;
    case "react":
    case "reactjs":
    case "react.js":
      return SiReact;
    case "next js":
    case "nextjs":
    case "next.js":
      return SiNextdotjs;
    case "tailwind":
    case "tailwindcss":
    case "tailwind css":
      return SiTailwindcss;
    case "bootstrap":
      return SiBootstrap;
    case "materialui":
    case "material ui":
    case "mui":
      return SiMui;

    // --- Backend ---
    case "node js":
    case "nodejs":
    case "node.js":
      return SiNodedotjs;
    case "spring boot":
    case "springboot":
    case "spring":
      return SiSpringboot;
    case ".net":
    case "dotnet":
    case "dot net":
    case "asp.net":
      return SiDotnet;

    // --- Langages ---
    case "python":
    case "py":
      return SiPython;
    case "c#":
    case "csharp":
    case "c sharp":
      return TbBrandCSharp;
    case "c++":
    case "cpp":
    case "cplusplus":
      return SiCplusplus;
    case "c":
      return SiC;

    // --- Bases de données ---
    case "mongodb":
    case "mongo":
      return SiMongodb;
    case "mysql":
      return SiMysql;
    case "postgresql":
    case "postgres":
    case "postgre sql":
      return SiPostgresql;
    case "sql":
      return TbSql;
    case "firebase":
      return SiFirebase;

    // --- Data / BI / IA ---
    case "power bi":
    case "powerbi":
      return FaChartBar; // ✅ icône graphique pour Power BI
    case "ia":
    case "ai":
    case "intelligence artificielle":
    case "artificial intelligence":
      return FaBrain;
    case "openai":
    case "chatgpt":
    case "gpt":
      return SiOpenai;
    case "linq":
      return FaDatabase;

    // --- Mobile ---
    case "flutter":
      return SiFlutter;

    // --- Outils ---
    case "git":
      return SiGit;
    case "figma":
      return SiFigma;
    case "canva":
      return SiCanva;
    case "illustrator":
    case "adobe illustrator":
    case "photoshop":

    default:
      return SiFreelancer;
  }
};

// ============================================
// COULEURS OFFICIELLES
// ============================================
export const getSkillColor = (skill: string): string => {
  const skillLower = skill.toLowerCase().trim();

  switch (skillLower) {
    // --- Frontend ---
    case "html":
    case "html5":
      return "#E34F26";
    case "css":
    case "css3":
      return "#1572B6";
    case "javascript":
    case "js":
      return "#F7DF1E";
    case "typescript":
    case "ts":
      return "#3178C6";
    case "react":
    case "reactjs":
    case "react.js":
      return "#61DAFB";
    case "next js":
    case "nextjs":
    case "next.js":
      return "#FFFFFF";
    case "tailwind":
    case "tailwindcss":
    case "tailwind css":
      return "#06B6D4";
    case "bootstrap":
      return "#7952B3";
    case "materialui":
    case "material ui":
    case "mui":
      return "#007FFF";

    // --- Backend ---
    case "node js":
    case "nodejs":
    case "node.js":
      return "#339933";
    case "spring boot":
    case "springboot":
    case "spring":
      return "#6DB33F";
    case ".net":
    case "dotnet":
    case "dot net":
    case "asp.net":
      return "#512BD4";

    // --- Langages ---
    case "python":
    case "py":
      return "#3776AB";
    case "c#":
    case "csharp":
    case "c sharp":
      return "#9B4F96";
    case "c++":
    case "cpp":
    case "cplusplus":
      return "#00599C";
    case "c":
      return "#A8B9CC";

    // --- Bases de données ---
    case "mongodb":
    case "mongo":
      return "#47A248";
    case "mysql":
      return "#4479A1";
    case "postgresql":
    case "postgres":
    case "postgre sql":
      return "#4169E1";
    case "sql":
      return "#CC2927";
    case "firebase":
      return "#FFCA28";

    // --- Data / BI / IA ---
    case "power bi":
    case "powerbi":
      return "#F2C811";
    case "ia":
    case "ai":
    case "intelligence artificielle":
    case "artificial intelligence":
      return "#FF6F61";
    case "openai":
    case "chatgpt":
    case "gpt":
      return "#412991";
    case "linq":
      return "#68217A";

    // --- Mobile ---
    case "flutter":
      return "#02569B";

    // --- Outils ---
    case "git":
      return "#F05032";
    case "figma":
      return "#F24E1E";
    case "canva":
      return "#00C4CC";
    case "illustrator":
    case "adobe illustrator":
      return "#FF9A00"; // Orange Illustrator
    case "photoshop":
    case "adobe photoshop":
      return "#31A8FF"; // Bleu Photoshop

    default:
      return "#EF4444";
  }
};
