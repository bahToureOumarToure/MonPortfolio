"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import AuthCard from "@/components/admin/AuthCard";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

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
    <AuthCard
      title="Configuration admin"
      subtitle="Première connexion : sécurise l'accès à ton espace."
    >
      {booting && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" /> Chargement…
        </p>
      )}

      {already && (
        <p className="text-sm">
          L&apos;administrateur est déjà configuré.{" "}
          <a
            href="/admin/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Se connecter
          </a>
        </p>
      )}

      {info && (
        <form onSubmit={submit} className="flex flex-col gap-5">
          <p className="text-sm text-muted-foreground">
            Compte :{" "}
            <span className="font-medium text-foreground">{info.email}</span>.
            Scanne ce QR code dans ton application d&apos;authentification
            (Google Authenticator, Authy…), puis choisis un mot de passe.
          </p>

          <div className="flex justify-center">
            <Image
              src={info.qrDataUrl}
              alt="QR code de configuration 2FA"
              width={180}
              height={180}
              unoptimized
              className="rounded-xl border bg-white p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="setup-password">
              Mot de passe (10 caractères minimum)
            </Label>
            <Input
              id="setup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={10}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="setup-confirm">Confirmer le mot de passe</Label>
            <Input
              id="setup-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="setup-totp">
              Code 2FA (depuis l&apos;application)
            </Label>
            <Input
              id="setup-totp"
              inputMode="numeric"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              placeholder="123456"
              autoComplete="one-time-code"
              className="font-mono tracking-[0.4em]"
              required
            />
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading && <LoaderCircle className="animate-spin" />}
            Activer l&apos;administration
          </Button>
        </form>
      )}

      {error && !already && (
        <p role="alert" className="mt-5 text-center text-sm text-destructive">
          {error}
        </p>
      )}
    </AuthCard>
  );
}
