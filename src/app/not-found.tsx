import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-mono text-sm font-medium text-primary">Erreur 404</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Page introuvable
      </h1>
      <p className="max-w-md text-muted-foreground">
        La page que tu cherches n&apos;existe pas ou a été déplacée.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">Voir les projets</Link>
        </Button>
      </div>
    </main>
  );
}
