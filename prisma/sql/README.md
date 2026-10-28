# Migrations SQL additives

Appliquées automatiquement au build Vercel par `scripts/db-sync.mjs`, dans
l'ordre alphabétique, **une seule fois chacune** (journal `_sql_migrations`).

Règles :

1. Uniquement des changements **additifs** et **idempotents**
   (`CREATE TABLE IF NOT EXISTS`, `ALTER TYPE … ADD VALUE IF NOT EXISTS`,
   `INSERT … WHERE NOT EXISTS`…). Jamais de `DROP` ni de perte de données.
2. Garder `prisma/schema.prisma` aligné : la CI rejoue ces fichiers sur une
   base au schéma de `main` et exige zéro écart (`prisma migrate diff`).
3. Une migration qui **modifie des données** doit s'accompagner d'une
   nouvelle valeur de `CACHE_VERSION` dans `src/lib/queries.ts` (le cache de
   données Vercel survit aux redéploiements).
