import Hero from "@/components/site/hero";
import About from "@/components/site/about";
import Journey from "@/components/site/journey";
import Skills from "@/components/site/skills";
import ProjectsSection from "@/components/site/projects-section";
import Contact from "@/components/site/contact";
import {
  getHero,
  getSocialLinks,
  getProfile,
  getExperiences,
  getEducations,
  getSkillsGrouped,
  getFeaturedProjects,
  getSettings,
} from "@/lib/queries";

export default async function Home() {
  const [
    hero,
    socials,
    profile,
    experiences,
    educations,
    grouped,
    featured,
    settings,
  ] = await Promise.all([
    getHero(),
    getSocialLinks(),
    getProfile(),
    getExperiences(),
    getEducations(),
    getSkillsGrouped(),
    getFeaturedProjects(3),
    getSettings(),
  ]);

  return (
    <>
      <Hero hero={hero} socials={socials} />
      <About profile={profile} settings={settings} />
      <Journey experiences={experiences} educations={educations} />
      <Skills grouped={grouped} />
      <ProjectsSection projects={featured} />
      <Contact settings={settings} socials={socials} />
    </>
  );
}
