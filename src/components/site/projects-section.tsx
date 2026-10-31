import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { ProjectVM } from "@/lib/content-types";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import ProjectCard from "./project-card";
import { Reveal } from "./reveal";
import { Section, SectionHeader } from "./section";

export default function ProjectsSection({
  projects,
}: {
  projects: ProjectVM[];
}) {
  const t = useTranslations("Projects");
  if (projects.length === 0) return null;
  return (
    <Section id="projects">
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        action={
          <Button asChild variant="outline" className="w-fit">
            <Link href="/projects">
              {t("viewAll")} <ArrowRight className="rtl:rotate-180" />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 60} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
