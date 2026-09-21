"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { updateHero } from "@/lib/actions/singletons";

const inputCls =
  "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 outline-none focus:border-red-500/50 w-full";
const labelCls =
  "text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block";

export interface HeroFormValues {
  tagline: string;
  headingTop: string;
  headingBottom: string;
  name: string;
  designation: string;
  alternateWords: string; // séparés par des virgules
  subheading: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaResumeLabel: string;
  heroImage: string;
}

export default function HeroForm({ initial }: { initial: HeroFormValues }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof HeroFormValues>(k: K, val: HeroFormValues[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateHero({
        ...v,
        alternateWords: v.alternateWords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setMsg({ ok: true, text: "Hero enregistré." });
      router.refresh();
    } catch (err) {
      setMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Échec.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className={labelCls}>Badge (tagline)</label>
          <input
            className={inputCls}
            value={v.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Titre — ligne 1</label>
          <input
            className={inputCls}
            value={v.headingTop}
            onChange={(e) => set("headingTop", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Titre — ligne 2</label>
          <input
            className={inputCls}
            value={v.headingBottom}
            onChange={(e) => set("headingBottom", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Nom affiché</label>
          <input
            className={inputCls}
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Désignation (statique)</label>
        <input
          className={inputCls}
          value={v.designation}
          onChange={(e) => set("designation", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>
          Mots animés (séparés par des virgules)
        </label>
        <input
          className={inputCls}
          value={v.alternateWords}
          onChange={(e) => set("alternateWords", e.target.value)}
          placeholder="Developer., DevOps., Engineer."
        />
      </div>

      <div>
        <label className={labelCls}>Sous-titre</label>
        <textarea
          className={inputCls}
          rows={2}
          value={v.subheading}
          onChange={(e) => set("subheading", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Bouton principal — libellé</label>
          <input
            className={inputCls}
            value={v.ctaPrimaryLabel}
            onChange={(e) => set("ctaPrimaryLabel", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Bouton principal — lien</label>
          <input
            className={inputCls}
            value={v.ctaPrimaryHref}
            onChange={(e) => set("ctaPrimaryHref", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Bouton CV — libellé</label>
          <input
            className={inputCls}
            value={v.ctaResumeLabel}
            onChange={(e) => set("ctaResumeLabel", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>
          Image du Hero (URL/chemin — optionnel)
        </label>
        <input
          className={inputCls}
          value={v.heroImage}
          onChange={(e) => set("heroImage", e.target.value)}
          placeholder="/profile.png"
        />
      </div>

      <div className="flex items-center gap-3">
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
        {msg && (
          <span className={msg.ok ? "text-emerald-400" : "text-red-400"}>
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}
