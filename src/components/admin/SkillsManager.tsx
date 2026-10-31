"use client";
import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Pencil, Plus, Save, X } from "lucide-react";
import {
  createSkill,
  deleteSkill,
  reorderSkills,
  updateSkill,
} from "@/lib/actions/collections";
import {
  SKILL_CATEGORIES,
  SKILL_CATEGORY_LABELS,
  type SkillCategoryKey,
} from "@/lib/skill-categories";
import { iconColor } from "@/lib/color";
import { getSkillColor, getSkillIcon } from "@/../utils/skill-icons";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import DeleteButton from "./DeleteButton";
import ReorderButtons from "./ReorderButtons";
import { Checkbox, ColorInput, Field, Panel, StatusBadge } from "./ui";
import { move, useAction } from "./use-action";

export interface SkillRow {
  id: string;
  name: string;
  category: SkillCategoryKey;
  iconKey: string;
  color: string;
  order: number;
  active: boolean;
  translations?: unknown;
}

/** Nom traduit (fr / es / ar) ; vide = nom anglais affiché. */
type NameTranslations = { fr: string; es: string; ar: string };
const TR_LANGS = [
  { code: "fr", label: "Nom en français" },
  { code: "es", label: "Nom en espagnol" },
  { code: "ar", label: "Nom en arabe" },
] as const;

type FormState = Omit<SkillRow, "id" | "order" | "translations"> & {
  tr: NameTranslations;
};

const empty = (category: SkillCategoryKey = "FRONTEND"): FormState => ({
  name: "",
  category,
  iconKey: "",
  color: "",
  active: true,
  tr: { fr: "", es: "", ar: "" },
});

function namesFrom(translations: unknown): NameTranslations {
  const pick = (code: string) => {
    const t = (translations as Record<string, { name?: unknown }> | null)?.[
      code
    ];
    return typeof t?.name === "string" ? t.name : "";
  };
  return { fr: pick("fr"), es: pick("es"), ar: pick("ar") };
}

function toPayload(form: FormState) {
  const { tr, ...fields } = form;
  return {
    ...fields,
    translations: Object.fromEntries(
      TR_LANGS.map(({ code }) => [code, { name: tr[code] }]),
    ),
  };
}

function SkillIcon({
  iconKey,
  name,
  color,
}: {
  iconKey: string;
  name: string;
  color: string;
}) {
  const key = iconKey || name;
  const Icon = getSkillIcon(key);
  const c = iconColor(color || getSkillColor(key));
  return (
    <Icon
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      style={c ? { color: c } : undefined}
    />
  );
}

export default function SkillsManager({ initial }: { initial: SkillRow[] }) {
  const [rows, setRows] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty());
  const { pending, execute } = useAction();
  useEffect(() => setRows(initial), [initial]);

  const grouped = useMemo(
    () =>
      SKILL_CATEGORIES.map((cat) => ({
        cat,
        items: rows
          .filter((r) => r.category === cat)
          .sort((a, b) => a.order - b.order),
      })),
    [rows],
  );

  function edit(row: SkillRow) {
    setEditingId(row.id);
    setForm({
      name: row.name,
      category: row.category,
      iconKey: row.iconKey,
      color: row.color,
      active: row.active,
      tr: namesFrom(row.translations),
    });
    document
      .getElementById("skill-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    setEditingId(null);
    setForm(empty(form.category));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await execute(
      () =>
        editingId
          ? updateSkill(editingId, toPayload(form))
          : createSkill(toPayload(form)),
      {
        success: editingId ? "Compétence mise à jour." : "Compétence ajoutée.",
      },
    );
    if (res.ok) reset();
  }

  async function onMove(cat: SkillCategoryKey, from: number, to: number) {
    const items = grouped.find((g) => g.cat === cat)!.items;
    const next = move(items, from, to);
    const previous = rows;
    setRows((list) =>
      list.map((r) => {
        const idx = next.findIndex((n) => n.id === r.id);
        return idx >= 0 ? { ...r, order: idx } : r;
      }),
    );
    const res = await execute(() => reorderSkills(next.map((r) => r.id)));
    if (!res.ok) setRows(previous);
  }

  return (
    <div className="flex flex-col gap-6">
      <Panel
        title={editingId ? "Modifier la compétence" : "Ajouter une compétence"}
        actions={
          editingId && (
            <Button type="button" variant="ghost" size="sm" onClick={reset}>
              <X /> Annuler
            </Button>
          )
        }
      >
        <form id="skill-form" onSubmit={save} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nom" htmlFor="s-name">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <SkillIcon
                    iconKey={form.iconKey}
                    name={form.name}
                    color={form.color}
                  />
                </span>
                <Input
                  id="s-name"
                  className="pl-9"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="React"
                  required
                  maxLength={80}
                />
              </div>
            </Field>
            <Field label="Catégorie" htmlFor="s-cat">
              <Select
                id="s-cat"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as SkillCategoryKey,
                  })
                }
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {SKILL_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Icône"
              htmlFor="s-icon"
              hint="Clé d'icône (ex. react, python). Vide = déduite du nom."
            >
              <Input
                id="s-icon"
                value={form.iconKey}
                onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
                placeholder="Automatique"
              />
            </Field>
            <Field
              label="Couleur de l'icône"
              htmlFor="s-color"
              hint="Vide = couleur officielle."
            >
              <ColorInput
                id="s-color"
                value={form.color}
                onChange={(color) => setForm({ ...form, color })}
              />
            </Field>
          </div>
          <div className="grid gap-5 rounded-xl border bg-muted/30 p-4 sm:grid-cols-3">
            {TR_LANGS.map(({ code, label }) => (
              <Field
                key={code}
                label={label}
                htmlFor={`s-tr-${code}`}
                hint={code === "fr" ? "Vide = nom anglais." : undefined}
              >
                <Input
                  id={`s-tr-${code}`}
                  dir={code === "ar" ? "rtl" : "ltr"}
                  lang={code}
                  value={form.tr[code]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tr: { ...form.tr, [code]: e.target.value },
                    })
                  }
                  placeholder={form.name}
                  maxLength={80}
                />
              </Field>
            ))}
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

      <div className="grid gap-4 md:grid-cols-2">
        {grouped.map(({ cat, items }) => (
          <Panel
            key={cat}
            title={`${SKILL_CATEGORY_LABELS[cat]} · ${items.length}`}
          >
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune compétence.
              </p>
            ) : (
              <ul className="-my-2 divide-y">
                {items.map((row, i) => (
                  <li key={row.id} className="flex items-center gap-2 py-2">
                    <ReorderButtons
                      index={i}
                      count={items.length}
                      onMove={(f, t) => onMove(cat, f, t)}
                      disabled={pending}
                    />
                    <SkillIcon
                      iconKey={row.iconKey}
                      name={row.name}
                      color={row.color}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {row.name}
                    </span>
                    {!row.active && <StatusBadge active={false} />}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Modifier ${row.name}`}
                      title="Modifier"
                      onClick={() => edit(row)}
                    >
                      <Pencil />
                    </Button>
                    <DeleteButton
                      compact
                      action={() => deleteSkill(row.id)}
                      confirmText={`Supprimer « ${row.name} » ?`}
                      successText="Compétence supprimée."
                      onDone={() => editingId === row.id && reset()}
                    />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        ))}
      </div>
    </div>
  );
}
