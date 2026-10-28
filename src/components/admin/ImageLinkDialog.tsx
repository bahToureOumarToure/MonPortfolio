"use client";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { registerExternalImage } from "@/lib/actions/media";
import type { MediaDTO } from "@/lib/media-dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dialog from "./Dialog";
import { Field } from "./ui";
import { useAction } from "./use-action";

/** Ajout d'une image à partir d'un lien (copiée dans le stockage si possible). */
export default function ImageLinkDialog({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: (media: MediaDTO) => void;
}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const { pending, execute } = useAction();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await execute(() => registerExternalImage({ url, alt }), {
      success: "Image ajoutée.",
      refresh: false,
    });
    if (res.ok) {
      onAdded(res.data);
      setUrl("");
      setAlt("");
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      title="Ajouter une image par lien"
      description="Colle l'adresse directe d'une image (clic droit sur l'image › « Copier l'adresse de l'image »)."
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Lien de l'image" htmlFor="img-url">
          <Input
            id="img-url"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…/capture.png"
          />
        </Field>
        <Field
          label="Description (texte alternatif)"
          htmlFor="img-alt"
          hint="Optionnel, utile pour l'accessibilité et Google."
        >
          <Input
            id="img-alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            maxLength={200}
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={pending || !url.trim()}>
            {pending && <LoaderCircle className="animate-spin" />}
            Ajouter
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
