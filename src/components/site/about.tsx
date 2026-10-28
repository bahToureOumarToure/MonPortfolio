import Image from "next/image";
import { Briefcase, Mail, MapPin } from "lucide-react";
import type { ProfileVM, SettingsVM } from "@/lib/content-types";
import { isOptimizableImageUrl } from "@/lib/media-format";
import { Reveal } from "./reveal";
import { Section, SectionHeader } from "./section";

export default function About({
  profile,
  settings,
}: {
  profile: ProfileVM;
  settings: SettingsVM;
}) {
  const paragraphs = profile.description
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const facts = [
    settings.address && {
      icon: MapPin,
      label: "Localisation",
      value: settings.address,
    },
    { icon: Briefcase, label: "Statut", value: "Ouvert aux opportunités" },
    settings.contactEmail && {
      icon: Mail,
      label: "Email",
      value: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
    },
  ].filter(Boolean) as {
    icon: typeof MapPin;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <Section id="about" muted>
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border bg-muted shadow-lg shadow-foreground/[0.04]">
            <Image
              src={profile.image}
              alt={`Portrait de ${profile.name.replace(/[<>/]/g, "").trim()}`}
              fill
              unoptimized={!isOptimizableImageUrl(profile.image)}
              sizes="(min-width: 1024px) 400px, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div>
          <SectionHeader
            eyebrow="À propos"
            title={
              <>
                {profile.aboutTitle}{" "}
                <span className="text-primary">{profile.aboutHighlight}</span>
              </>
            }
          />
          <Reveal className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>

          <Reveal className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {facts.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      title={label}
                      className="inline-flex items-center gap-2 rounded-full border bg-background px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-foreground/20"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      {value}
                    </a>
                  ) : (
                    <span
                      title={label}
                      className="inline-flex items-center gap-2 rounded-full border bg-background px-3.5 py-1.5 text-sm text-foreground"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      {value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
