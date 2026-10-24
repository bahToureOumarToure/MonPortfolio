import { cn } from "@/lib/utils";
import { iconColor } from "@/lib/color";
import type { SocialVM } from "@/lib/content-types";
import { getSocialIcon } from "@/../utils/social-icons";

/** Rangée d'icônes sociales ; la couleur de marque apparaît au survol. */
export function SocialLinks({
  socials,
  className,
  size = "md",
}: {
  socials: SocialVM[];
  className?: string;
  size?: "sm" | "md";
}) {
  if (socials.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {socials.map((social) => {
        const Icon = getSocialIcon(social.iconKey);
        const color = iconColor(social.color);
        return (
          <li key={`${social.platform}-${social.url}`}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
              title={social.platform}
              style={
                color
                  ? ({ "--brand-icon": color } as React.CSSProperties)
                  : undefined
              }
              className={cn(
                "inline-flex items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-foreground/20 hover:text-[var(--brand-icon,hsl(var(--foreground)))]",
                size === "sm" ? "h-9 w-9" : "h-10 w-10",
              )}
            >
              <Icon
                className={size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]"}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
