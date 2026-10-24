import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Github,
  Globe,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { getProjectByLegacyId, getProjects } from "@/lib/queries";
import { formatProjectDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import ProjectCard from "@/components/site/project-card";
import { CoverFrame } from "@/components/site/project-cover";

type Props = { params: Promise<{ id: string }> };

async function loadProject(id: string) {
  const legacyId = Number.parseInt(id, 10);
  if (!Number.isFinite(legacyId)) return null;
  return getProjectByLegacyId(legacyId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await loadProject((await params).id);
  if (!project) return { title: "Projet introuvable" };
  const description =
    project.description.length > 160
      ? `${project.description.slice(0, 157)}…`
      : project.description;
  return {
    title: project.name,
    description,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      title: project.name,
      description,
      images: project.images[0] ? [{ url: project.images[0] }] : undefined,
    },
  };
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-xl border bg-card p-4 text-sm leading-relaxed text-muted-foreground shadow-sm sm:text-base"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectDetails({ params }: Props) {
  const project = await loadProject((await params).id);
  if (!project) notFound();

  const others = (await getProjects())
    .filter((p) => p.id !== project.id)
    .slice(0, 3);
  const date = formatProjectDate(project.date);
  const gallery = project.images.slice(1);

  return (
    <Container className="py-10 sm:py-14">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Tous les projets
      </Link>

      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          {date && (
            <Badge variant="outline">
              <Calendar className="h-3 w-3" /> {date}
            </Badge>
          )}
          {project.role && (
            <Badge>
              <UserRound className="h-3 w-3" /> {project.role}
            </Badge>
          )}
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.name}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        {(project.demo || project.code) && (
          <div className="flex flex-wrap gap-3">
            {project.demo && (
              <Button asChild size="lg">
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe /> Voir la démo
                </a>
              </Button>
            )}
            {project.code && (
              <Button asChild size="lg" variant="outline">
                <a
                  href={project.code}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github /> Code source
                </a>
              </Button>
            )}
          </div>
        )}
      </header>

      <CoverFrame
        src={project.images[0]}
        alt={project.name}
        sizes="(min-width: 1152px) 1100px, 100vw"
        priority
        className="mt-10 aspect-video overflow-hidden rounded-xl border bg-muted shadow-sm"
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-12">
          <ListSection title="Points forts" items={project.highlights} />
          <ListSection title="Défis relevés" items={project.challenges} />
          {gallery.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Galerie</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {gallery.map((src, i) => (
                  <CoverFrame
                    key={src}
                    src={src}
                    href={src}
                    alt={`${project.name} — capture ${i + 2}`}
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="aspect-video overflow-hidden rounded-xl border bg-muted"
                    imageClassName="transition-transform duration-500 hover:scale-[1.03]"
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm">
            {project.tools.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold">Technologies</h2>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <Badge
                      key={tool}
                      variant="secondary"
                      className="font-normal"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <dl className="flex flex-col gap-3 border-t pt-5 text-sm">
              {project.role && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Rôle</dt>
                  <dd className="text-right font-medium">{project.role}</dd>
                </div>
              )}
              {date && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="text-right font-medium capitalize">{date}</dd>
                </div>
              )}
            </dl>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/#contact">
                <MessageSquare /> Discuter de ce projet
              </Link>
            </Button>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="mt-20 border-t pt-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Autres projets
            </h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-primary hover:underline"
            >
              Tout voir
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
