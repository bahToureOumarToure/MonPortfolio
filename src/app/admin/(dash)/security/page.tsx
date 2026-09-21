import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import PasskeyManager from "@/components/admin/PasskeyManager";
import { KeyRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const user = await requireAdmin();
  const passkeys = await prisma.authenticator
    .findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } })
    .catch(() => []);

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Sécurité</h1>
        <p className="text-slate-400 mt-2">
          Connexion : passkey (recommandé) ou mot de passe + 2FA TOTP.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-center gap-3 mb-4">
          <KeyRound className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold">Passkeys enregistrées</h2>
        </div>
        {passkeys.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucune passkey pour l'instant. Ajoute-en une ci-dessous.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {passkeys.map((pk) => (
              <li
                key={pk.credentialID}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <span className="text-sm font-medium">
                  {pk.name ?? "Passkey"}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(pk.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PasskeyManager />
    </div>
  );
}
