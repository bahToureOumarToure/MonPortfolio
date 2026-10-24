"use client";
import { useEffect, useState } from "react";
import { LoaderCircle, Pencil, Plus, Save, X } from "lucide-react";
import type { ActionResult } from "@/lib/actions/result";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import DeleteButton from "./DeleteButton";
import ReorderButtons from "./ReorderButtons";
import { Checkbox, EmptyState, Field, Panel, StatusBadge } from "./ui";
import { move, useAction } from "./use-action";

export interface TimelineRow {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  details: string[];
  active: boolean;
}

interface FormState {
  title: string;
  subtitle: string;
  duration: string;
  details: string;
  active: boolean;
}

const empty = (): FormState => ({
  title: "",
  subtitle: "",
  duration: "",
  details: "",
  active: true,
});

/**
 * Gestion d'une liste chronologique (Expérience ou Formation) : ajout,
 * édition, réordonnancement, visibilité et suppression.
 */
export default function TimelineManager({
  initial,
  labels,
  withDetails,
  actions,
}: {
  initial: TimelineRow[];
  labels: {
    noun: string;
    subtitle: string;
    subtitlePlaceholder: string;
    titlePlaceholder: string;
  };
  withDetails: boolean;
  actions: {
    create: (input: unknown) => Promise<ActionResult>;
    update: (id: string, input: unknown) => Promise<ActionResult>;
    remove: (id: string) => Promise<ActionResult>;
    reorder: (ids: string[]) => Promise<ActionResult>;
    toPayload: (f: {
      title: string;
      subtitle: string;
      duration: string;
      details: string[];
      active: boolean;
    }) => unknown;
  };
}) {
  const [rows, setRows] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty());
  const { pending, execute } = useAction();
  useEffect(() => setRows(initial), [initial]);

  function edit(r: TimelineRow) {
    setEditingId(r.id);
    setForm({
      title: r.title,
      subtitle: r.subtitle,
      duration: r.duration,
      details: r.details.join("\n"),
      active: r.active,
    });
    document
      .getElementById("timeline-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function reset() {
    setEditingId(null);
    setForm(empty());
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = actions.toPayload({
      ...form,
      details: form.details
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    const res = await execute(
      () =>
        editingId
          ? actions.update(editingId, payload)
          : actions.create(payload),
      {
        success: editingId
          ? "Modifications enregistrées."
          : `${labels.noun} ajoutée.`,
      },
    );
    if (res.ok) reset();
  }

  async function onMove(from: number, to: number) {
    const next = move(rows, from, to);
    setRows(next);
    const res = await execute(() => actions.reorder(next.map((r) => r.id)));
    if (!res.ok) setRows(rows);
  }

  return (
    <div className="flex flex-col gap-6">
      <Panel
        title={
          editingId ? "Modifier" : `Ajouter une ${labels.noun.toLowerCase()}`
        }
        actions={
          editingId && (
            <Button type="button" variant="ghost" size="sm" onClick={reset}>
              <X /> Annuler
            </Button>
          )
        }
      >
        <form id="timeline-form" onSubmit={save} className="grid gap-5">
          <Field label="Titre" htmlFor="t-title">
            <Input
              id="t-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={labels.titlePlaceholder}
              required
              maxLength={200}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={labels.subtitle} htmlFor="t-sub">
              <Input
                id="t-sub"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder={labels.subtitlePlaceholder}
              />
            </Field>
            <Field label="Période" htmlFor="t-dur">
              <Input
                id="t-dur"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="Sept. 2024 – Présent"
              />
            </Field>
          </div>
          {withDetails && (
            <Field
              label="Détails"
              htmlFor="t-details"
              hint="Un point par ligne."
            >
              <Textarea
                id="t-details"
                rows={4}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
              />
            </Field>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Checkbox
              checked={form.active}
              onChange={(active) => setForm({ ...form, active })}
              label="Visible sur le site"
            />
            <Button type="submit" disabled={pending}>
              {pending ? (
                <LoaderCircle className="animate-spin" />
              ) : editingId ? (
                <Save />
              ) : (
                <Plus />
              )}
              {editingId ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Panel>

      {rows.length === 0 ? (
        <EmptyState
          title="Rien pour l'instant"
          description="Ajoute une première entrée ci-dessus."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r, i) => (
            <li
              key={r.id}
              className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm"
            >
              <ReorderButtons
                index={i}
                count={rows.length}
                onMove={onMove}
                disabled={pending}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{r.title}</p>
                {r.subtitle && (
                  <p className="text-sm text-primary">{r.subtitle}</p>
                )}
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {r.duration && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {r.duration}
                    </span>
                  )}
                  <StatusBadge active={r.active} />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Modifier"
                onClick={() => edit(r)}
              >
                <Pencil />
              </Button>
              <DeleteButton
                compact
                action={() => actions.remove(r.id)}
                confirmText={`Supprimer « ${r.title} » ?`}
                successText="Supprimé."
                onDone={() => editingId === r.id && reset()}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
