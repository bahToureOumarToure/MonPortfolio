"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { startRegistration } from "@simplewebauthn/browser";
import { KeyRound, Plus } from "lucide-react";

export default function PasskeyManager() {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function addPasskey() {
    setBusy(true);
    setMsg(null);
    try {
      const optRes = await fetch("/api/admin/passkeys/options", {
        method: "POST",
      });
      const options = await optRes.json();
      if (!optRes.ok) {
        setMsg({ ok: false, text: options.error ?? "Erreur" });
        return;
      }
      const attResp = await startRegistration({ optionsJSON: options });
      const verRes = await fetch("/api/admin/passkeys/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: attResp, label: label || undefined }),
      });
      const data = await verRes.json();
      if (!verRes.ok) {
        setMsg({ ok: false, text: data.error ?? "Échec de l'enregistrement." });
        return;
      }
      setMsg({ ok: true, text: "Passkey enregistrée." });
      setLabel("");
      router.refresh();
    } catch {
      setMsg({ ok: false, text: "Enregistrement annulé ou non supporté." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center gap-3">
        <KeyRound className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-bold text-white">Ajouter une passkey</h3>
      </div>
      <p className="text-sm text-slate-400">
        Enregistre l'empreinte / la clé de cet appareil pour te connecter sans
        mot de passe.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nom de l'appareil (ex. MacBook Touch ID)"
          maxLength={60}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 outline-none focus:border-red-500/50"
        />
        <button
          onClick={addPasskey}
          disabled={busy}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-900 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-4 h-4" />
          {busy ? "…" : "Ajouter"}
        </button>
      </div>
      {msg && (
        <p
          className={`text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
