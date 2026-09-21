import "server-only";
import crypto from "crypto";

// Clé dérivée d'AUTH_SECRET pour chiffrer le secret TOTP au repos (AES-256-GCM).
function key(): Buffer {
  const secret = process.env.AUTH_SECRET ?? "dev-secret-change-me";
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptSecret(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, enc].map((b) => b.toString("base64url")).join(".");
}

export function decryptSecret(payload: string): string {
  const [ivB, tagB, encB] = payload.split(".");
  const iv = Buffer.from(ivB, "base64url");
  const tag = Buffer.from(tagB, "base64url");
  const enc = Buffer.from(encB, "base64url");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString(
    "utf8",
  );
}
