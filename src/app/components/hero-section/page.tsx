"use client";
import { personalData } from "@/../utils/Data/PersonalData";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import Link from "next/link";
import { useRef } from "react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";
import Tilt from "react-parallax-tilt";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const designationRef = useRef<HTMLElement>(null);
  const codeCardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText);

      const titles = personalData.designationAlternateWords;
      let index = 0;

      // Initial Intro Animation
      const introTl = gsap.timeline();
      introTl
        .fromTo(
          ".hero-tag",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        )
        .fromTo(
          ".hero-heading",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1, ease: "power4.out" },
          "-=0.5",
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" },
          "-=0.6",
        )
        .fromTo(
          codeCardRef.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 1.2, ease: "power4.out" },
          "-=1",
        );

      // Designation Rotation Animation
      const runDesignationAnimation = () => {
        const el = designationRef.current;
        if (!el) return;

        const tl = gsap.timeline({
          onComplete: () => {
            index = (index + 1) % titles.length;
            runDesignationAnimation();
          },
        });

        el.textContent = titles[index];
        const split = new SplitText(el, { type: "chars" });

        tl.from(split.chars, {
          opacity: 0,
          y: 10,
          rotateX: -90,
          stagger: 0.04,
          duration: 0.6,
          ease: "back.out(1.7)",
        }).to(split.chars, {
          opacity: 0,
          y: -10,
          rotateX: 90,
          stagger: 0.02,
          duration: 0.5,
          ease: "back.in(1.7)",
          delay: 2,
          onComplete: () => split.revert(),
        });
      };

      runDesignationAnimation();

      // Floating animation for social icons
      gsap.to(".social-icon", {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center py-12 lg:py-24 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-900/10 blur-[150px] rounded-full animate-pulse delay-700" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center px-4 md:px-8 relative z-10 w-full max-w-7xl mx-auto">
        {/* Left Side: Content */}
        <div className="order-2 lg:order-1 flex flex-col items-start gap-8">
          <div className="flex flex-col gap-4">
            <span className="hero-tag px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-[0.3em] w-fit">
              WELCOME TO MY UNIVERSE
            </span>
            <h1 className="hero-heading text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1]">
              Crafting{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                Digital
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-950">
                Masterpieces
              </span>
            </h1>
            <p className="hero-heading text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed font-medium">
              I'm{" "}
              <span className="text-white font-bold">{personalData.name}</span>,
              Software
              <span
                className="text-red-500 ml-2 font-bold inline-block min-w-[200px]"
                ref={designationRef}
              >
                {personalData.designation}
              </span>
              <br />
              dedicated to building high-performance, user-focused digital
              products{" "}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Link
                href={personalData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:text-red-500 hover:border-red-500/50 transition-all duration-300 shadow-xl"
              >
                <BsGithub size={24} />
              </Link>
              <Link
                href={personalData.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:text-red-500 hover:border-red-500/50 transition-all duration-300 shadow-xl"
              >
                <BsLinkedin size={24} />
              </Link>
              <Link
                href={personalData.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:text-red-500 hover:border-red-500/50 transition-all duration-300 shadow-xl"
              >
                <SiLeetcode size={24} />
              </Link>
              <Link
                href={personalData.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:text-red-500 hover:border-red-500/50 transition-all duration-300 shadow-xl"
              >
                <FaTwitterSquare size={24} />
              </Link>
            </div>

            <div className="hero-cta flex flex-wrap gap-4">
              <Link
                href="/#contact"
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-900 text-white font-bold uppercase tracking-wider overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">
                  Let's Collaborate <RiContactsFill />
                </span>
              </Link>

              <Link
                href={personalData.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-bold uppercase tracking-wider transition-all hover:bg-white/10 hover:border-red-500/50 flex items-center gap-2"
              >
                Get Resume{" "}
                <MdDownload className="group-hover:translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Animated Code Card */}
        <div className="order-1 lg:order-2 flex justify-center">
          <Tilt
            perspective={1000}
            glareEnable={true}
            glareMaxOpacity={0.1}
            scale={1.02}
            className="w-full max-w-[600px]"
          >
            <div
              ref={codeCardRef}
              className="relative rounded-3xl border border-white/10 bg-[#050505]/80 backdrop-blur-xl overflow-hidden shadow-2xl group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-red-300/20" />
                </div>
                <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Engineer.profile.IT
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto">
                <code className="font-mono text-xs md:text-sm leading-relaxed block min-w-[280px]">
                  {/* 01 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">01</span>
                    <span>
                      <span className="text-red-500">const</span>{" "}
                      <span className="text-white">Engineer</span>{" "}
                      <span className="text-slate-400">=</span> {"{"}
                    </span>
                  </span>

                  {/* 02 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">02</span>
                    <span className="ml-4">
                      <span className="text-slate-300">name</span>
                      <span className="text-slate-400">:</span>{" "}
                      <span className="text-red-300">'Bah Omar Touré'</span>,
                    </span>
                  </span>

                  {/* 03 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">03</span>
                    <span className="ml-4">
                      <span className="text-slate-300">role</span>
                      <span className="text-slate-400">:</span>{" "}
                      <span className="text-red-300">
                        'Junior Software Engineer'
                      </span>
                      ,
                    </span>
                  </span>
                  <span className="flex gap-8">
                    <span className="text-slate-600 italic shrink-0">04</span>
                    <span>
                      <span className="text-slate-300"> status</span>
                      <span className="text-slate-400">:</span>{" "}
                      <span className="text-red-300">"Open to Work",</span>
                    </span>
                  </span>

                  {/* 05 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">05</span>
                    <span className="ml-4">
                      <span className="text-slate-300">expertise</span>
                      <span className="text-slate-400">:</span> {"{"}
                    </span>
                  </span>

                  {/* 06 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">06</span>
                    <span className="ml-5">
                      <span className="text-slate-300">fullstack</span>
                      <span className="text-slate-400">:</span> [
                      <span className="text-red-300">'Spring Boot'</span>,{" "}
                      <span className="text-red-300">'.NET'</span>,{" "}
                      <span className="text-red-300">'React'</span>,{" "}
                      <span className="text-red-300">'Flutter'</span>],
                    </span>
                  </span>

                  {/* 07 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">07</span>
                    <span className="ml-8">
                      <span className="text-slate-300">ai</span>
                      <span className="text-slate-400">:</span> [
                      <span className="text-red-300">'ML'</span>,{" "}
                      <span className="text-red-300">'Deep Learning'</span>,{" "}
                      <span className="text-red-300">'RL'</span>,'ACP','AFC',],
                    </span>
                  </span>

                  {/* 08 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">08</span>
                    <span className="ml-8">
                      <span className="text-slate-300">design</span>
                      <span className="text-slate-400">:</span> [
                      <span className="text-red-300">'UI/UX'</span>,{" "}
                      <span className="text-red-300">'Branding Art'</span>],
                    </span>
                  </span>

                  {/* 09 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">09</span>
                    <span className="ml-4">{"},"}</span>
                  </span>
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">10</span>
                    <span className="ml-4">
                      <span className="text-slate-200">workMode:</span> [
                      <span className="text-red-300">
                        'Local (Berkane/Oujda)'
                      </span>
                      , <span className="text-red-300">'Remote'</span>],
                    </span>
                  </span>

                  {/* 11 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">11</span>
                    <span className="ml-4">
                      <span className="text-slate-200">softSkills</span>
                      <span className="text-slate-400">:</span> [
                      <span className="text-red-300">'Agile'</span>,{" "}
                      <span className="text-red-300">'Creative'</span>,{" "}
                      <span className="text-red-300">'Curious'</span>],
                    </span>
                  </span>

                  {/* 12 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">12</span>
                    <span className="ml-4">
                      <span className="text-slate-300">passionate</span>
                      <span className="text-slate-400">:</span>{" "}
                      <span className="text-red-600">true</span>,
                    </span>
                  </span>

                  {/* 13 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">13</span>
                    <span className="ml-4">
                      <span className="text-slate-300">motto</span>
                      <span className="text-slate-400">:</span>{" "}
                      <span className="text-red-300">
                        "Agile by nature, building with purpose."
                      </span>
                    </span>
                  </span>

                  {/* 14 */}
                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">14</span>
                    <span>{"};"}</span>
                  </span>

                  {/* 15 */}
                  <span className="flex gap-4 mt-6">
                    <span className="text-slate-600 italic shrink-0">15</span>
                    <span>
                      <span className="text-red-500">public async</span>{" "}
                      <span className="text-teal-400">Task</span>
                      <span className="text-slate-400">&lt;</span>
                      <span className="text-teal-400">Impact</span>
                      <span className="text-slate-400">&gt;</span>{" "}
                      <span className="text-blue-300">EngineerItAsync</span>()
                    </span>
                  </span>

                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">16</span>
                    <span>{"{"}</span>
                  </span>

                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">17</span>
                    <span className="ml-4">
                      <span className="text-red-500">await</span>{" "}
                      <span className="text-white">developer</span>.
                      <span className="text-blue-300">
                        StartAgileSprintAsync
                      </span>
                      ();
                    </span>
                  </span>

                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">18</span>
                    <span className="ml-4">
                      <span className="text-red-500">await</span>{" "}
                      <span className="text-teal-400">Engineer</span>.
                      <span className="text-blue-300">Design</span>().
                      <span className="text-blue-300">Code</span>().
                      <span className="text-blue-300">IntegrateAI</span>();
                    </span>
                  </span>

                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">19</span>
                    <span className="ml-4">
                      <span className="text-red-500">await</span>{" "}
                      <span className="text-white">developer</span>.
                      <span className="text-blue-300">DeployImpactAsync</span>
                      ();
                    </span>
                  </span>

                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">20</span>
                    <span className="ml-4">&nbsp;</span>
                  </span>

                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">21</span>
                    <span className="ml-4">
                      <span className="text-red-500">return</span>{" "}
                      <span className="text-teal-400">Impact</span>.
                      <span className="text-white">Delivered</span>;
                    </span>
                  </span>

                  <span className="flex gap-4">
                    <span className="text-slate-600 italic shrink-0">22</span>
                    <span>{"}"}</span>
                  </span>
                </code>
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
