"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "C++", type: "dev" },
  { name: "SQL", type: "dev" },
  { name: "Git", type: "dev" },
  { name: "REST APIs", type: "dev" },
  { name: "MongoDB", type: "dev" },
  { name: "Photoshop", type: "design" },
  { name: "Illustrator", type: "design" },
  { name: "Figma", type: "design" },
  { name: "After Effects", type: "design" },
  { name: "Premiere Pro", type: "design" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading & text animation
      gsap.to(".about-text", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Stats animation
      gsap.to(".stat-item", {
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 80%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex flex-col items-center overflow-hidden px-6 py-32 md:py-40 md:px-12 lg:px-20"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-20 lg:flex-row lg:items-start">

        {/* Left Content */}
        <div className="flex w-full max-w-2xl flex-col items-start text-left lg:w-1/2">
          <h2 className="about-text opacity-0 translate-y-[50px] flex flex-col items-start text-black">
            <span className="font-serif italic font-normal text-3xl md:text-5xl text-black/70 pl-2 md:pl-4 mb-[-10px] md:mb-[-20px] relative z-10">
              Who
            </span>
            <div className="flex items-end gap-2 md:gap-6">
              <span
                className="text-orange text-[6rem] md:text-[9rem] lg:text-[11rem] leading-[0.7]"
                style={{ fontFamily: "var(--font-signature), cursive" }}
              >
                I
              </span>
              <span className="font-display font-semibold uppercase tracking-tighter text-[5rem] md:text-[8rem] lg:text-[10rem] leading-[0.8]">
                Am
              </span>
            </div>
          </h2>

          <div className="about-text opacity-0 translate-y-[50px] mt-10 max-w-md space-y-6 text-base leading-relaxed text-black/70 md:text-lg">
            <p>
              I&apos;m a passionate <strong className="text-black font-bold">Graphics Designer</strong> and <strong className="text-black font-bold">CSE Graduate</strong>. I believe that great products are born at the intersection of beautiful design and clean code.
            </p>
            <p>
              With expertise in both visual communication and software development, I bring a unique perspective to every project — whether it&apos;s crafting a brand identity or building a full-stack application.
            </p>
          </div>
        </div>

        {/* Right Content - Stats */}
        <div className="stats-container flex w-full flex-col gap-6 lg:w-5/12">
          {[
            { num: "5", suffix: "+", label: "Years Experience", desc: "Crafting modern designs and writing clean code." },
            { num: "80", suffix: "+", label: "Projects Done", desc: "Delivered successfully to happy clients worldwide." },
            { num: "15", suffix: "+", label: "Awards Won", desc: "Recognized for excellence in design and development." }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="stat-item opacity-0 translate-y-[50px] group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-black/5 bg-white/40 p-8 backdrop-blur-sm transition-all duration-500 hover:border-orange/30 hover:bg-white/80 hover:shadow-2xl hover:shadow-orange/5"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange/10 blur-3xl transition-all duration-500 group-hover:bg-orange/20"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="flex items-start font-display text-6xl text-black transition-colors duration-300 group-hover:text-orange md:text-7xl">
                    {stat.num}
                    <span className="mt-1 text-3xl text-orange md:text-4xl">{stat.suffix}</span>
                  </h3>
                  <p className="mt-2 text-[11px] font-bold tracking-[0.2em] text-black/40 uppercase transition-colors duration-300 group-hover:text-black/70">
                    {stat.label}
                  </p>
                </div>
                <div className="hidden h-12 w-px bg-black/10 md:block"></div>
                <p className="hidden max-w-[180px] text-right text-sm text-black/50 md:block">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-32 w-full overflow-hidden border-y border-black/5 py-8">
        <div className="animate-marquee flex w-max items-center gap-12">
          {[...skills, ...skills, ...skills, ...skills].map((skill, i) => (
            <div key={i} className="group flex cursor-default items-center gap-12">
              <span className="font-display text-5xl font-normal tracking-wider text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.2)] transition-all duration-300 group-hover:text-black group-hover:[-webkit-text-stroke:0px] md:text-7xl">
                {skill.name}
              </span>
              <span className="h-3 w-3 rounded-full bg-orange/30 transition-all duration-300 group-hover:scale-150 group-hover:bg-orange"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
