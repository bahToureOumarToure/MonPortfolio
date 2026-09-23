"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { createProject, updateProject } from "@/lib/actions/projects";
import MediaPicker from "@/components/admin/MediaPicker";

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
  order: number;
  images: string[]; // URLs (la 1re = image principale)
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
  order: 0,
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

const inputCls =
  "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 outline-none focus:border-red-500/50 w-full";
const labelCls =
  "text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block";

export default function ProjectForm({
  projectId,
  initial,
}: {
  projectId?: string;
  initial?: ProjectFormValues;
}) {
  const router = useRouter();
  const [v, setV] = useState<ProjectFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProjectFormValues>(
    k: K,
    val: ProjectFormValues[K],
  ) {
    setV((prev) => ({ ...prev, [k]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: v.name,
      description: v.description,
      role: v.role,
      tools: csv(v.tools),
      highlights: lines(v.highlights),
      challenges: lines(v.challenges),
      codeUrl: v.codeUrl.trim(),
      demoUrl: v.demoUrl.trim(),
      date: v.date,
      status: v.status,
      featured: v.featured,
      active: v.active,
      order: Number(v.order) || 0,
      images: v.images,
    };
    try {
      if (projectId) await updateProject(projectId, payload);
      else await createProject(payload);
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Échec de l'enregistrement.",
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 max-w-3xl">
      <div>
        <label className={labelCls}>Nom</label>
        <input
          className={inputCls}
          value={v.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          className={inputCls}
          rows={4}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Rôle</label>
          <input
            className={inputCls}
            value={v.role}
            onChange={(e) => set("role", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Date</label>
          <input
            className={inputCls}
            value={v.date}
            onChange={(e) => set("date", e.target.value)}
            placeholder="2025-12-20"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>
          Technologies (séparées par des virgules)
        </label>
        <input
          className={inputCls}
          value={v.tools}
          onChange={(e) => set("tools", e.target.value)}
          placeholder="Spring Boot, React, Docker"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Lien code (GitHub)</label>
          <input
            className={inputCls}
            value={v.codeUrl}
            onChange={(e) => set("codeUrl", e.target.value)}
            placeholder="https://github.com/…"
          />
        </div>
        <div>
          <label className={labelCls}>Lien démo</label>
          <input
            className={inputCls}
            value={v.demoUrl}
            onChange={(e) => set("demoUrl", e.target.value)}
            placeholder="https://…"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>
          Images (téléverse ou choisis ; la 1re = image principale)
        </label>
        <MediaPicker
          multiple
          aspect="video"
          value={v.images}
          onChange={(urls) => set("images", urls as string[])}
        />
      </div>

      <div>
        <label className={labelCls}>Points forts — un par ligne</label>
        <textarea
          className={inputCls}
          rows={3}
          value={v.highlights}
          onChange={(e) => set("highlights", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Défis — un par ligne</label>
        <textarea
          className={inputCls}
          rows={3}
          value={v.challenges}
          onChange={(e) => set("challenges", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
        <div>
          <label className={labelCls}>Ordre</label>
          <input
            type="number"
            className={inputCls}
            value={v.order}
            onChange={(e) => set("order", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>Statut</label>
          <input
            className={inputCls}
            value={v.status}
            onChange={(e) => set("status", e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300 pb-2.5">
          <input
            type="checkbox"
            checked={v.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="accent-red-500 w-4 h-4"
          />
          Mis en avant
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 pb-2.5">
          <input
            type="checkbox"
            checked={v.active}
            onChange={(e) => set("active", e.target.checked)}
            className="accent-red-500 w-4 h-4"
          />
          Actif (visible)
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-900 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] transition-transform"
        >
          {saving ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm uppercase tracking-widest"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
