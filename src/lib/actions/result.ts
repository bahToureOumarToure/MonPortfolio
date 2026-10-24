// Type de retour commun des Server Actions (importable côté client).
// En production, Next.js masque le message des erreurs levées par une action :
// on renvoie donc toujours un résultat explicite et lisible.
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };
