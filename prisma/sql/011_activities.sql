-- Activités extra-universitaires (bénévolat, associations, clubs…) : nouvelle
-- rubrique du parcours, gérée dans Admin › Activités. Additif : aucune table
-- existante n'est touchée ; table vide = rubrique masquée sur le site.
CREATE TABLE IF NOT EXISTS "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL DEFAULT '',
    "duration" TEXT NOT NULL DEFAULT '',
    "details" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "translations" JSONB,
    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Activity_order_idx" ON "Activity"("order");
