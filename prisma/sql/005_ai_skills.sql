-- Compétences IA ajoutées (Claude Code, Antigravity, RAG, IA agentique et multi-agents,
-- LLM, Prompt Engineering), placées à la suite de la catégorie Data & IA.
-- Exécutée UNE seule fois (journal _sql_migrations) : une compétence
-- supprimée ensuite dans l'admin ne réapparaît pas. Une compétence déjà
-- présente (même nom, sans tenir compte de la casse) n'est jamais dupliquée.
INSERT INTO "Skill" ("id", "name", "category", "iconKey", "order", "active", "updatedAt")
SELECT
  'skl_' || md5(lower(v.name)),
  v.name,
  'DATA_IA'::"SkillCategory",
  v.name,
  COALESCE((SELECT MAX(s."order") FROM "Skill" s WHERE s."category" = 'DATA_IA'::"SkillCategory"), -1) + v.ord,
  true,
  CURRENT_TIMESTAMP
FROM (
  VALUES
    ('Claude Code', 1),
    ('Antigravity', 2),
    ('RAG', 3),
    ('Agentic AI', 4),
    ('Multi-Agent AI', 5),
    ('LLM', 6),
    ('Prompt Engineering', 7)
) AS v (name, ord)
WHERE NOT EXISTS (SELECT 1 FROM "Skill" s WHERE lower(s."name") = lower(v.name))
ON CONFLICT ("id") DO NOTHING;
