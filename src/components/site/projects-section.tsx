import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectVM } from "@/lib/content-types";
import { Button } from "@/components/ui/button";
import ProjectCard from "./project-card";
import { Reveal } from "./reveal";
import { Section, SectionHeader } from "./section";

export default function ProjectsSection({
  projects,
}: {
  projects: ProjectVM[];
}) {
  if (projects.length === 0) return null;
  return (
    <Section id="projects">
      <SectionHeader
        eyebrow="Projets"
        title="Projets sélectionnés"
        description="Une sélection de réalisations : applications full-stack, mobile, data et IA."
        action={
          <Button asChild variant="outline" className="w-fit">
            <Link href="/projects">
              Tous les projets <ArrowRight />
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
