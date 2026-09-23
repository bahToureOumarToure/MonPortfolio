import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import { ShieldCheck, FolderGit2, Cpu, Images } from "lucide-react";

export const dynamic = "force-dynamic";

async function safeCount(fn: () => Promise<number>): Promise<number | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  await requireAdmin();

  const [projects, skills, media] = await Promise.all([
    safeCount(() => prisma.project.count()),
    safeCount(() => prisma.skill.count()),
    safeCount(() => prisma.media.count()),
  ]);

  const stats = [
    { label: "Projets", value: projects, icon: FolderGit2 },
    { label: "Compétences", value: skills, icon: Cpu },
    { label: "Médias", value: media, icon: Images },
  ];

  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Tableau de bord</h1>
        <p className="text-slate-400 mt-2">
          Gère le contenu de ton portfolio. Les modules d'édition arrivent
          progressivement (Phase 3).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-black">
                  {s.value === null ? "—" : s.value}
                </p>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-red-500" />
          <div>
            <h2 className="font-bold">Sécurité du compte</h2>
            <p className="text-sm text-slate-400">
              Gère tes passkeys et ta session.
            </p>
          </div>
        </div>
        <Link
          href="/admin/security"
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/40 hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-widest text-center"
        >
          Ouvrir
        </Link>
      </div>

      {projects === null && (
        <p className="text-sm text-amber-400/80">
          ⚠️ Base de données injoignable. Vérifie DATABASE_URL puis lance
          <code className="mx-1 px-1.5 py-0.5 rounded bg-white/10">
            npm run db:migrate &amp;&amp; npm run db:seed
          </code>
          .
        </p>
      )}
    </div>
  );
}
