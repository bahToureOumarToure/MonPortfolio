"use client";
import { useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { updateSettings } from "@/lib/actions/singletons";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Field, Panel } from "./ui";
import TranslationsEditor, {
  translationsFromJson,
  translationsToPayload,
  type TranslationField,
} from "./TranslationsEditor";
import { useAction, useUnsavedWarning } from "./use-action";

export interface SettingsFormValues {
  translations?: unknown;
  siteTitle: string;
  metaDescription: string;
  contactEmail: string;
  phone: string;
  address: string;
  footerTagline: string;
  resumeExternalUrl: string;
}

const SETTINGS_FIELDS: TranslationField[] = [
  { key: "siteTitle", label: "Titre du site" },
  {
    key: "metaDescription",
    label: "Description (moteurs de recherche)",
    kind: "textarea",
  },
  { key: "footerTagline", label: "Phrase du pied de page", kind: "textarea" },
  { key: "address", label: "Adresse" },
];

export default function SettingsForm({
  initial,
}: {
  initial: SettingsFormValues;
}) {
  const [v, setV] = useState(initial);
  const [tr, setTr] = useState(() =>
    translationsFromJson(initial.translations, SETTINGS_FIELDS),
  );
  const [dirty, setDirty] = useState(false);
  const { pending, execute } = useAction();
  useUnsavedWarning(dirty && !pending);

  function set<K extends keyof SettingsFormValues>(
    k: K,
    val: SettingsFormValues[K],
  ) {
    setV((p) => ({ ...p, [k]: val }));
    setDirty(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await execute(
      () =>
        updateSettings({
          ...v,
          translations: translationsToPayload(tr, SETTINGS_FIELDS),
        }),
      {
        success: "Paramètres enregistrés.",
      },
    );
    if (res.ok) setDirty(false);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Panel
        title="Coordonnées"
        description="Affichées dans « À propos », « Contact » et le pied de page."
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Email public" htmlFor="st-email">
            <Input
              id="st-email"
              type="email"
              value={v.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </Field>
          <Field label="Téléphone" htmlFor="st-phone">
            <Input
              id="st-phone"
              type="tel"
              value={v.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Localisation" htmlFor="st-addr">
            <Input
              id="st-addr"
              value={v.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Référencement & pied de page">
        <div className="grid gap-5">
          <Field
            label="Titre du site"
            htmlFor="st-title"
            hint="Nom du site affiché dans les aperçus de partage (LinkedIn, WhatsApp…)."
          >
            <Input
              id="st-title"
              value={v.siteTitle}
              onChange={(e) => set("siteTitle", e.target.value)}
              maxLength={160}
            />
          </Field>
          <Field
            label="Méta-description"
            htmlFor="st-meta"
            hint={`Résumé pour Google et les partages (${v.metaDescription.length}/320 — idéalement 150 à 160).`}
          >
            <Textarea
              id="st-meta"
              rows={3}
              value={v.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              maxLength={320}
            />
          </Field>
          <Field label="Texte du pied de page" htmlFor="st-footer">
            <Textarea
              id="st-footer"
              rows={2}
              value={v.footerTagline}
              onChange={(e) => set("footerTagline", e.target.value)}
              maxLength={400}
            />
          </Field>
          <Field
            label="Lien CV externe (secours)"
            htmlFor="st-cv"
            hint="Utilisé seulement si aucun fichier CV n'est publié ci-dessous."
          >
            <Input
              id="st-cv"
              type="url"
              value={v.resumeExternalUrl}
              onChange={(e) => set("resumeExternalUrl", e.target.value)}
              placeholder="https://drive.google.com/…"
            />
          </Field>
        </div>
      </Panel>

      <TranslationsEditor
        idPrefix="settings"
        fields={SETTINGS_FIELDS}
        base={{ ...v }}
        value={tr}
        onChange={(next) => {
          setTr(next);
          setDirty(true);
        }}
      />
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
