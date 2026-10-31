-- Formation à jour : 3e année du cycle ingénieur à l'ENIADB et DEUG de la
-- Faculté des Sciences d'Oujda (contenu fourni par le propriétaire du site).
UPDATE "Education"
SET "title" = '3e année cycle ingénieur d’État — Génie informatique',
    "institution" = 'École Nationale de l’Intelligence Artificielle et du Digital de Berkane (ENIADB)',
    "duration" = 'oct. 2024 – juil. 2027',
    "order" = 0,
    "active" = true
WHERE "institution" ILIKE '%ENIAD%' OR "title" ILIKE '%cycle ingénieur%';

INSERT INTO "Education" ("id", "title", "institution", "duration", "order", "active")
SELECT 'edu_eniadb', '3e année cycle ingénieur d’État — Génie informatique',
       'École Nationale de l’Intelligence Artificielle et du Digital de Berkane (ENIADB)',
       'oct. 2024 – juil. 2027', 0, true
WHERE NOT EXISTS (SELECT 1 FROM "Education" WHERE "institution" ILIKE '%ENIAD%');

INSERT INTO "Education" ("id", "title", "institution", "duration", "order", "active")
SELECT 'edu_fso_deug', 'DEUG — Mathématiques et Informatique Appliquées',
       'Faculté des Sciences d’Oujda', 'oct. 2022 – mai 2024',
       COALESCE((SELECT MAX("order") FROM "Education"), 0) + 1, true
WHERE NOT EXISTS (SELECT 1 FROM "Education" WHERE "institution" ILIKE '%Oujda%' OR "title" ILIKE '%DEUG%');
