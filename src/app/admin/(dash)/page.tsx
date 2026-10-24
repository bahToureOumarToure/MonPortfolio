import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Cpu,
  Database,
  FolderGit2,
  GraduationCap,
  Images,
  Link2,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import { getRecentActivity } from "@/lib/admin-queries";
import { PageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

const SHORTCUTS = [
  {
    href: "/admin/profile",
    label: "Profil & Hero",
    desc: "Accroche, présentation, photo",
    icon: UserRound,
  },
  {
    href: "/admin/projects",
    label: "Projets",
    desc: "Ajouter, ordonner, mettre en avant",
    icon: FolderGit2,
  },
  {
    href: "/admin/skills",
    label: "Compétences",
    desc: "Stack technique par catégorie",
    icon: Cpu,
  },
  {
    href: "/admin/experience",
    label: "Expérience",
    desc: "Stages et recherches",
    icon: Briefcase,
  },
  {
    href: "/admin/education",
    label: "Formation",
    desc: "Diplômes et écoles",
    icon: GraduationCap,
  },
  {
    href: "/admin/socials",
    label: "Liens sociaux",
    desc: "GitHub, LinkedIn…",
    icon: Link2,
  },
  {
    href: "/admin/media",
    label: "Médias",
    desc: "Images et documents",
    icon: Images,
  },
  {
    href: "/admin/settings",
    label: "Paramètres & CV",
    desc: "Coordonnées, SEO, CV",
    icon: Settings,
  },
  {
    href: "/admin/security",
    label: "Sécurité",
    desc: "Passkeys et session",
    icon: ShieldCheck,
  },
];

const ACTION_LABELS: Record<string, string> = {
  "admin.login.password": "Connexion (mot de passe)",
  "admin.login.passkey": "Connexion (passkey)",
  "admin.setup": "Configuration de l'admin",
  "passkey.register": "Nouvelle passkey",
  "settings.publishedResume": "CV publié",
};

const VERBS: Record<string, string> = {
  create: "Ajout",
  update: "Modification",
  delete: "Suppression",
  flags: "Visibilité",
  alt: "Texte alternatif",
};

const ENTITIES: Record<string, string> = {
  Project: "projet",
  Skill: "compétence",
  SocialLink: "lien social",
  Experience: "expérience",
  Education: "formation",
  Media: "média",
  Hero: "hero",
  Profile: "profil",
  SiteSettings: "paramètres",
  SiteTheme: "apparence",
  User: "compte",
};

function describe(action: string, entity: string): string {
  if (ACTION_LABELS[action]) return ACTION_LABELS[action];
  const parts = action.split(".");
  const verb = parts[parts.length - 1];
  if (parts[1] === "assign")
    return `Image appliquée · ${parts[2] ?? ENTITIES[entity] ?? entity}`;
  return `${VERBS[verb] ?? verb} · ${ENTITIES[entity] ?? entity}`;
}

export default async function AdminDashboard() {
  await requireAdmin();

  const [projects, skills, media, experiences, activity] = await Promise.all([
    safe(() => prisma.project.count(), null),
    safe(() => prisma.skill.count(), null),
    safe(() => prisma.media.count(), null),
    safe(() => prisma.experience.count(), null),
    safe(() => getRecentActivity(8), []),
  ]);

  const stats = [
    {
      label: "Projets",
      value: projects,
      icon: FolderGit2,
      href: "/admin/projects",
    },
    { label: "Compétences", value: skills, icon: Cpu, href: "/admin/skills" },
    {
      label: "Expériences",
      value: experiences,
      icon: Briefcase,
      href: "/admin/experience",
    },
    { label: "Médias", value: media, icon: Images, href: "/admin/media" },
  ];
  const dbDown = projects === null;
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Gère le contenu de ton portfolio. Chaque modification est en ligne immédiatement."
      />

      {dbDown && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p>
            Base de données injoignable. Vérifie{" "}
            <code className="font-mono">DATABASE_URL</code> puis lance{" "}
            <code className="font-mono">
              npm run db:push &amp;&amp; npm run db:seed
            </code>
            .
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-foreground/20"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-2xl font-semibold tabular-nums">
                  {s.value ?? "—"}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {s.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel title="Accès rapide">
          <div className="grid gap-2 sm:grid-cols-2">
            {SHORTCUTS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/60"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{s.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {s.desc}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </Panel>

        <Panel title="Activité récente">
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune modification pour l&apos;instant.
            </p>
          ) : (
            <ol className="flex flex-col gap-3">
              {activity.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate">
                    {describe(a.action, a.entity)}
                  </span>
                  <time
                    dateTime={a.createdAt.toISOString()}
                    className="shrink-0 text-xs tabular-nums text-muted-foreground"
                  >
                    {fmt.format(a.createdAt)}
                  </time>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </>
  );
}
