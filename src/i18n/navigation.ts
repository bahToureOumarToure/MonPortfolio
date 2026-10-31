import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Liens et navigation qui gardent la langue courante.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
