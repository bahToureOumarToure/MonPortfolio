"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { updateSettings } from "@/lib/actions/singletons";

const inputCls =
  "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 outline-none focus:border-red-500/50 w-full";
const labelCls =
  "text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block";

export interface SettingsFormValues {
  siteTitle: string;
  metaDescription: string;
  contactEmail: string;
  phone: string;
  address: string;
  footerTagline: string;
  resumeExternalUrl: string;
}

export default function SettingsForm({
  initial,
}: {
  initial: SettingsFormValues;
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof SettingsFormValues>(
    k: K,
    val: SettingsFormValues[K],
  ) {
    setV((p) => ({ ...p, [k]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateSettings(v);
      setMsg({ ok: true, text: "Paramètres enregistrés." });
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
    <form onSubmit={submit} className="flex flex-col gap-4 max-w-3xl">
      <div>
        <label className={labelCls}>Titre du site</label>
        <input
          className={inputCls}
          value={v.siteTitle}
          onChange={(e) => set("siteTitle", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Meta-description (SEO)</label>
        <textarea
          className={inputCls}
          rows={2}
          value={v.metaDescription}
          onChange={(e) => set("metaDescription", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Email public</label>
          <input
            className={inputCls}
            value={v.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Téléphone</label>
          <input
            className={inputCls}
            value={v.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Adresse</label>
          <input
            className={inputCls}
            value={v.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Texte du footer</label>
        <textarea
          className={inputCls}
          rows={2}
          value={v.footerTagline}
          onChange={(e) => set("footerTagline", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>
          Lien CV externe (utilisé si aucun fichier CV n'est publié)
        </label>
        <input
          className={inputCls}
          value={v.resumeExternalUrl}
          onChange={(e) => set("resumeExternalUrl", e.target.value)}
          placeholder="https://drive.google.com/…"
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
