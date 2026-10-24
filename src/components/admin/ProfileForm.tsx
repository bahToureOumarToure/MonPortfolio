"use client";
import { useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { updateProfile } from "@/lib/actions/singletons";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import MediaPicker from "./MediaPicker";
import { Field } from "./ui";
import { useAction, useUnsavedWarning } from "./use-action";

export interface ProfileFormValues {
  aboutTitle: string;
  aboutHighlight: string;
  description: string;
  image: string;
}

export default function ProfileForm({
  initial,
}: {
  initial: ProfileFormValues;
}) {
  const [v, setV] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const { pending, execute } = useAction();
  useUnsavedWarning(dirty && !pending);

  function set<K extends keyof ProfileFormValues>(
    k: K,
    val: ProfileFormValues[K],
  ) {
    setV((p) => ({ ...p, [k]: val }));
    setDirty(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await execute(() => updateProfile(v), {
      success: "Présentation enregistrée.",
    });
    if (res.ok) setDirty(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Titre" htmlFor="pr-title">
          <Input
            id="pr-title"
            value={v.aboutTitle}
            onChange={(e) => set("aboutTitle", e.target.value)}
            maxLength={80}
          />
        </Field>
        <Field label="Suite du titre (couleur d'accent)" htmlFor="pr-hl">
          <Input
            id="pr-hl"
            value={v.aboutHighlight}
            onChange={(e) => set("aboutHighlight", e.target.value)}
            maxLength={120}
          />
        </Field>
      </div>
      <Field
        label="Présentation"
        htmlFor="pr-desc"
        hint="Un paragraphe par ligne."
      >
        <Textarea
          id="pr-desc"
          rows={6}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
          required
          maxLength={4000}
        />
      </Field>
      <Field label="Photo de profil">
        <MediaPicker
          aspect="portrait"
          value={v.image}
          onChange={(url) => set("image", url as string)}
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
