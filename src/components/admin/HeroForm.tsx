"use client";
import { useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { updateHero } from "@/lib/actions/singletons";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import MediaPicker from "./MediaPicker";
import { Field } from "./ui";
import { useAction, useUnsavedWarning } from "./use-action";

export interface HeroFormValues {
  tagline: string;
  headingTop: string;
  headingBottom: string;
  name: string;
  designation: string;
  alternateWords: string; // séparés par des virgules
  subheading: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaResumeLabel: string;
  heroImage: string;
}

export default function HeroForm({ initial }: { initial: HeroFormValues }) {
  const [v, setV] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const { pending, execute } = useAction();
  useUnsavedWarning(dirty && !pending);

  function set<K extends keyof HeroFormValues>(k: K, val: HeroFormValues[K]) {
    setV((p) => ({ ...p, [k]: val }));
    setDirty(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await execute(
      () =>
        updateHero({
          ...v,
          alternateWords: v.alternateWords
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      { success: "Section d'accueil enregistrée." },
    );
    if (res.ok) setDirty(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <Field
        label="Badge"
        htmlFor="h-tag"
        hint="Petit texte au-dessus du titre (ex. disponibilité)."
      >
        <Input
          id="h-tag"
          value={v.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          maxLength={120}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Titre — début" htmlFor="h-top">
          <Input
            id="h-top"
            value={v.headingTop}
            onChange={(e) => set("headingTop", e.target.value)}
            maxLength={120}
          />
        </Field>
        <Field label="Titre — fin (couleur d'accent)" htmlFor="h-bottom">
          <Input
            id="h-bottom"
            value={v.headingBottom}
            onChange={(e) => set("headingBottom", e.target.value)}
            maxLength={120}
          />
        </Field>
        <Field label="Nom affiché" htmlFor="h-name">
          <Input
            id="h-name"
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            required
            maxLength={120}
          />
        </Field>
        <Field
          label="Désignation"
          htmlFor="h-des"
          hint="Utilisée si aucun mot animé n'est défini."
        >
          <Input
            id="h-des"
            value={v.designation}
            onChange={(e) => set("designation", e.target.value)}
            maxLength={160}
          />
        </Field>
      </div>
      <Field
        label="Mots animés"
        htmlFor="h-words"
        hint="Séparés par des virgules ; ils défilent après « Software »."
      >
        <Input
          id="h-words"
          value={v.alternateWords}
          onChange={(e) => set("alternateWords", e.target.value)}
          placeholder="Developer., DevOps., Engineer."
        />
      </Field>
      <Field label="Sous-titre" htmlFor="h-sub">
        <Textarea
          id="h-sub"
          rows={2}
          value={v.subheading}
          onChange={(e) => set("subheading", e.target.value)}
          maxLength={400}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Bouton principal" htmlFor="h-cta">
          <Input
            id="h-cta"
            value={v.ctaPrimaryLabel}
            onChange={(e) => set("ctaPrimaryLabel", e.target.value)}
            maxLength={60}
          />
        </Field>
        <Field label="Lien du bouton" htmlFor="h-href">
          <Input
            id="h-href"
            value={v.ctaPrimaryHref}
            onChange={(e) => set("ctaPrimaryHref", e.target.value)}
            placeholder="/#contact"
          />
        </Field>
        <Field label="Bouton CV" htmlFor="h-cv">
          <Input
            id="h-cv"
            value={v.ctaResumeLabel}
            onChange={(e) => set("ctaResumeLabel", e.target.value)}
            maxLength={60}
          />
        </Field>
      </div>
      <Field
        label="Image du hero (optionnelle)"
        hint="Remplace la carte « code » à droite du titre."
      >
        <MediaPicker
          aspect="wide"
          value={v.heroImage}
          onChange={(url) => set("heroImage", url as string)}
        />
      </Field>
      <div className="flex items-center justify-end gap-3">
        {dirty && (
          <span className="mr-auto text-xs text-muted-foreground">
            Modifications non enregistrées
          </span>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? <LoaderCircle className="animate-spin" /> : <Save />}
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
