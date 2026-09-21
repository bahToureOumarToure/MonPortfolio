"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";
import { KeyRound, Lock, LoaderCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [needsTotp, setNeedsTotp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"" | "pass" | "passkey">("");

  function destination() {
    if (typeof window === "undefined") return "/admin";
    const from = new URLSearchParams(window.location.search).get("from");
    return from && from.startsWith("/admin") ? from : "/admin";
  }

  async function passwordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("pass");
    try {
      const res = await fetch("/api/admin/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          totpToken: totp || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsTotp) setNeedsTotp(true);
        setError(data.error ?? "Échec de la connexion.");
        return;
      }
      router.push(destination());
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading("");
    }
  }

  async function passkeyLogin() {
    setError(null);
    setLoading("passkey");
    try {
      const optRes = await fetch("/api/admin/auth/passkey/options", {
        method: "POST",
      });
      const options = await optRes.json();
      if (!optRes.ok) {
        setError(options.error ?? "Passkey indisponible.");
        return;
      }
      const assertion = await startAuthentication({ optionsJSON: options });
      const verRes = await fetch("/api/admin/auth/passkey/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assertion),
      });
      const data = await verRes.json();
      if (!verRes.ok) {
        setError(data.error ?? "Échec de la passkey.");
        return;
      }
      router.push(destination());
      router.refresh();
    } catch {
      setError("Passkey annulée ou non supportée.");
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-8 lg:p-10 shadow-2xl">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-2xl font-black tracking-tight">
            Espace <span className="text-red-500">admin</span>
          </h1>
          <p className="text-sm text-slate-400">Accès strictement privé.</p>
        </div>

        <button
          onClick={passkeyLogin}
          disabled={loading !== ""}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-900 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] transition-transform"
        >
          {loading === "passkey" ? (
            <LoaderCircle className="w-5 h-5 animate-spin" />
          ) : (
            <KeyRound className="w-5 h-5" />
          )}
          Se connecter avec une passkey
        </button>

        <div className="flex items-center gap-4 my-6">
          <span className="flex-1 h-px bg-white/10" />
          <span className="text-xs uppercase tracking-widest text-slate-600">
            ou
          </span>
          <span className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={passwordLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500/50"
              required
            />
          </div>

          {needsTotp && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Code 2FA
              </label>
              <input
                inputMode="numeric"
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                placeholder="123456"
                autoComplete="one-time-code"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white tracking-[0.4em] outline-none focus:border-red-500/50"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading !== ""}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-50 transition-colors"
          >
            {loading === "pass" ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : null}
            Se connecter
          </button>
        </form>

        {error && (
          <p className="mt-5 text-sm text-red-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
