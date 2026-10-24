-- Livrable 4 : thème du site piloté depuis l'admin.
-- Migration ADDITIVE et idempotente : ne touche à aucune table existante,
-- peut être rejouée sans effet (IF NOT EXISTS).
CREATE TABLE IF NOT EXISTS "SiteTheme" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "mode" TEXT NOT NULL DEFAULT 'light',
    "accent" TEXT NOT NULL DEFAULT '#dc2626',
    "radius" TEXT NOT NULL DEFAULT 'lg',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteTheme_pkey" PRIMARY KEY ("id")
);
