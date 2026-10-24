"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";
import { KeyRound, LoaderCircle } from "lucide-react";
import AuthCard from "@/components/admin/AuthCard";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

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
    <AuthCard title="Espace admin" subtitle="Accès strictement privé.">
      <Button
        onClick={passkeyLogin}
        disabled={loading !== ""}
        size="lg"
        className="w-full"
      >
        {loading === "passkey" ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <KeyRound />
        )}
        Se connecter avec une passkey
      </Button>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={passwordLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="login-password">Mot de passe</Label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {needsTotp && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-totp">Code 2FA</Label>
            <Input
              id="login-totp"
              inputMode="numeric"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              placeholder="123456"
              autoComplete="one-time-code"
              autoFocus
              className="font-mono tracking-[0.4em]"
            />
          </div>
        )}

        <Button
          type="submit"
          variant="outline"
          size="lg"
          disabled={loading !== ""}
          className="w-full"
        >
          {loading === "pass" && <LoaderCircle className="animate-spin" />}
          Se connecter
        </Button>
      </form>

      {error && (
        <p role="alert" className="mt-5 text-center text-sm text-destructive">
          {error}
        </p>
      )}
    </AuthCard>
  );
}
