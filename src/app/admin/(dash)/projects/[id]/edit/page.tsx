import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProject } from "@/lib/admin-queries";
import ProjectForm, {
  type ProjectFormValues,
} from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();

  const initial: ProjectFormValues = {
    name: project.name,
    description: project.description,
    role: project.role,
    tools: project.tools.join(", "),
    highlights: project.highlights.join("\n"),
    challenges: project.challenges.join("\n"),
    codeUrl: project.codeUrl ?? "",
    demoUrl: project.demoUrl ?? "",
    date: project.date ?? "",
    status: project.status ?? "",
    featured: project.featured,
    active: project.active,
    images: project.images.map((i) => i.media.url),
  };

  return (
    <>
      <Link
        href="/admin/projects"
        className="-mb-4 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Projets
      </Link>
      <PageHeader title={project.name} description="Modifier le projet" />
      <ProjectForm projectId={project.id} initial={initial} />
    </>
  );
}
