"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, X, LoaderCircle, ExternalLink } from "lucide-react";
import { uploadFile } from "@/lib/upload-client";
import { setPublishedResume } from "@/lib/actions/media";

export default function ResumeUploader({
  current,
}: {
  current: { url: string; filename: string } | null;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const media = await uploadFile(file, "DOCUMENT");
      await setPublishedResume(media.id);
      setMsg({ ok: true, text: "CV publié." });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Échec." });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function unpublish() {
    setBusy(true);
    try {
      await setPublishedResume(null);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-bold">CV publié</h2>
      </div>

      {current ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-200 hover:text-red-400 truncate"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {current.filename}
          </a>
          <button
            onClick={unpublish}
            disabled={busy}
            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            title="Retirer le CV publié"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Aucun fichier CV publié. Le bouton public utilise le lien externe des
          Paramètres à défaut.
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-900 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] transition-transform"
        >
          {busy ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {current ? "Remplacer le CV (PDF)" : "Téléverser un CV (PDF)"}
        </button>
        {msg && (
          <span className={msg.ok ? "text-emerald-400" : "text-red-400"}>
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}
