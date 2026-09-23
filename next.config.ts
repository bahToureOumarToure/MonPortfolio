import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

const nextConfigFunction = async (phase: string) => {
  // La PWA n'est générée qu'au build de production. En dev, aucun service
  // worker n'est produit/servi : on évite ainsi qu'un SW périmé intercepte les
  // navigations et casse les actions de l'admin pendant les tests locaux.
  if (phase === PHASE_PRODUCTION_BUILD) {
    const pwa = await import("@ducanh2912/next-pwa");
    const withPWA = pwa.default({
      dest: "public",
      register: true,
      reloadOnOnline: true,
      workboxOptions: {
        disableDevLogs: true,
        // L'admin et l'API ne doivent JAMAIS être mis en cache : ce sont des
        // zones privées/dynamiques. On force le réseau direct (pas de cache,
        // pas d'attente NetworkFirst) pour /admin et /api.
        navigateFallbackDenylist: [/^\/admin/, /^\/api/],
        runtimeCaching: [
          {
            urlPattern: /\/(?:admin|api)(?:\/|$)/,
            handler: "NetworkOnly" as const,
          },
          ...pwa.runtimeCaching,
        ],
      },
    });
    return withPWA(nextConfig);
  }
  return nextConfig;
};

export default nextConfigFunction;
