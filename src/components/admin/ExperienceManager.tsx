"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, Pencil, X, LoaderCircle } from "lucide-react";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/actions/collections";

export interface ExperienceRow {
  id: string;
  title: string;
  company: string;
  duration: string;
  details: string[];
  order: number;
  active: boolean;
}

interface FormState {
  title: string;
  company: string;
  duration: string;
  details: string; // une ligne par élément
  order: number;
  active: boolean;
}

const empty = (): FormState => ({
  title: "",
  company: "",
  duration: "",
  details: "",
  order: 0,
  active: true,
});

const inputCls =
  "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 outline-none focus:border-red-500/50 w-full";

export default function ExperienceManager({
  initial,
}: {
  initial: ExperienceRow[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function edit(r: ExperienceRow) {
    setEditingId(r.id);
    setForm({
      title: r.title,
      company: r.company,
      duration: r.duration,
      details: r.details.join("\n"),
      order: r.order,
      active: r.active,
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
    const payload = {
      title: form.title,
      company: form.company,
      duration: form.duration,
      details: form.details
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      order: form.order,
      active: form.active,
    };
    try {
      if (editingId) await updateExperience(editingId, payload);
      else await createExperience(payload);
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Supprimer cet élément ?")) return;
    await deleteExperience(id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={save}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3"
      >
        <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400">
          {editingId ? "Modifier" : "Ajouter"} une entrée
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            className={inputCls}
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className={inputCls}
            placeholder="Entreprise / sous-titre"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Période"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
        </div>
        <textarea
          className={inputCls}
          rows={3}
          placeholder="Détails — un par ligne"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
        />
        <div className="flex items-center gap-3">
          <input
            type="number"
            className={`${inputCls} w-24`}
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

      <div className="flex flex-col gap-3">
        {initial.length === 0 && (
          <p className="text-slate-500 text-sm">Aucune entrée.</p>
        )}
        {initial.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-start justify-between gap-4"
          >
            <div>
              <p className="font-bold text-white">
                {r.title}{" "}
                {!r.active && (
                  <span className="text-xs text-slate-500">(masqué)</span>
                )}
              </p>
              <p className="text-sm text-red-400">{r.company}</p>
              <p className="text-xs text-slate-500">{r.duration}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => edit(r)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => remove(r.id)}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
