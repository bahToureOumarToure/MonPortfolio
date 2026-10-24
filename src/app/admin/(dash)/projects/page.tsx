import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProjects } from "@/lib/admin-queries";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/ui";
import ProjectsTable, {
  type ProjectRow,
} from "@/components/admin/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getAdminProjects().catch(() => []);
  const rows: ProjectRow[] = projects.map((p) => ({
    id: p.id,
    legacyId: p.legacyId,
    name: p.name,
    role: p.role,
    cover: p.primaryImage?.url ?? p.images[0]?.media.url ?? null,
    active: p.active,
    featured: p.featured,
  }));

  return (
    <>
      <PageHeader
        title="Projets"
        description="Les 3 premiers projets (les « mis en avant » d'abord) apparaissent sur l'accueil."
        actions={
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus /> Nouveau projet
            </Link>
          </Button>
        }
      />
      <ProjectsTable initial={rows} />
    </>
  );
}
