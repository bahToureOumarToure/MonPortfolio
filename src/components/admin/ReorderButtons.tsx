"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReorderButtons({
  index,
  count,
  onMove,
  disabled,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Monter"
        title="Monter"
        disabled={disabled || index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <ArrowUp />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Descendre"
        title="Descendre"
        disabled={disabled || index === count - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <ArrowDown />
      </Button>
    </div>
  );
}
