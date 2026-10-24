import { Briefcase, GraduationCap } from "lucide-react";
import type { EducationVM, ExperienceVM } from "@/lib/content-types";
import { Reveal } from "./reveal";
import { Section, SectionHeader } from "./section";

function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <ol className="relative flex flex-col gap-6 border-l pl-6 sm:pl-8">
      {children}
    </ol>
  );
}

function TimelineItem({
  icon: Icon,
  title,
  subtitle,
  period,
  children,
}: {
  icon: typeof Briefcase;
  title: string;
  subtitle?: string;
  period?: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative">
      <span className="absolute -left-[37px] top-5 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-primary sm:-left-[45px]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <Reveal>
        <article className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground sm:text-lg">
                {title}
              </h3>
              {subtitle && (
                <p className="mt-0.5 text-sm font-medium text-primary">
                  {subtitle}
                </p>
              )}
            </div>
            {period && (
              <span className="shrink-0 font-mono text-xs text-muted-foreground sm:pt-1">
                {period}
              </span>
            )}
          </div>
          {children}
        </article>
      </Reveal>
    </li>
  );
}

export default function Journey({
  experiences,
  educations,
}: {
  experiences: ExperienceVM[];
  educations: EducationVM[];
}) {
  if (experiences.length === 0 && educations.length === 0) return null;

  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="Parcours"
        title="Expérience & formation"
        description="Ce que je recherche aujourd'hui et le chemin parcouru jusqu'ici."
      />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {experiences.length > 0 && (
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Briefcase className="h-4 w-4" /> Expérience
            </h3>
            <Timeline>
              {experiences.map((exp) => (
                <TimelineItem
                  key={exp.id}
                  icon={Briefcase}
                  title={exp.title}
                  subtitle={exp.company}
                  period={exp.duration}
                >
                  {exp.details.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                      {exp.details.map((d, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        )}

        {educations.length > 0 && (
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <GraduationCap className="h-4 w-4" /> Formation
            </h3>
            <Timeline>
              {educations.map((edu) => (
                <TimelineItem
                  key={edu.id}
                  icon={GraduationCap}
                  title={edu.title}
                  subtitle={edu.institution}
                  period={edu.duration}
                />
              ))}
            </Timeline>
          </div>
        )}
      </div>
    </Section>
  );
}
