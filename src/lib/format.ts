/** "2025-12-20" → "décembre 2025" ; renvoie la valeur brute si non datable. */
export function formatProjectDate(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(d);
}
