"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, Pencil, X, LoaderCircle } from "lucide-react";
import {
  createSocial,
  updateSocial,
  deleteSocial,
} from "@/lib/actions/collections";

export interface SocialRow {
  id: string;
  platform: string;
  url: string;
  iconKey: string;
  color: string;
  order: number;
  active: boolean;
}

const empty = (): Omit<SocialRow, "id"> => ({
  platform: "",
  url: "",
  iconKey: "",
  color: "",
  order: 0,
  active: true,
});

const inputCls =
  "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 outline-none focus:border-red-500/50";

export default function SocialsManager({ initial }: { initial: SocialRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SocialRow, "id">>(empty());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function edit(r: SocialRow) {
    setEditingId(r.id);
    setForm({
      platform: r.platform,
      url: r.url,
      iconKey: r.iconKey,
      color: r.color,
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
    try {
      if (editingId) await updateSocial(editingId, form);
      else await createSocial(form);
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Supprimer ce lien ?")) return;
    await deleteSocial(id);
    router.refresh();
  }

  const knownKeys =
    "github, linkedin, twitter, facebook, instagram, stackoverflow, leetcode";

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={save}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3"
      >
        <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400">
          {editingId ? "Modifier" : "Ajouter"} un lien
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <input
            className={inputCls}
            placeholder="Plateforme (ex. GitHub)"
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            required
          />
          <input
            className={`${inputCls} sm:col-span-2`}
            placeholder="https://…"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />
          <input
            className={inputCls}
            placeholder={`iconKey (${knownKeys})`}
            value={form.iconKey}
            onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="couleur #hex"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
          <div className="flex items-center gap-3">
            <input
              type="number"
              className={`${inputCls} w-20`}
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
              <th className="text-left px-4 py-3">Plateforme</th>
              <th className="text-left px-4 py-3">URL</th>
              <th className="text-left px-4 py-3">État</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initial.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-500">
                  Aucun lien.
                </td>
              </tr>
            )}
            {initial.map((r) => (
              <tr
                key={r.id}
                className="border-t border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 font-medium text-white">
                  {r.platform}
                </td>
                <td className="px-4 py-3 text-slate-400 truncate max-w-[240px]">
                  {r.url}
                </td>
                <td className="px-4 py-3 text-xs font-bold">
                  {r.active ? (
                    <span className="text-emerald-400">Actif</span>
                  ) : (
                    <span className="text-slate-500">Masqué</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
