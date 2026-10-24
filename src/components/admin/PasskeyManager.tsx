"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { startRegistration } from "@simplewebauthn/browser";
import { LoaderCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, Panel } from "./ui";
import { useToast } from "./toaster";

export default function PasskeyManager() {
  const router = useRouter();
  const toast = useToast();
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);

  async function addPasskey(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const optRes = await fetch("/api/admin/passkeys/options", {
        method: "POST",
      });
      const options = await optRes.json();
      if (!optRes.ok) {
        toast.error(
          options.error ?? "Impossible de démarrer l'enregistrement.",
        );
        return;
      }
      const attResp = await startRegistration({ optionsJSON: options });
      const verRes = await fetch("/api/admin/passkeys/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: attResp, label: label || undefined }),
      });
      const data = await verRes.json();
      if (!verRes.ok) {
        toast.error(data.error ?? "Échec de l'enregistrement.");
        return;
      }
      toast.success("Passkey enregistrée.");
      setLabel("");
      router.refresh();
    } catch {
      toast.error("Enregistrement annulé ou non supporté par cet appareil.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      title="Ajouter une passkey"
      description="Enregistre l'empreinte, Face ID ou la clé de cet appareil pour te connecter sans mot de passe."
    >
      <form
        onSubmit={addPasskey}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <Field label="Nom de l'appareil" htmlFor="pk-label" className="flex-1">
          <Input
            id="pk-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="MacBook Touch ID"
            maxLength={60}
          />
        </Field>
        <Button type="submit" disabled={busy}>
          {busy ? <LoaderCircle className="animate-spin" /> : <Plus />}
          Ajouter
        </Button>
      </form>
    </Panel>
  );
}
