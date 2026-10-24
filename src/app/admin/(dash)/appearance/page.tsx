import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import { DEFAULT_THEME, sanitizeTheme } from "@/lib/theme";
import AppearanceForm from "@/components/admin/AppearanceForm";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AppearancePage() {
  await requireAdmin();
  // Lecture directe (non mise en cache) pour refléter l'état réel de la base.
  let ready = true;
  let theme = DEFAULT_THEME;
  try {
    const row = await prisma.siteTheme.findUnique({
      where: { id: "singleton" },
    });
    if (row) theme = sanitizeTheme(row);
  } catch {
    ready = false;
  }

  return (
    <>
      <PageHeader
        title="Apparence"
        description="Choisis le mode et la couleur d'accent du site. Tout le site (et l'admin) suit ces réglages."
      />
      {!ready && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          La table du thème n&apos;existe pas encore dans la base : elle est
          créée automatiquement au prochain déploiement Vercel. En local, lance{" "}
          <code className="font-mono">npm run db:sync</code>. En attendant, le
          site utilise le thème clair par défaut.
        </div>
      )}
      <AppearanceForm initial={theme} disabled={!ready} />
    </>
  );
}
