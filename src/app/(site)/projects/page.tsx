import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import ProjectsExplorer from "@/components/site/projects-explorer";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Tous les projets de Bah Oumar Touré : applications full-stack, mobile, data et intelligence artificielle.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <Container className="py-14 sm:py-20">
      <header className="mb-10 flex max-w-2xl flex-col gap-3">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Projets
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Toutes mes réalisations
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Applications full-stack, mobile, data et IA — conçues, développées et
          déployées de bout en bout.
        </p>
      </header>
      <ProjectsExplorer projects={projects} />
    </Container>
  );
}
