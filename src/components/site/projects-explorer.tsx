"use client";
import { useMemo, useState } from "react";
import type { ProjectVM } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import ProjectCard from "./project-card";

const MAX_FILTERS = 10;

/** Grille de projets filtrable par technologie. */
export default function ProjectsExplorer({
  projects,
}: {
  projects: ProjectVM[];
}) {
  const [tool, setTool] = useState<string | null>(null);

  const tools = useMemo(() => {
    const count = new Map<string, number>();
    for (const p of projects)
      for (const t of p.tools) count.set(t, (count.get(t) ?? 0) + 1);
    return [...count.entries()]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, MAX_FILTERS)
      .map(([t]) => t);
  }, [projects]);

  const visible = tool
    ? projects.filter((p) => p.tools.includes(tool))
    : projects;

  return (
    <div className="flex flex-col gap-8">
      {tools.length > 0 && (
        <div
          role="group"
          aria-label="Filtrer par technologie"
          className="flex flex-wrap gap-2"
        >
          {[null, ...tools].map((t) => {
            const active = t === tool;
            return (
              <button
                key={t ?? "all"}
                type="button"
                onClick={() => setTool(t)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
              >
                {t ?? "Tous"}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {visible.length} projet{visible.length > 1 ? "s" : ""}
        {tool ? ` avec ${tool}` : ""}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <ProjectCard key={project.id} project={project} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
