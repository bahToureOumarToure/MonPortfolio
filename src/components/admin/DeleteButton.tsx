"use client";
import { LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/actions/result";
import { useAction } from "./use-action";

export default function DeleteButton({
  action,
  confirmText = "Confirmer la suppression ?",
  successText = "Supprimé.",
  compact = false,
  onDone,
}: {
  action: () => Promise<ActionResult<unknown>>;
  confirmText?: string;
  successText?: string;
  compact?: boolean;
  onDone?: () => void;
}) {
  const { pending, execute } = useAction();

  async function onClick() {
    if (!window.confirm(confirmText)) return;
    const res = await execute(action, { success: successText });
    if (res.ok) onDone?.();
  }

  return (
    <Button
      type="button"
      variant="destructive-ghost"
      size={compact ? "icon-sm" : "sm"}
      onClick={onClick}
      disabled={pending}
      title="Supprimer"
      aria-label="Supprimer"
    >
      {pending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
      {!compact && "Supprimer"}
    </Button>
  );
}
