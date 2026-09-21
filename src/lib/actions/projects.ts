"use server";
import { prisma } from "@/lib/db";
import { projectInput } from "@/lib/validation/project";
import { assertAdmin, audit, revalidateContent } from "./common";

async function revalidateProjects(legacyId?: number | null) {
  const paths = ["/", "/projects"];
  if (legacyId != null) paths.push(`/projects/${legacyId}`);
  await revalidateContent(["projects"], paths);
}

/** Remplace les images d'un projet (première = image principale). */
async function syncImages(projectId: string, urls: string[]) {
  await prisma.projectImage.deleteMany({ where: { projectId } });
  let primaryImageId: string | null = null;
  for (let j = 0; j < urls.length; j++) {
    const url = urls[j];
    let media = await prisma.media.findFirst({ where: { url } });
    if (!media) {
      media = await prisma.media.create({
        data: {
          url,
          filename: url.split("/").filter(Boolean).pop() ?? "image",
          mimeType: url.endsWith(".png")
            ? "image/png"
            : /\.jpe?g$/.test(url)
              ? "image/jpeg"
              : "image/*",
          kind: "IMAGE",
        },
      });
    }
    if (j === 0) primaryImageId = media.id;
    await prisma.projectImage.create({
      data: { projectId, mediaId: media.id, order: j },
    });
  }
  await prisma.project.update({
    where: { id: projectId },
    data: { primaryImageId },
  });
}

export async function createProject(input: unknown) {
  await assertAdmin();
  const data = projectInput.parse(input);

  const max = await prisma.project.aggregate({ _max: { legacyId: true } });
  const legacyId = (max._max.legacyId ?? 0) + 1;

  const project = await prisma.project.create({
    data: {
      legacyId,
      name: data.name,
      description: data.description,
      role: data.role,
      tools: data.tools.filter(Boolean),
      highlights: data.highlights.filter(Boolean),
      challenges: data.challenges.filter(Boolean),
      codeUrl: data.codeUrl || null,
      demoUrl: data.demoUrl || null,
      date: data.date || null,
      status: data.status || null,
      featured: data.featured,
      active: data.active,
      order: data.order,
    },
  });
  await syncImages(project.id, data.images);
  await audit("project.create", "Project", project.id);
  await revalidateProjects(legacyId);
  return { id: project.id, legacyId };
}

export async function updateProject(id: string, input: unknown) {
  await assertAdmin();
  const data = projectInput.parse(input);

  const project = await prisma.project.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      role: data.role,
      tools: data.tools.filter(Boolean),
      highlights: data.highlights.filter(Boolean),
      challenges: data.challenges.filter(Boolean),
      codeUrl: data.codeUrl || null,
      demoUrl: data.demoUrl || null,
      date: data.date || null,
      status: data.status || null,
      featured: data.featured,
      active: data.active,
      order: data.order,
    },
  });
  await syncImages(project.id, data.images);
  await audit("project.update", "Project", project.id);
  await revalidateProjects(project.legacyId);
  return { id: project.id, legacyId: project.legacyId };
}

export async function deleteProject(id: string) {
  await assertAdmin();
  const project = await prisma.project.findUnique({ where: { id } });
  await prisma.project.delete({ where: { id } });
  await audit("project.delete", "Project", id);
  await revalidateProjects(project?.legacyId ?? null);
}

export async function setProjectActive(id: string, active: boolean) {
  await assertAdmin();
  const project = await prisma.project.update({
    where: { id },
    data: { active },
  });
  await audit("project.setActive", "Project", id);
  await revalidateProjects(project.legacyId);
}
