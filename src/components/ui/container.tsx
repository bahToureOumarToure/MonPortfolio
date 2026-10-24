import * as React from "react";

import { cn } from "@/lib/utils";

/** Largeur de lecture commune à toutes les sections publiques. */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}
