import "server-only";

/**
 * Défense CSRF : n'accepte une requête mutante que si l'en-tête Origin
 * correspond à l'hôte de la requête (même origine). Les requêtes sans Origin
 * (navigation top-level GET) ne passent jamais par ici.
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(req: Request): string | null {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null
  );
}
