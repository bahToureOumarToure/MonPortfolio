import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SettingsVM, SocialVM } from "@/lib/content-types";
import ContactForm from "./contact-form";
import { Reveal } from "./reveal";
import { Section, SectionHeader } from "./section";
import { SocialLinks } from "./social-links";

export default function Contact({
  settings,
  socials,
}: {
  settings: SettingsVM;
  socials: SocialVM[];
}) {
  const t = useTranslations("Contact");
  const items = [
    settings.contactEmail && {
      icon: Mail,
      label: t("email"),
      value: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
    },
    settings.phone && {
      icon: Phone,
      label: t("phone"),
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s+/g, "")}`,
    },
    settings.address && {
      icon: MapPin,
      label: t("location"),
      value: settings.address,
    },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <Section id="contact" muted>
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
        <Reveal className="flex flex-col gap-3">
          {items.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">
                    {label}
                  </span>
                  <span
                    dir="auto"
                    className="block truncate text-sm font-medium text-foreground"
                  >
                    {value}
                  </span>
                </span>
              </>
            );
            const cls =
              "flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-colors";
            return href ? (
              <a
                key={label}
                href={href}
                className={`${cls} hover:border-foreground/20`}
              >
                {content}
              </a>
            ) : (
              <div key={label} className={cls}>
                {content}
              </div>
            );
          })}
          {socials.length > 0 && (
            <div className="mt-4">
              <p className="mb-3 text-sm font-medium text-foreground">
                {t("socials")}
              </p>
              <SocialLinks socials={socials} />
            </div>
          )}
        </Reveal>
        <Reveal>
          <ContactForm fallbackEmail={settings.contactEmail} />
        </Reveal>
      </div>
    </Section>
  );
}
