"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, LoaderCircle } from "lucide-react";

type SetupInfo = { email: string; otpauthUrl: string; qrDataUrl: string };

export default function SetupPage() {
  const router = useRouter();
  const [info, setInfo] = useState<SetupInfo | null>(null);
  const [already, setAlready] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [totp, setTotp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/setup");
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 403) setAlready(true);
          setError(data.error ?? null);
          return;
        }
        setInfo(data);
      } catch {
        setError("Impossible de démarrer l'enrôlement.");
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, totpToken: totp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Échec de la configuration.");
        return;
      }
      router.push("/admin/security");
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-8 lg:p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-black tracking-tight">
            Configuration admin
          </h1>
        </div>

        {booting && (
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <LoaderCircle className="w-4 h-4 animate-spin" /> Chargement…
          </p>
        )}

        {already && (
          <div className="text-sm text-slate-300">
            L'administrateur est déjà configuré.{" "}
            <a href="/admin/login" className="text-red-400 underline">
              Se connecter
            </a>
          </div>
        )}

        {info && (
          <form onSubmit={submit} className="flex flex-col gap-5">
            <p className="text-sm text-slate-400">
              Compte : <span className="text-white">{info.email}</span>. Scanne
              ce QR dans ton app d'authentification (Google Authenticator,
              Authy…), puis choisis un mot de passe.
            </p>

            <div className="flex justify-center">
              <Image
                src={info.qrDataUrl}
                alt="QR code 2FA"
                width={180}
                height={180}
                unoptimized
                className="rounded-xl border border-white/10 bg-white p-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Mot de passe (min. 10 caractères)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500/50"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500/50"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Code 2FA (depuis l'app)
              </label>
              <input
                inputMode="numeric"
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                placeholder="123456"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white tracking-[0.4em] outline-none focus:border-red-500/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-900 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] transition-transform"
            >
              {loading && <LoaderCircle className="w-5 h-5 animate-spin" />}
              Activer l'administration
            </button>
          </form>
        )}

        {error && !already && (
          <p className="mt-5 text-sm text-red-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
