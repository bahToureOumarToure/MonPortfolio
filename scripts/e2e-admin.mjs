// Prépare le compte admin des tests e2e (base de test uniquement !).
import bcrypt from "bcryptjs";
import prismaPkg from "@prisma/client";

const { PrismaClient } = prismaPkg;
const email = process.env.ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("[e2e-admin] ADMIN_EMAIL et E2E_ADMIN_PASSWORD sont requis.");
  process.exit(1);
}
if (process.env.VERCEL) {
  console.error("[e2e-admin] refusé sur Vercel : réservé aux bases de test.");
  process.exit(1);
}

const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash(password, 10);
await prisma.user.upsert({
  where: { email },
  create: { email, passwordHash },
  update: { passwordHash, isTwoFactorEnabled: false, totpSecret: null },
});
await prisma.loginAttempt.deleteMany({ where: { email } });
await prisma.$disconnect();
console.log(`[e2e-admin] compte de test prêt (${email}).`);
