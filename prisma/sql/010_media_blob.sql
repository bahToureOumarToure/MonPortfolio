-- Stockage de secours des fichiers envoyés (images, CV) directement dans la
-- base : les uploads fonctionnent même sans store Vercel Blob relié au projet.
-- Additif : aucune table existante n'est touchée.
CREATE TABLE IF NOT EXISTS "MediaBlob" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MediaBlob_pkey" PRIMARY KEY ("id")
);
