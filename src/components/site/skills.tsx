import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { GroupedSkills, SkillVM } from "@/lib/content-types";
import type { SkillCategoryKey } from "@/lib/skill-categories";
import { iconColor } from "@/lib/color";
import { cn } from "@/lib/utils";
import { getSkillColor, getSkillIcon } from "@/../utils/skill-icons";
import { Reveal } from "./reveal";
import { Section, SectionHeader } from "./section";

const CATEGORY_ORDER: SkillCategoryKey[] = [
  "FRONTEND",
  "BACKEND",
  "LANGAGES",
  "DATABASE",
  "DEVOPS",
  "DATA_IA",
  "MOBILE",
  "TOOLS",
  "SOFT_SKILLS",
];

/** Nombre minimal de pastilles par copie pour qu'une ligne ne laisse jamais de vide. */
const MIN_ITEMS_PER_COPY = 10;
/** Durée de défilement par pastille (vitesse constante d'une ligne à l'autre). */
const SECONDS_PER_ITEM = 3.2;

function SkillPill({ skill, hidden }: { skill: SkillVM; hidden?: boolean }) {
  const Icon = getSkillIcon(skill.iconKey);
  const color = iconColor(skill.color ?? getSkillColor(skill.iconKey));
  return (
    <li
      aria-hidden={hidden || undefined}
      dir="auto"
      className="inline-flex shrink-0 items-center gap-2.5 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm"
    >
      <Icon
        aria-hidden="true"
        className={cn("h-[18px] w-[18px] shrink-0", !color && "text-primary")}
        style={color ? { color } : undefined}
      />
      {skill.name}
    </li>
  );
}

/**
 * Ligne qui défile horizontalement en continu (CSS pur, pause au survol).
 * La liste est dupliquée pour une boucle sans à-coup ; les copies sont
 * masquées aux lecteurs d'écran. Animations réduites : liste statique.
 */
function MarqueeRow({
  skills,
  reverse,
}: {
  skills: SkillVM[];
  reverse: boolean;
}) {
  const repeat = Math.max(1, Math.ceil(MIN_ITEMS_PER_COPY / skills.length));
  const filler = Array.from({ length: repeat - 1 }, () => skills).flat();
  const perCopy = skills.length * repeat;
  const style = {
    "--marquee-duration": `${Math.round(perCopy * SECONDS_PER_ITEM)}s`,
    animationDirection: reverse ? "reverse" : "normal",
  } as CSSProperties;

  return (
    // Défilement toujours de gauche à droite, y compris en arabe : la boucle
    // CSS (translateX -50 %) suppose un ordre de gauche à droite.
    <div
      dir="ltr"
      className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none"
        style={style}
      >
        <ul className="flex shrink-0 gap-3 pr-3 motion-reduce:flex-wrap">
          {skills.map((s) => (
            <SkillPill key={s.name} skill={s} />
          ))}
          {filler.map((s, i) => (
            <SkillPill key={`f-${i}`} skill={s} hidden />
          ))}
        </ul>
        <ul
          aria-hidden="true"
          className="flex shrink-0 gap-3 pr-3 motion-reduce:hidden"
        >
          {[...skills, ...filler].map((s, i) => (
            <SkillPill key={`c-${i}`} skill={s} hidden />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Skills({ grouped }: { grouped: GroupedSkills }) {
  const t = useTranslations("Skills");
  const categories = CATEGORY_ORDER.filter((c) => grouped[c]?.length);
  if (categories.length === 0) return null;

  return (
    <Section id="skills" muted>
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="flex flex-col gap-7">
        {categories.map((category, i) => (
          <Reveal key={category}>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {t(`categories.${category}`)}
              </h3>
              <span className="font-mono text-xs text-muted-foreground">
                {grouped[category]?.length}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <MarqueeRow
              skills={grouped[category] ?? []}
              reverse={i % 2 === 1}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
