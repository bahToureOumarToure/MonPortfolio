import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import type { HeroVM, SocialVM } from "@/lib/content-types";
import { isOptimizableImageUrl } from "@/lib/media-format";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CodeCard } from "./code-card";
import { RotatingWords } from "./rotating-words";
import { SocialLinks } from "./social-links";

export default function Hero({
  hero,
  socials,
}: {
  hero: HeroVM;
  socials: SocialVM[];
}) {
  const words =
    hero.alternateWords.length > 0 ? hero.alternateWords : [hero.designation];

  return (
    <section className="relative overflow-hidden">
      {/* Trame de points discrète, estompée vers les bords */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />
      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-28">
        <div className="flex min-w-0 animate-fade-up flex-col gap-7">
          {hero.tagline && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {hero.tagline}
            </span>
          )}

          <div className="flex flex-col gap-5">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {hero.headingTop}{" "}
              {hero.headingBottom && (
                <span className="text-primary">{hero.headingBottom}</span>
              )}
            </h1>
            <p className="text-lg text-foreground sm:text-xl">
              <span className="font-mono font-medium">{hero.name}</span>
              <span className="text-muted-foreground"> — Software </span>
              <RotatingWords
                words={words}
                className="font-medium text-primary"
              />
            </p>
            {hero.subheading && (
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {hero.subheading}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={hero.ctaPrimaryHref}>
                {hero.ctaPrimaryLabel}
                <ArrowRight />
              </Link>
            </Button>
            {hero.resumeUrl && (
              <Button asChild size="lg" variant="outline">
                <a
                  href={hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download />
                  {hero.ctaResumeLabel}
                </a>
              </Button>
            )}
          </div>

          <SocialLinks socials={socials} />
        </div>

        <div className="min-w-0 animate-fade-up [animation-delay:150ms]">
          {hero.heroImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted shadow-xl shadow-foreground/[0.04]">
              <Image
                src={hero.heroImage}
                alt=""
                fill
                priority
                unoptimized={!isOptimizableImageUrl(hero.heroImage)}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <CodeCard />
          )}
        </div>
      </Container>
    </section>
  );
}
