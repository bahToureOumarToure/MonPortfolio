-- Multilingue : une colonne de traductions (fr / es / ar) par contenu. Les
-- colonnes existantes restent le texte par défaut (anglais). Additif : une
-- colonne vide signifie simplement « pas encore traduit ».
ALTER TABLE "Hero" ADD COLUMN IF NOT EXISTS "translations" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "translations" JSONB;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "translations" JSONB;
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "translations" JSONB;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "translations" JSONB;
ALTER TABLE "Experience" ADD COLUMN IF NOT EXISTS "translations" JSONB;
ALTER TABLE "Education" ADD COLUMN IF NOT EXISTS "translations" JSONB;
