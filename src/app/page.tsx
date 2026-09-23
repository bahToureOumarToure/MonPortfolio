import About from "./components/about/About";
import Contact from "./components/contact/index";
import Experience from "./components/experience/Experience";
import HeroSection from "./components/hero-section/HeroSection";
import Projects from "./components/projects/index";
import Skills from "./components/skills/Skills";
import SectionReveal from "./components/SectionReveal";

import "./css/card.css";
import { Analytics } from "@vercel/analytics/next";
import {
  getHero,
  getSocialLinks,
  getProfile,
  getExperiences,
  getSkillsGrouped,
  getFeaturedProjects,
  getSettings,
} from "@/lib/queries";

export default async function Home() {
  const [hero, socials, profile, experiences, grouped, featured, settings] =
    await Promise.all([
      getHero(),
      getSocialLinks(),
      getProfile(),
      getExperiences(),
      getSkillsGrouped(),
      getFeaturedProjects(3),
      getSettings(),
    ]);

  return (
    <>
      <div className="container">
        <HeroSection hero={hero} socials={socials} />

        <SectionReveal>
          <About profile={profile} />
        </SectionReveal>

        <SectionReveal>
          <Experience experiences={experiences} />
        </SectionReveal>

        <SectionReveal>
          <Skills grouped={grouped} />
        </SectionReveal>

        <SectionReveal>
          <Projects projects={featured} />
        </SectionReveal>

        <SectionReveal>
          <Contact settings={settings} socials={socials} />
        </SectionReveal>
      </div>
      <Analytics />
    </>
  );
}
