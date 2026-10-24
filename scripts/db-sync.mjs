// Applique les migrations SQL additives de prisma/sql/ (ordre alphabétique).
//
// - Exécuté au build Vercel (VERCEL=1) ou à la demande (--force).
// - Chaque fichier doit être idempotent (CREATE ... IF NOT EXISTS, etc.) et
//   purement additif : ce script ne doit jamais pouvoir casser la prod.
// - Par défaut, un échec n'interrompt pas le build : le site garde ses
//   replis (ex. thème par défaut). Avec --strict (CI), l'échec est bloquant.
// - SKIP_DB_SYNC=1 désactive complètement l'étape.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import prismaPkg from "@prisma/client";

const { PrismaClient } = prismaPkg;
const args = new Set(process.argv.slice(2));
const strict = args.has("--strict");
const force = args.has("--force") || strict;
const TIMEOUT_MS = 30_000;
const SQL_DIR = join(fileURLToPath(new URL(".", import.meta.url)), "..", "prisma", "sql");

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const log = (msg) => console.log(`[db-sync] ${msg}`);

if (process.env.SKIP_DB_SYNC === "1") {
  log("ignoré (SKIP_DB_SYNC=1).");
  process.exit(0);
}
if (!force && process.env.VERCEL !== "1") {
  log("ignoré hors Vercel (utilise --force pour l'exécuter).");
  process.exit(0);
}
if (!url) {
  log("ignoré : aucune DATABASE_URL / DIRECT_URL.");
  process.exit(strict ? 1 : 0);
}

/** Découpe un fichier SQL simple en instructions (pas de ; dans les chaînes). */
function statements(sql) {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  const files = (await readdir(SQL_DIR)).filter((f) => f.endsWith(".sql")).sort();
  if (files.length === 0) return log("aucune migration.");
  const prisma = new PrismaClient({ datasourceUrl: url });
  try {
    for (const file of files) {
      const sql = await readFile(join(SQL_DIR, file), "utf8");
      for (const statement of statements(sql)) {
        await prisma.$executeRawUnsafe(statement);
      }
      log(`✓ ${file}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error(`délai dépassé (${TIMEOUT_MS / 1000}s)`)), TIMEOUT_MS).unref(),
);

try {
  await Promise.race([main(), timeout]);
  log("base à jour.");
  process.exit(0);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (strict) {
    console.error(`[db-sync] ✗ échec : ${message}`);
    process.exit(1);
  }
  console.warn(`[db-sync] ⚠ échec non bloquant : ${message} — le site utilisera ses valeurs par défaut.`);
  process.exit(0);
}
