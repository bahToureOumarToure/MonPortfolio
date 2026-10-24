import { z } from "zod";

// Messages Zod en français, avec un libellé lisible pour les champs courants.
const LABELS: Record<string, string> = {
  name: "Nom",
  title: "Titre",
  description: "Description",
  url: "URL",
  platform: "Plateforme",
  company: "Entreprise",
  institution: "Établissement",
  duration: "Période",
  role: "Rôle",
  tagline: "Badge",
  subheading: "Sous-titre",
  designation: "Désignation",
  siteTitle: "Titre du site",
  metaDescription: "Méta-description",
  contactEmail: "Email public",
  footerTagline: "Texte du footer",
  color: "Couleur",
  iconKey: "Icône",
  alt: "Texte alternatif",
};

z.setErrorMap((issue, ctx) => {
  const key = String(issue.path[issue.path.length - 1] ?? "");
  const label = LABELS[key] ?? "Ce champ";
  switch (issue.code) {
    case z.ZodIssueCode.too_big:
      return { message: `${label} : ${issue.maximum} caractères maximum.` };
    case z.ZodIssueCode.too_small:
      return { message: `${label} est requis.` };
    case z.ZodIssueCode.invalid_type:
      return { message: `${label} est invalide.` };
    case z.ZodIssueCode.invalid_enum_value:
      return { message: `${label} : valeur non autorisée.` };
    default:
      return { message: ctx.defaultError };
  }
});

export { z };
