-- Ordre des projets : le projet réalisé chez Arimayi en tête, puis les
-- projets à plus forte valeur ; les 3 premiers sont mis en avant sur
-- l'accueil. Exécutée UNE seule fois : l'ordre reste ensuite modifiable
-- dans l'admin (flèches). Les projets inconnus de cette liste gardent leur
-- ordre relatif, après les projets classés.
WITH ranked AS (
  SELECT
    p."id",
    p."order" AS old_order,
    CASE
      WHEN p."name" ILIKE '%arimayi%' OR p."description" ILIKE '%arimayi%' OR p."role" ILIKE '%arimayi%' THEN 0
      WHEN trim(p."name") ILIKE 'yahya%' THEN 1
      WHEN trim(p."name") ILIKE 'profila%' THEN 2
      WHEN trim(p."name") ILIKE 'hubeats%' THEN 3
      WHEN trim(p."name") ILIKE 'restaurant api%' THEN 4
      WHEN trim(p."name") ILIKE 'meteolive%' THEN 5
      WHEN trim(p."name") ILIKE 'deep learning%' THEN 6
      WHEN trim(p."name") ILIKE 'power bi%' THEN 7
      WHEN trim(p."name") ILIKE 'fitness log%' THEN 8
      WHEN trim(p."name") ILIKE 'gestion de d%' THEN 9
      WHEN trim(p."name") ILIKE 'burger queen%' THEN 10
      WHEN trim(p."name") ILIKE 'portfolio%' THEN 11
      ELSE 50
    END AS rank
  FROM "Project" p
),
numbered AS (
  SELECT "id", (ROW_NUMBER() OVER (ORDER BY rank, old_order) - 1)::int AS new_order
  FROM ranked
)
UPDATE "Project" p
SET "order" = n.new_order, "featured" = (n.new_order < 3), "updatedAt" = CURRENT_TIMESTAMP
FROM numbered n
WHERE p."id" = n."id";
