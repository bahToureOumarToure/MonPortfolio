import { requireAdmin } from "@/lib/auth/admin";
import { getAdminHero, getAdminProfile } from "@/lib/admin-queries";
import HeroForm from "@/components/admin/HeroForm";
import ProfileForm from "@/components/admin/ProfileForm";
import { PageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function ProfileAdminPage() {
  await requireAdmin();
  const hero = await getAdminHero().catch(() => null);
  const profile = await getAdminProfile().catch(() => null);

  const heroInitial = {
    tagline: hero?.tagline ?? "WELCOME TO MY UNIVERSE",
    headingTop: hero?.headingTop ?? "Crafting Digital",
    headingBottom: hero?.headingBottom ?? "Masterpieces",
    name: hero?.name ?? "< Bah Oumar Touré />",
    designation: hero?.designation ?? "",
    alternateWords: (hero?.alternateWords ?? []).join(", "),
    subheading: hero?.subheading ?? "",
    ctaPrimaryLabel: hero?.ctaPrimaryLabel ?? "Let's Collaborate",
    ctaPrimaryHref: hero?.ctaPrimaryHref ?? "/#contact",
    ctaResumeLabel: hero?.ctaResumeLabel ?? "Get Resume",
    heroImage: hero?.heroImage?.url ?? "",
    translations: hero?.translations ?? null,
  };

  const profileInitial = {
    aboutTitle: profile?.aboutTitle ?? "About",
    aboutHighlight: profile?.aboutHighlight ?? "The Software Engineer",
    description: profile?.description ?? "",
    image: profile?.image?.url ?? "",
    translations: profile?.translations ?? null,
  };

  return (
    <>
      <PageHeader
        title="Profil & Hero"
        description="Section d'accueil et présentation « À propos »."
      />
      <Panel title="Section d'accueil (hero)">
        <HeroForm initial={heroInitial} />
      </Panel>
      <Panel title="À propos">
        <ProfileForm initial={profileInitial} />
      </Panel>
    </>
  );
}
