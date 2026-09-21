"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { updateProfile } from "@/lib/actions/singletons";

const inputCls =
  "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 outline-none focus:border-red-500/50 w-full";
const labelCls =
  "text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block";

export interface ProfileFormValues {
  aboutTitle: string;
  aboutHighlight: string;
  description: string;
  image: string;
}

export default function ProfileForm({
  initial,
}: {
  initial: ProfileFormValues;
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof ProfileFormValues>(
    k: K,
    val: ProfileFormValues[K],
  ) {
    setV((p) => ({ ...p, [k]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateProfile(v);
      setMsg({ ok: true, text: "Profil enregistré." });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Titre « About »</label>
          <input
            className={inputCls}
            value={v.aboutTitle}
            onChange={(e) => set("aboutTitle", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Mot mis en avant</label>
          <input
            className={inputCls}
            value={v.aboutHighlight}
            onChange={(e) => set("aboutHighlight", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Description / présentation</label>
        <textarea
          className={inputCls}
          rows={5}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
          required
        />
      </div>

      <div>
        <label className={labelCls}>Photo de profil (URL/chemin)</label>
        <input
          className={inputCls}
          value={v.image}
          onChange={(e) => set("image", e.target.value)}
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
