import Link from "next/link";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import type { ProjectVM } from "@/lib/content-types";
import { Badge } from "@/components/ui/badge";
import { ProjectCover } from "./project-cover";

const MAX_TOOLS = 4;

function isRecent(date: string): boolean {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return false;
  const diff = Date.now() - d.getTime();
  return diff >= 0 && diff < 1000 * 60 * 60 * 24 * 45;
}

export default function ProjectCard({
  project,
  priority = false,
}: {
  project: ProjectVM;
  priority?: boolean;
}) {
  const extra = project.tools.length - MAX_TOOLS;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-video overflow-hidden border-b bg-muted">
        <ProjectCover
          src={project.images[0]}
          alt={project.name}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {isRecent(project.date) && (
          <Badge variant="solid" className="absolute left-3 top-3 shadow-sm">
            Nouveau
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug text-foreground">
            <Link
              href={`/projects/${project.id}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {project.name}
            </Link>
          </h3>
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        {project.role && (
          <p className="-mt-1.5 text-xs font-medium text-primary">
            {project.role}
          </p>
        )}
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.tools.slice(0, MAX_TOOLS).map((tool) => (
            <Badge key={tool} variant="secondary" className="font-normal">
              {tool}
            </Badge>
          ))}
          {extra > 0 && (
            <Badge variant="outline" className="font-normal">
              +{extra}
            </Badge>
          )}
        </div>

        {(project.demo || project.code) && (
          <div className="relative z-10 flex gap-4 border-t pt-3 text-sm">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Globe className="h-4 w-4" /> Démo
              </a>
            )}
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" /> Code
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
