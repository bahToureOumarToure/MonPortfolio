import Link from "next/link";
import type { SettingsVM, SocialVM } from "@/lib/content-types";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { NAV_ITEMS } from "./nav-items";
import { SocialLinks } from "./social-links";

export default function Footer({
  settings,
  socials,
  siteName,
}: {
  settings: SettingsVM;
  socials: SocialVM[];
  siteName: string;
}) {
  return (
    <footer className="border-t bg-muted/40">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex w-fit items-center gap-2.5 font-semibold"
          >
            <Logo />
            {siteName}
          </Link>
          {settings.footerTagline && (
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings.footerTagline}
            </p>
          )}
        </div>

        <nav aria-label="Pied de page">
          <h2 className="mb-4 text-sm font-semibold">Navigation</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/projects"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Tous les projets
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Contact</h2>
          <div className="flex flex-col gap-2.5 text-sm">
            {settings.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="w-fit text-muted-foreground transition-colors hover:text-foreground"
              >
                {settings.contactEmail}
              </a>
            )}
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="w-fit text-muted-foreground transition-colors hover:text-foreground"
              >
                {settings.phone}
              </a>
            )}
          </div>
          <SocialLinks socials={socials} size="sm" />
        </div>
      </Container>

      <div className="border-t">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteName}. Tous droits réservés.
          </p>
          {settings.address && <p>{settings.address}</p>}
        </Container>
      </div>
    </footer>
  );
}
