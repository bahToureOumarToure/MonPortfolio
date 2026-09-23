"use client";
import type { SkillCategory } from "@/../utils/Data/skills";
import { getSkillIcon, getSkillColor } from "@/../utils/skill-icons";
import Marquee from "react-fast-marquee";
import SectionReveal from "../SectionReveal";
import type { GroupedSkills, SkillVM } from "@/lib/content-types";

// --- Item de skill ---
const SkillItem = ({ skill }: { skill: SkillVM }) => {
  const Icon = getSkillIcon(skill.iconKey);
  const color = skill.color ?? getSkillColor(skill.iconKey);

  return (
    <div className="mx-3 my-3 group">
      <div className="relative px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl transition-all duration-500 hover:border-red-500/30 hover:bg-white/[0.05] flex items-center gap-3 shadow-xl">
        <div
          className="text-2xl transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_var(--icon-color)]"
          style={{ "--icon-color": color } as React.CSSProperties}
        >
          <Icon style={{ color: color }} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white tracking-wide uppercase group-hover:text-red-500 transition-colors">
            {skill.name}
          </span>
        </div>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 pointer-events-none blur-xl"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

// --- Ligne de stack (titre + marquee) ---
interface StackRowProps {
  title: SkillCategory;
  skills: SkillVM[];
  direction?: "left" | "right";
  delay?: number;
}

const StackRow = ({
  title,
  skills,
  direction = "left",
  delay = 0,
}: StackRowProps) => {
  if (skills.length === 0) return null;

  return (
    <SectionReveal
      direction={direction === "left" ? "right" : "left"}
      delay={delay}
    >
      <div className="mb-8 lg:mb-12">
        {/* Titre du stack */}
        <div className="flex items-center gap-4 mb-4 px-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-[2px] bg-gradient-to-r from-red-500 to-red-800"></span>
            <h3 className="text-lg lg:text-xl font-black text-white tracking-wider camelcase text-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                {title}
              </span>
            </h3>
          </div>
          <span className="flex-1 h-[1px] bg-gradient-to-r from-red-500/30 to-transparent"></span>
        </div>

        {/* Marquee des skills de ce stack */}
        <Marquee
          speed={35}
          gradient={false}
          pauseOnHover={true}
          direction={direction}
        >
          {/* On duplique pour éviter les trous si peu d'items */}
          {[...skills, ...skills].map((skill, index) => (
            <SkillItem key={`${title}-${index}`} skill={skill} />
          ))}
        </Marquee>
      </div>
    </SectionReveal>
  );
};

// --- Composant principal ---
function Skills({ grouped }: { grouped: GroupedSkills }) {
  // Ordre d'affichage et direction alternée pour l'effet visuel
  const stackOrder: { category: SkillCategory; direction: "left" | "right" }[] =
    [
      { category: "Frontend", direction: "left" },
      { category: "Backend", direction: "right" },
      { category: "Langages", direction: "left" },
      { category: "Database", direction: "right" },
      { category: "Data & IA", direction: "left" },
      { category: "Mobile", direction: "right" },
      { category: "Tools", direction: "left" },
    ];

  return (
    <section
      id="skills"
      className="relative z-50 py-24 lg:py-48 overflow-hidden"
    >
      {/* Background atmosphérique */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-950/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col items-center mb-16 lg:mb-24">
          <SectionReveal direction="down">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 text-red-500">
                <span className="w-8 h-[1px] bg-red-500/50"></span>
                <span className="text-xs font-bold uppercase tracking-[0.5em]">
                  Inventory
                </span>
                <span className="w-8 h-[1px] bg-red-500/50"></span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter text-center">
                The{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 ">
                  Tech Stack
                </span>
              </h2>
            </div>
          </SectionReveal>
        </div>

        {/* Stacks par catégorie */}
        <div className="flex flex-col relative font-bold ">
          {stackOrder.map(({ category, direction }, index) => (
            <StackRow
              key={category}
              title={category}
              skills={grouped[category]}
              direction={direction}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
