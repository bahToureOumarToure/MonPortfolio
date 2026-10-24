import { KeyRound } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import PasskeyManager from "@/components/admin/PasskeyManager";
import { EmptyState, PageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const user = await requireAdmin();
  const passkeys = await prisma.authenticator
    .findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } })
    .catch(() => []);
  const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

  return (
    <>
      <PageHeader
        title="Sécurité"
        description="Connexion par passkey (recommandé) ou mot de passe + code 2FA."
      />
      <Panel title="Passkeys enregistrées">
        {passkeys.length === 0 ? (
          <EmptyState
            icon={<KeyRound className="h-8 w-8" />}
            title="Aucune passkey"
            description="Ajoute-en une ci-dessous pour une connexion plus rapide et plus sûre."
          />
        ) : (
          <ul className="-my-2 divide-y">
            {passkeys.map((pk) => (
              <li
                key={pk.credentialID}
                className="flex items-center gap-3 py-3"
              >
                <KeyRound className="h-4 w-4 text-primary" />
                <span className="flex-1 text-sm font-medium">
                  {pk.name ?? "Passkey"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Ajoutée le {fmt.format(pk.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <PasskeyManager />
    </>
  );
}
