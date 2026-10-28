-- Nouvelles catégories de compétences : DevOps et Soft skills.
-- Additif et idempotent (IF NOT EXISTS).
ALTER TYPE "SkillCategory" ADD VALUE IF NOT EXISTS 'DEVOPS';
ALTER TYPE "SkillCategory" ADD VALUE IF NOT EXISTS 'SOFT_SKILLS';
