-- Compétences ajoutées par défaut (DevOps, IA, soft skills). Exécutée UNE
-- seule fois (journal _sql_migrations) : une compétence supprimée ensuite
-- dans l'admin ne réapparaît pas.
-- - Une compétence déjà présente (même nom, sans tenir compte de la casse)
--   n'est jamais dupliquée.
-- - Si la table est vide (site affiché à partir du contenu par défaut), la
--   liste complète est insérée pour ne rien perdre à l'affichage.
INSERT INTO "Skill" ("id", "name", "category", "iconKey", "order", "active", "updatedAt")
SELECT
  'skl_' || md5(lower(v.name)),
  v.name,
  v.category::"SkillCategory",
  v.name,
  COALESCE((SELECT MAX(s."order") FROM "Skill" s WHERE s."category" = v.category::"SkillCategory"), -1) + v.ord,
  true,
  CURRENT_TIMESTAMP
FROM (
  VALUES
    ('HTML', 'FRONTEND', 1, false),
    ('CSS', 'FRONTEND', 2, false),
    ('Javascript', 'FRONTEND', 3, false),
    ('React', 'FRONTEND', 4, false),
    ('Tailwind', 'FRONTEND', 5, false),
    ('MaterialUI', 'FRONTEND', 6, false),
    ('Spring Boot', 'BACKEND', 1, false),
    ('.NET', 'BACKEND', 2, false),
    ('Python', 'LANGAGES', 1, false),
    ('C#', 'LANGAGES', 2, false),
    ('C++', 'LANGAGES', 3, false),
    ('C', 'LANGAGES', 4, false),
    ('MySQL', 'DATABASE', 1, false),
    ('PostgreSQL', 'DATABASE', 2, false),
    ('SQL', 'DATABASE', 3, false),
    ('Firebase', 'DATABASE', 4, false),
    ('LINQ', 'DATABASE', 5, false),
    ('Power BI', 'DATA_IA', 1, false),
    ('IA', 'DATA_IA', 2, false),
    ('Machine Learning', 'DATA_IA', 3, true),
    ('Deep Learning', 'DATA_IA', 4, true),
    ('LangChain', 'DATA_IA', 5, true),
    ('TensorFlow', 'DATA_IA', 6, true),
    ('Flutter', 'MOBILE', 1, false),
    ('Git', 'TOOLS', 1, false),
    ('Figma', 'TOOLS', 2, false),
    ('Canva', 'TOOLS', 3, false),
    ('Illustrator', 'TOOLS', 4, false),
    ('Photoshop', 'TOOLS', 5, false),
    ('Docker', 'DEVOPS', 1, true),
    ('Kubernetes', 'DEVOPS', 2, true),
    ('Jenkins', 'DEVOPS', 3, true),
    ('GitHub Actions', 'DEVOPS', 4, true),
    ('CI/CD', 'DEVOPS', 5, true),
    ('Linux', 'DEVOPS', 6, true),
    ('Agile / Scrum', 'SOFT_SKILLS', 1, true),
    ('Écoute active', 'SOFT_SKILLS', 2, true),
    ('Empathique', 'SOFT_SKILLS', 3, true),
    ('Curieux', 'SOFT_SKILLS', 4, true),
    ('Motivé', 'SOFT_SKILLS', 5, true),
    ('Apprentissage continu', 'SOFT_SKILLS', 6, true),
    ('Esprit d''équipe', 'SOFT_SKILLS', 7, true),
    ('Autonome', 'SOFT_SKILLS', 8, true)
) AS v (name, category, ord, is_new)
WHERE NOT EXISTS (SELECT 1 FROM "Skill" s WHERE lower(s."name") = lower(v.name))
  AND (v.is_new OR NOT EXISTS (SELECT 1 FROM "Skill"))
ON CONFLICT ("id") DO NOTHING;
