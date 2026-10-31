import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";
import { localizedPath, locales } from "@/i18n/routing";

/** Chaque page dans chaque langue, avec ses équivalents (hreflang). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const now = new Date();
  const pages: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly";
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
    ...projects.map((p) => ({
      path: `/projects/${p.id}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
  ];
  const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
  return pages.flatMap(({ path, priority, changeFrequency }) => {
    const languages = Object.fromEntries(
      locales.map((l) => [l, url(localizedPath(l, path))]),
    );
    return locales.map((l) => ({
      url: url(localizedPath(l, path)),
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
