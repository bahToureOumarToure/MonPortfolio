"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, Pencil, X, LoaderCircle } from "lucide-react";
import {
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/lib/actions/collections";
import { SKILL_CATEGORIES } from "@/lib/validation/collections";

const LABELS: Record<string, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  LANGAGES: "Langages",
  DATABASE: "Database",
  DATA_IA: "Data & IA",
  MOBILE: "Mobile",
  TOOLS: "Tools",
};

export interface SkillRow {
  id: string;
  name: string;
  category: string;
  iconKey: string;
  color: string;
  order: number;
  active: boolean;
}

const empty = (): Omit<SkillRow, "id"> => ({
  name: "",
  category: "FRONTEND",
  iconKey: "",
  color: "",
  order: 0,
  active: true,
});

const inputCls =
  "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 outline-none focus:border-red-500/50";

export default function SkillsManager({ initial }: { initial: SkillRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SkillRow, "id">>(empty());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function edit(row: SkillRow) {
    setEditingId(row.id);
    setForm({
      name: row.name,
      category: row.category,
      iconKey: row.iconKey,
      color: row.color,
      order: row.order,
      active: row.active,
    });
  }
  function reset() {
    setEditingId(null);
    setForm(empty());
    setError(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (editingId) await updateSkill(editingId, form);
      else await createSkill(form);
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Supprimer cette compétence ?")) return;
    await deleteSkill(id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={save}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3"
      >
        <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400">
          {editingId ? "Modifier" : "Ajouter"} une compétence
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <input
            className={inputCls}
            placeholder="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select
            className={inputCls}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {SKILL_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0a0a0a]">
                {LABELS[c]}
              </option>
            ))}
          </select>
          <input
            className={inputCls}
            placeholder="iconKey (déf. = nom)"
            value={form.iconKey}
            onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="couleur #hex"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
          <input
            type="number"
            className={inputCls}
            placeholder="ordre"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: Number(e.target.value) })
            }
          />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-red-500 w-4 h-4"
            />
            Actif
          </label>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-900 text-white font-bold text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {busy ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : editingId ? (
              <Save className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-xs uppercase tracking-widest"
            >
              <X className="w-4 h-4" /> Annuler
            </button>
          )}
        </div>
      </form>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-slate-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="text-left px-4 py-3">Nom</th>
              <th className="text-left px-4 py-3">Catégorie</th>
              <th className="text-left px-4 py-3">Ordre</th>
              <th className="text-left px-4 py-3">État</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initial.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-500">
                  Aucune compétence.
                </td>
              </tr>
            )}
            {initial.map((row) => (
              <tr
                key={row.id}
                className="border-t border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                <td className="px-4 py-3 text-slate-400">
                  {LABELS[row.category] ?? row.category}
                </td>
                <td className="px-4 py-3 text-slate-400">{row.order}</td>
                <td className="px-4 py-3 text-xs font-bold">
                  {row.active ? (
                    <span className="text-emerald-400">Actif</span>
                  ) : (
                    <span className="text-slate-500">Masqué</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => edit(row)}
                      className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(row.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
