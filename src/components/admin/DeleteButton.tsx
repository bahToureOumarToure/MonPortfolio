"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, LoaderCircle } from "lucide-react";

export default function DeleteButton({
  action,
  confirmText = "Confirmer la suppression ?",
  compact = false,
}: {
  action: () => Promise<void>;
  confirmText?: string;
  compact?: boolean;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  function onClick() {
    if (!window.confirm(confirmText)) return;
    start(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      title="Supprimer"
      className={`inline-flex items-center gap-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50 ${
        compact ? "p-2" : "px-3 py-2 text-sm font-medium"
      }`}
    >
      {pending ? (
        <LoaderCircle className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      {!compact && "Supprimer"}
    </button>
  );
}
