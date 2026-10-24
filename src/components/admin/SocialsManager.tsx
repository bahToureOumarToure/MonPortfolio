"use client";
import { useEffect, useState } from "react";
import { Link2, LoaderCircle, Pencil, Plus, Save, X } from "lucide-react";
import {
  createSocial,
  deleteSocial,
  reorderSocials,
  updateSocial,
} from "@/lib/actions/collections";
import { getSocialIcon } from "@/../utils/social-icons";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import DeleteButton from "./DeleteButton";
import ReorderButtons from "./ReorderButtons";
import {
  Checkbox,
  ColorInput,
  EmptyState,
  Field,
  Panel,
  StatusBadge,
} from "./ui";
import { move, useAction } from "./use-action";

export interface SocialRow {
  id: string;
  platform: string;
  url: string;
  iconKey: string;
  color: string;
  order: number;
  active: boolean;
}

type FormState = Omit<SocialRow, "id" | "order">;

const ICONS = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X / Twitter" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "stackoverflow", label: "Stack Overflow" },
  { key: "leetcode", label: "LeetCode" },
  { key: "link", label: "Autre lien" },
];

const empty = (): FormState => ({
  platform: "",
  url: "",
  iconKey: "",
  color: "",
  active: true,
});

export default function SocialsManager({ initial }: { initial: SocialRow[] }) {
  const [rows, setRows] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty());
  const { pending, execute } = useAction();
  useEffect(() => setRows(initial), [initial]);

  function edit(r: SocialRow) {
    setEditingId(r.id);
    setForm({
      platform: r.platform,
      url: r.url,
      iconKey: r.iconKey,
      color: r.color,
      active: r.active,
    });
    document
      .getElementById("social-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function reset() {
    setEditingId(null);
    setForm(empty());
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await execute(
      () => (editingId ? updateSocial(editingId, form) : createSocial(form)),
      { success: editingId ? "Lien mis à jour." : "Lien ajouté." },
    );
    if (res.ok) reset();
  }

  async function onMove(from: number, to: number) {
    const next = move(rows, from, to);
    setRows(next);
    const res = await execute(() => reorderSocials(next.map((r) => r.id)));
    if (!res.ok) setRows(rows);
  }

  const PreviewIcon = getSocialIcon(form.iconKey || form.platform);

  return (
    <div className="flex flex-col gap-6">
      <Panel
        title={editingId ? "Modifier le lien" : "Ajouter un lien"}
        actions={
          editingId && (
            <Button type="button" variant="ghost" size="sm" onClick={reset}>
              <X /> Annuler
            </Button>
          )
        }
      >
        <form id="social-form" onSubmit={save} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Plateforme" htmlFor="so-platform">
              <div className="relative">
                <PreviewIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="so-platform"
                  className="pl-9"
                  value={form.platform}
                  onChange={(e) =>
                    setForm({ ...form, platform: e.target.value })
                  }
                  placeholder="GitHub"
                  required
                  maxLength={60}
                />
              </div>
            </Field>
            <Field label="Icône" htmlFor="so-icon">
              <Select
                id="so-icon"
                value={form.iconKey}
                onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
              >
                <option value="">Automatique (selon la plateforme)</option>
                {ICONS.map((i) => (
                  <option key={i.key} value={i.key}>
                    {i.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="URL" htmlFor="so-url" className="sm:col-span-2">
              <Input
                id="so-url"
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://github.com/…"
                required
              />
            </Field>
            <Field
              label="Couleur au survol"
              htmlFor="so-color"
              hint="Vide = couleur de la marque."
            >
              <ColorInput
                id="so-color"
                value={form.color}
                onChange={(color) => setForm({ ...form, color })}
              />
            </Field>
          </div>
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
          icon={<Link2 className="h-8 w-8" />}
          title="Aucun lien"
          description="Ajoute tes réseaux ci-dessus."
        />
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
          {rows.map((r, i) => {
            const Icon = getSocialIcon(r.iconKey || r.platform);
            return (
              <li key={r.id} className="flex items-center gap-3 p-3 sm:p-4">
                <ReorderButtons
                  index={i}
                  count={rows.length}
                  onMove={onMove}
                  disabled={pending}
                />
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.platform}</p>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-xs text-muted-foreground hover:text-foreground"
                  >
                    {r.url}
                  </a>
                </div>
                <span className="hidden sm:block">
                  <StatusBadge active={r.active} />
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Modifier ${r.platform}`}
                  onClick={() => edit(r)}
                >
                  <Pencil />
                </Button>
                <DeleteButton
                  compact
                  action={() => deleteSocial(r.id)}
                  confirmText={`Supprimer le lien « ${r.platform} » ?`}
                  successText="Lien supprimé."
                  onDone={() => editingId === r.id && reset()}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
