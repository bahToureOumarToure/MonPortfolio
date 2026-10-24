import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bah Oumar Touré Portfolio",
    short_name: "Bah Oumar Touré",
    description: "Portfolio de Bah Oumar Touré — IA, Data, DevOps & Full-Stack",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/Pwa-logos/new-icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/Pwa-logos/new-icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/Pwa-logos/new-icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/Pwa-logos/new-icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/Website-overview.png",
        sizes: "1031x1024",
        type: "image/png",
        label: "Portfolio de Bah Oumar Touré",
      },
    ],
  };
}
