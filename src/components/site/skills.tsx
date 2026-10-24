import type { GroupedSkills } from "@/lib/content-types";
import type { SkillCategory } from "@/../utils/Data/skills";
import { iconColor } from "@/lib/color";
import { getSkillColor, getSkillIcon } from "@/../utils/skill-icons";
import { Reveal } from "./reveal";
import { Section, SectionHeader } from "./section";

const CATEGORY_ORDER: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Langages",
  "Database",
  "Data & IA",
  "Mobile",
  "Tools",
];

export default function Skills({ grouped }: { grouped: GroupedSkills }) {
  const categories = CATEGORY_ORDER.filter((c) => grouped[c]?.length);
  if (categories.length === 0) return null;

  return (
    <Section id="skills" muted>
      <SectionHeader
        eyebrow="Compétences"
        title="Ma stack technique"
        description="Les langages, frameworks et outils que j'utilise pour concevoir, développer et déployer."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <Reveal key={category} delay={(i % 3) * 60}>
            <div className="h-full rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 flex items-center justify-between text-sm font-semibold text-foreground">
                {category}
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  {grouped[category].length}
                </span>
              </h3>
              <ul className="flex flex-wrap gap-2">
                {grouped[category].map((skill) => {
                  const Icon = getSkillIcon(skill.iconKey);
                  const color = iconColor(
                    skill.color ?? getSkillColor(skill.iconKey),
                  );
                  return (
                    <li
                      key={skill.name}
                      className="inline-flex items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-sm text-foreground"
                    >
                      <Icon
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                        style={color ? { color } : undefined}
                      />
                      {skill.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
