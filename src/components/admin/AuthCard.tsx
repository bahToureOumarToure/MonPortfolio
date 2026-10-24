import { Logo } from "@/components/site/logo";

/** Carte centrée des écrans de connexion / configuration admin. */
export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm sm:p-10">
        <div className="mb-8 flex flex-col gap-4">
          <Logo className="h-10 w-6" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
