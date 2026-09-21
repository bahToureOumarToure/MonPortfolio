import "server-only";
import { prisma } from "./db";

// Requêtes réservées à l'admin (données fraîches, incluant les éléments inactifs).
export async function getAdminProjects() {
  return prisma.project.findMany({
    orderBy: { order: "asc" },
    include: {
      primaryImage: true,
      images: { include: { media: true }, orderBy: { order: "asc" } },
    },
  });
}

export async function getAdminProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      images: { include: { media: true }, orderBy: { order: "asc" } },
    },
  });
}
