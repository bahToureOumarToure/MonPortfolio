import { requireAdmin } from "@/lib/auth/admin";
import { getAdminHero, getAdminProfile } from "@/lib/admin-queries";
import HeroForm from "@/components/admin/HeroForm";
import ProfileForm from "@/components/admin/ProfileForm";

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
  };

  const profileInitial = {
    aboutTitle: profile?.aboutTitle ?? "About",
    aboutHighlight: profile?.aboutHighlight ?? "The Software Engineer",
    description: profile?.description ?? "",
    image: profile?.image?.url ?? "",
  };

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Profil / Hero</h1>
        <p className="text-slate-400 mt-1">
          Section d'accueil et présentation « About ».
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-lg font-bold mb-5">Section Hero</h2>
        <HeroForm initial={heroInitial} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-lg font-bold mb-5">Section About</h2>
        <ProfileForm initial={profileInitial} />
      </section>
    </div>
  );
}
