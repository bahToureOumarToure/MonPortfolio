"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, FolderGit2, Pencil, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  deleteProject,
  reorderProjects,
  setProjectFlags,
} from "@/lib/actions/projects";
import DeleteButton from "./DeleteButton";
import ReorderButtons from "./ReorderButtons";
import Thumb from "./Thumb";
import { EmptyState, StatusBadge } from "./ui";
import { move, useAction } from "./use-action";

export interface ProjectRow {
  id: string;
  legacyId: number | null;
  name: string;
  role: string;
  cover: string | null;
  active: boolean;
  featured: boolean;
}

export default function ProjectsTable({ initial }: { initial: ProjectRow[] }) {
  const [rows, setRows] = useState(initial);
  const { pending, execute } = useAction();
  useEffect(() => setRows(initial), [initial]);

  async function onMove(from: number, to: number) {
    const next = move(rows, from, to);
    setRows(next);
    const res = await execute(() => reorderProjects(next.map((r) => r.id)), {
      success: "Ordre mis à jour.",
    });
    if (!res.ok) setRows(rows);
  }

  async function toggle(row: ProjectRow, flag: "active" | "featured") {
    const value = !row[flag];
    setRows((list) =>
      list.map((r) => (r.id === row.id ? { ...r, [flag]: value } : r)),
    );
    const res = await execute(
      () => setProjectFlags(row.id, { [flag]: value }),
      {
        success:
          flag === "active"
            ? value
              ? "Projet visible sur le site."
              : "Projet masqué."
            : value
              ? "Projet mis en avant."
              : "Projet retiré de la mise en avant.",
      },
    );
    if (!res.ok)
      setRows((list) => list.map((r) => (r.id === row.id ? row : r)));
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<FolderGit2 className="h-8 w-8" />}
        title="Aucun projet"
        description="Crée ton premier projet pour l'afficher sur le portfolio."
        action={
          <Button asChild>
            <Link href="/admin/projects/new">Nouveau projet</Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
      {rows.map((row, i) => (
        <li
          key={row.id}
          className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap sm:gap-4 sm:p-4"
        >
          <ReorderButtons
            index={i}
            count={rows.length}
            onMove={onMove}
            disabled={pending}
          />
          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
            <Thumb src={row.cover} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 truncate font-medium">
              {row.name}
              {row.featured && (
                <Star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />
              )}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge active={row.active} />
              {row.role && (
                <span className="truncate text-xs text-muted-foreground">
                  {row.role}
                </span>
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-1 sm:w-auto">
            <Button
              variant="ghost"
              size="icon-sm"
              title={
                row.featured ? "Retirer de la mise en avant" : "Mettre en avant"
              }
              aria-label={
                row.featured ? "Retirer de la mise en avant" : "Mettre en avant"
              }
              aria-pressed={row.featured}
              onClick={() => toggle(row, "featured")}
            >
              <Star
                className={cn(row.featured && "fill-warning text-warning")}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggle(row, "active")}
              aria-pressed={row.active}
            >
              {row.active ? "Masquer" : "Afficher"}
            </Button>
            {row.legacyId != null && row.active && (
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                title="Voir sur le site"
                aria-label="Voir sur le site"
              >
                <a
                  href={`/projects/${row.legacyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink />
                </a>
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/projects/${row.id}/edit`}>
                <Pencil /> Éditer
              </Link>
            </Button>
            <DeleteButton
              compact
              action={() => deleteProject(row.id)}
              confirmText={`Supprimer « ${row.name} » ? Cette action est définitive.`}
              successText="Projet supprimé."
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
