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

export async function getAdminHero() {
  return prisma.hero.findUnique({
    where: { id: "singleton" },
    include: { heroImage: true },
  });
}

export async function getAdminProfile() {
  return prisma.profile.findUnique({
    where: { id: "singleton" },
    include: { image: true },
  });
}

export async function getAdminSettings() {
  return prisma.siteSettings.findUnique({
    where: { id: "singleton" },
    include: { publishedResume: true },
  });
}

export async function getAdminMedia(kind?: "IMAGE" | "DOCUMENT") {
  return prisma.media.findMany({
    where: kind ? { kind } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          heroImages: true,
          profileImages: true,
          projectImages: true,
          projectCovers: true,
          resumeSettings: true,
        },
      },
    },
  });
}

export async function getAdminEducations() {
  return prisma.education.findMany({ orderBy: { order: "asc" } });
}

export async function getRecentActivity(take = 8) {
  return prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take });
}

export async function getAdminSkills() {
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
}

export async function getAdminSocials() {
  return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
}

export async function getAdminExperiences() {
  return prisma.experience.findMany({ orderBy: { order: "asc" } });
}
