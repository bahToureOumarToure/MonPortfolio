"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { createProject, updateProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MediaPicker from "./MediaPicker";
import { Checkbox, Field, Panel } from "./ui";
import TranslationsEditor, {
  translationsFromJson,
  translationsToPayload,
  type TranslationField,
} from "./TranslationsEditor";
import { useAction, useUnsavedWarning } from "./use-action";

export interface ProjectFormValues {
  name: string;
  description: string;
  role: string;
  tools: string; // séparés par des virgules
  highlights: string; // une ligne par élément
  challenges: string;
  codeUrl: string;
  demoUrl: string;
  date: string;
  status: string;
  featured: boolean;
  active: boolean;
  images: string[]; // URLs (la 1re = image principale)
  translations?: unknown;
}

const EMPTY: ProjectFormValues = {
  name: "",
  description: "",
  role: "",
  tools: "",
  highlights: "",
  challenges: "",
  codeUrl: "",
  demoUrl: "",
  date: "",
  status: "",
  featured: false,
  active: true,
  images: [],
};

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
const csv = (s: string) =>
  s
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

const PROJECT_FIELDS: TranslationField[] = [
  { key: "name", label: "Nom du projet" },
  { key: "description", label: "Description", kind: "textarea" },
  { key: "role", label: "Rôle" },
  { key: "highlights", label: "Points forts", kind: "lines" },
  { key: "challenges", label: "Défis relevés", kind: "lines" },
];

export default function ProjectForm({
  projectId,
  initial,
}: {
  projectId?: string;
  initial?: ProjectFormValues;
}) {
  const router = useRouter();
  const start = initial ?? EMPTY;
  const [v, setV] = useState<ProjectFormValues>(start);
  const [dirty, setDirty] = useState(false);
  const [tr, setTr] = useState(() =>
    translationsFromJson(start.translations, PROJECT_FIELDS),
  );
  const { pending, execute } = useAction();
  useUnsavedWarning(dirty && !pending);

  function set<K extends keyof ProjectFormValues>(
    k: K,
    val: ProjectFormValues[K],
  ) {
    setV((prev) => ({ ...prev, [k]: val }));
    setDirty(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...v,
      tools: csv(v.tools),
      highlights: lines(v.highlights),
      challenges: lines(v.challenges),
      codeUrl: v.codeUrl.trim(),
      demoUrl: v.demoUrl.trim(),
      translations: translationsToPayload(tr, PROJECT_FIELDS),
    };
    const res = await execute(
      () =>
        projectId ? updateProject(projectId, payload) : createProject(payload),
      {
        success: projectId ? "Projet enregistré." : "Projet créé.",
        refresh: false,
      },
    );
    if (res.ok) {
      setDirty(false);
      router.push("/admin/projects");
      router.refresh();
    }
  }

  const tools = csv(v.tools);

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Panel title="Informations">
        <div className="grid gap-5">
          <Field label="Nom du projet" htmlFor="p-name">
            <Input
              id="p-name"
              value={v.name}
              onChange={(e) => set("name", e.target.value)}
              required
              maxLength={200}
            />
          </Field>
          <Field
            label="Description"
            htmlFor="p-desc"
            hint="Affichée sur la carte (3 lignes) et en entier sur la page du projet."
          >
            <Textarea
              id="p-desc"
              rows={4}
              value={v.description}
              onChange={(e) => set("description", e.target.value)}
              required
              maxLength={4000}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Rôle" htmlFor="p-role">
              <Input
                id="p-role"
                value={v.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="Full-Stack Developer"
              />
            </Field>
            <Field
              label="Date"
              htmlFor="p-date"
              hint="Format AAAA-MM-JJ pour un affichage « mois année »."
            >
              <Input
                id="p-date"
                value={v.date}
                onChange={(e) => set("date", e.target.value)}
                placeholder="2025-12-20"
              />
            </Field>
          </div>
          <Field
            label="Technologies"
            htmlFor="p-tools"
            hint="Séparées par des virgules."
          >
            <Input
              id="p-tools"
              value={v.tools}
              onChange={(e) => set("tools", e.target.value)}
              placeholder="Spring Boot, React, Docker"
            />
          </Field>
          {tools.length > 0 && (
            <div className="-mt-2 flex flex-wrap gap-1.5">
              {tools.map((t) => (
                <Badge key={t} variant="secondary" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Lien du code (GitHub)" htmlFor="p-code">
              <Input
                id="p-code"
                type="url"
                value={v.codeUrl}
                onChange={(e) => set("codeUrl", e.target.value)}
                placeholder="https://github.com/…"
              />
            </Field>
            <Field label="Lien de la démo" htmlFor="p-demo">
              <Input
                id="p-demo"
                type="url"
                value={v.demoUrl}
                onChange={(e) => set("demoUrl", e.target.value)}
                placeholder="https://…"
              />
            </Field>
          </div>
        </div>
      </Panel>

      <Panel
        title="Images"
        description="La première image est la couverture (format paysage 16:9 conseillé)."
      >
        <MediaPicker
          multiple
          aspect="video"
          value={v.images}
          onChange={(urls) => set("images", urls as string[])}
        />
      </Panel>

      <Panel title="Détails">
        <div className="grid gap-5">
          <Field label="Points forts" htmlFor="p-hl" hint="Un par ligne.">
            <Textarea
              id="p-hl"
              rows={4}
              value={v.highlights}
              onChange={(e) => set("highlights", e.target.value)}
            />
          </Field>
          <Field label="Défis relevés" htmlFor="p-ch" hint="Un par ligne.">
            <Textarea
              id="p-ch"
              rows={4}
              value={v.challenges}
              onChange={(e) => set("challenges", e.target.value)}
            />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Traductions"
        description="Versions française, espagnole et arabe du projet."
      >
        <TranslationsEditor
          idPrefix="project"
          fields={PROJECT_FIELDS}
          base={{ ...v }}
          value={tr}
          onChange={(next) => {
            setTr(next);
            setDirty(true);
          }}
        />
      </Panel>

      <Panel title="Publication">
        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox
            checked={v.active}
            onChange={(c) => set("active", c)}
            label="Visible sur le site"
            description="Décoche pour garder le projet en brouillon."
          />
          <Checkbox
            checked={v.featured}
            onChange={(c) => set("featured", c)}
            label="Mettre en avant"
            description="Prioritaire dans la sélection de l'accueil."
          />
        </div>
      </Panel>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:border">
        {dirty && (
          <span className="mr-auto text-xs text-muted-foreground">
            Modifications non enregistrées
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <LoaderCircle className="animate-spin" /> : <Save />}
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
