/**
 * Seed initial : importe le contenu actuellement hardcodé (utils/Data/*)
 * dans la base. Idempotent (remet à zéro le contenu à chaque exécution).
 * Les médias pointent d'abord vers les fichiers /public existants ;
 * les nouveaux uploads iront ensuite sur Vercel Blob via l'admin.
 *
 * Ne touche PAS aux tables d'authentification (bootstrap admin séparé).
 */
import { PrismaClient, SkillCategory, MediaKind } from "@prisma/client";
import { personalData } from "../utils/Data/PersonalData";
import { projectsData } from "../utils/Data/projects-data";
import { skillsData } from "../utils/Data/skills";
import { experiences } from "../utils/Data/experience";
import { educations } from "../utils/Data/educations";

const prisma = new PrismaClient();

const CATEGORY_MAP: Record<string, SkillCategory> = {
  Frontend: "FRONTEND",
  Backend: "BACKEND",
  Langages: "LANGAGES",
  Database: "DATABASE",
  "Data & IA": "DATA_IA",
  Mobile: "MOBILE",
  Tools: "TOOLS",
};

function basename(p: string): string {
  return p.split("/").filter(Boolean).pop() ?? p;
}

async function main() {
  console.log("🌱 Seed : réinitialisation du contenu…");

  // Suppression dans un ordre respectant les clés étrangères
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.media.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();

  // --- Média de profil (photo /profile.png) ---
  const profileMedia = await prisma.media.create({
    data: {
      url: personalData.profile,
      filename: basename(personalData.profile),
      mimeType: "image/png",
      kind: MediaKind.IMAGE,
      alt: "Photo de Bah Oumar Touré",
    },
  });

  // --- Hero (singleton) ---
  await prisma.hero.create({
    data: {
      id: "singleton",
      tagline: "WELCOME TO MY UNIVERSE",
      headingTop: "Crafting Digital",
      headingBottom: "Masterpieces",
      name: personalData.name,
      designation: personalData.designation,
      alternateWords: personalData.designationAlternateWords,
      subheading:
        "dedicated to building high-performance, user-focused digital products",
      ctaPrimaryLabel: "Let's Collaborate",
      ctaPrimaryHref: "/#contact",
      ctaResumeLabel: "Get Resume",
    },
  });

  // --- Profil / About (singleton) ---
  await prisma.profile.create({
    data: {
      id: "singleton",
      aboutTitle: "About",
      aboutHighlight: "The Software Engineer",
      description: personalData.description,
      imageId: profileMedia.id,
    },
  });

  // --- Paramètres du site (singleton) ---
  await prisma.siteSettings.create({
    data: {
      id: "singleton",
      siteTitle: "Bah Oumar Touré Portfolio",
      metaDescription:
        "Portfolio de Bah Oumar Touré — Étudiant ingénieur ENIAD Berkane. IA, Data, DevOps & Full-Stack.",
      contactEmail: personalData.email,
      phone: personalData.phone,
      address: personalData.address,
      footerTagline:
        "A curated showcase of high-performance full-stack applications, AI experiments, and intuitive digital experiences built with purpose.",
      resumeExternalUrl: personalData.resume,
      sections: {
        hero: { visible: true, order: 0 },
        about: { visible: true, order: 1 },
        experience: { visible: true, order: 2 },
        skills: { visible: true, order: 3 },
        projects: { visible: true, order: 4 },
        contact: { visible: true, order: 5 },
        education: { visible: false, order: 6 },
      },
    },
  });

  // --- Liens sociaux ---
  const socials: {
    platform: string;
    url: string;
    iconKey: string;
    color: string;
  }[] = [
    {
      platform: "GitHub",
      url: personalData.github,
      iconKey: "github",
      color: "#ffffff",
    },
    {
      platform: "LinkedIn",
      url: personalData.linkedIn,
      iconKey: "linkedin",
      color: "#0077b5",
    },
    {
      platform: "Twitter",
      url: personalData.twitter,
      iconKey: "twitter",
      color: "#1da1f2",
    },
    {
      platform: "StackOverflow",
      url: personalData.stackOverflow,
      iconKey: "stackoverflow",
      color: "#f48024",
    },
    {
      platform: "Facebook",
      url: personalData.facebook,
      iconKey: "facebook",
      color: "#1877f2",
    },
    {
      platform: "Instagram",
      url: personalData.Instagram,
      iconKey: "instagram",
      color: "#e4405f",
    },
    {
      platform: "LeetCode",
      url: personalData.leetcode,
      iconKey: "leetcode",
      color: "#ffa116",
    },
  ];
  await prisma.socialLink.createMany({
    data: socials.map((s, i) => ({ ...s, order: i, active: true })),
  });

  // --- Compétences (iconKey = nom ; couleur résolue au rendu si null) ---
  await prisma.skill.createMany({
    data: skillsData.map((s, i) => ({
      name: s.name,
      category: CATEGORY_MAP[s.category] ?? SkillCategory.TOOLS,
      iconKey: s.name,
      order: i,
      active: true,
    })),
  });

  // --- Expériences / recherche de stage ---
  await prisma.experience.createMany({
    data: experiences.map((e, i) => ({
      title: e.title,
      company: e.company,
      duration: e.duration,
      details: e.details,
      order: i,
      active: true,
    })),
  });

  // --- Formation ---
  await prisma.education.createMany({
    data: educations.map((e, i) => ({
      title: e.title,
      duration: e.duration,
      institution: e.institution,
      order: i,
      active: true,
    })),
  });

  // --- Projets (+ images) ---
  for (let i = 0; i < projectsData.length; i++) {
    const p = projectsData[i];
    const images = (p.images ?? []).filter(Boolean);

    const project = await prisma.project.create({
      data: {
        legacyId: p.id,
        name: p.name.trim(),
        description: p.description,
        role: p.role ?? "",
        tools: p.tools ?? [],
        highlights: p.highlights ?? [],
        challenges: p.challenges ?? [],
        codeUrl: p.code ? p.code : null,
        demoUrl: p.demo ? p.demo : null,
        date: p.date ?? null,
        featured: i < 3,
        active: true,
        order: i,
      },
    });

    let primaryImageId: string | null = null;
    for (let j = 0; j < images.length; j++) {
      const url = images[j];
      const media = await prisma.media.create({
        data: {
          url,
          filename: basename(url),
          mimeType: url.endsWith(".png")
            ? "image/png"
            : url.endsWith(".jpg") || url.endsWith(".jpeg")
              ? "image/jpeg"
              : "image/*",
          kind: MediaKind.IMAGE,
          alt: `${p.name.trim()} — image ${j + 1}`,
        },
      });
      if (j === 0) primaryImageId = media.id;
      await prisma.projectImage.create({
        data: { projectId: project.id, mediaId: media.id, order: j },
      });
    }

    if (primaryImageId) {
      await prisma.project.update({
        where: { id: project.id },
        data: { primaryImageId },
      });
    }
  }

  const counts = {
    projets: await prisma.project.count(),
    skills: await prisma.skill.count(),
    socials: await prisma.socialLink.count(),
    experiences: await prisma.experience.count(),
    educations: await prisma.education.count(),
    medias: await prisma.media.count(),
  };
  console.log("✅ Seed terminé :", counts);
}

main()
  .catch((e) => {
    console.error("❌ Seed échoué :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
