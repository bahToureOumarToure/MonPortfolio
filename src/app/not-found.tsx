import Link from "next/link";
import RootDocument from "@/components/root-document";
import { Button } from "@/components/ui/button";

// 404 hors des pages du site (ex. /admin/inconnu, fichier introuvable).
export default function NotFound() {
  return (
    <RootDocument lang="en">
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="font-mono text-sm font-medium text-primary">Error 404</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </main>
    </RootDocument>
  );
}
