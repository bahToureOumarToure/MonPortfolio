-- HubEats : mention de la solution intelligente intégrée au projet.
-- Ajoutée à la suite du texte existant (les modifications faites dans l'admin
-- sont conservées) et seulement si elle n'y figure pas déjà.
UPDATE "Project"
SET "description" = rtrim("description") || ' Le projet intègre également une solution intelligente.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "name" ILIKE 'hubeats%'
  AND "description" NOT ILIKE '%solution intelligente%';

UPDATE "Project"
SET "highlights" = array_append("highlights", 'Intégration d''une solution intelligente à la plateforme.'),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "name" ILIKE 'hubeats%'
  AND NOT EXISTS (SELECT 1 FROM unnest("highlights") h WHERE h ILIKE '%solution intelligente%');
