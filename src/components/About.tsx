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
  const marqueeRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    let visible = false;
    const update = () => {
      marquee.style.animationPlayState = visible && !document.hidden ? "running" : "paused";
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(marquee);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" }, (context) => {
        if (!context.conditions?.motion) return;
        const story = storyRef.current;
        const stage = stageRef.current;
        if (!story || !stage) return;
        // Pin both columns together on desktop so the cards stay beside the story.
        const target = context.conditions.desktop ? stage : story;
        const cards = gsap.utils.toArray<HTMLElement>(".stat-item", stage);

        const storyTimeline = gsap.timeline({
          scrollTrigger: {
            id: "about-story",
            trigger: target,
            // Keep the complete story visible, including on short screens.
            start: () => {
              const navBottom = document.getElementById("main-nav")?.getBoundingClientRect().bottom ?? 60;
              return `top ${Math.max(navBottom + 24, (window.innerHeight - target.offsetHeight) / 2)}px`;
            },
            end: () => `+=${Math.round(window.innerHeight * 2.2)}`,
            pin: target.offsetHeight + 100 < window.innerHeight,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        storyTimeline
          .from(".about-who", { y: -110, autoAlpha: 0, duration: 1.4, ease: "power2.out" }, 0)
          .from(".about-i", { y: 180, rotation: -12, autoAlpha: 0, duration: 1.7, ease: "power2.out" }, 0.2)
          .from(".about-am", { x: 190, autoAlpha: 0, duration: 1.7, ease: "power2.out" }, 0.45)
          .from(".about-paragraph-first", { y: 45, autoAlpha: 0, duration: 1 }, 2.3)
          .from(".about-paragraph-second", { y: 45, autoAlpha: 0, duration: 1 }, 3.7)
          .addLabel("paragraphs-ready", 4.7);

        if (context.conditions.desktop) {
          cards.forEach((card, index) => {
            storyTimeline.from(card, {
              y: 85, autoAlpha: 0, scale: 0.94,
              duration: 0.9, ease: "power2.out",
            }, 2.3 + index * 1.15);
          });
        } else {
          cards.forEach((card) => {
            gsap.from(card, {
              y: 75, autoAlpha: 0, scale: 0.95, ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 92%", end: "top 62%", scrub: 0.7 },
            });
          });
        }
        storyTimeline.addLabel("content-ready");
        storyTimeline.to({}, { duration: 0.65 });
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
      <div id="about-stage" ref={stageRef} className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-20 lg:flex-row lg:items-start">

        {/* Left Content */}
        <div className="flex w-full max-w-2xl flex-col items-start text-left lg:w-1/2">
          <div ref={storyRef} className="w-full">
          <h2 className="flex flex-col items-start text-black">
            <span className="about-who font-serif italic font-normal text-3xl md:text-5xl text-black/70 pl-2 md:pl-4 mb-[-10px] md:mb-[-20px] relative z-10">
              Who
            </span>
            <span className="flex items-end gap-2 md:gap-6">
              <span
                className="about-i inline-block text-orange text-[6rem] md:text-[9rem] lg:text-[11rem] leading-[0.7]"
                style={{ fontFamily: "var(--font-signature), cursive" }}
              >
                I
              </span>
              <span className="about-am inline-block font-display font-semibold uppercase tracking-tighter text-[5rem] md:text-[8rem] lg:text-[10rem] leading-[0.8]">
                Am
              </span>
            </span>
          </h2>

          <div className="mt-10 max-w-md space-y-6 text-base leading-relaxed text-black/70 md:text-lg">
            <p className="about-paragraph-first">
              I&apos;m a passionate <strong className="text-black font-bold">Graphics Designer</strong> and <strong className="text-black font-bold">Computer Science Graduate</strong>. I believe that great products are born at the intersection of beautiful design and clean code.
            </p>
            <p className="about-paragraph-second">
              With expertise in both visual communication and software development, I bring a unique perspective to every project — whether it&apos;s crafting a brand identity or building a full-stack application.
            </p>
          </div>
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
              className="stat-item group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-black/5 bg-white/40 p-8 backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-500 hover:border-orange/30 hover:bg-white/80 hover:shadow-2xl hover:shadow-orange/5"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange/10 blur-3xl transition-all duration-500 group-hover:bg-orange/20"></div>

              <div className="relative grid items-center gap-5 md:grid-cols-[minmax(0,.9fr)_minmax(0,1fr)] md:gap-6">
                <div className="flex min-w-0 flex-col items-center text-center">
                  <h3 className="flex items-start gap-1 font-display text-[64px] font-semibold leading-none tracking-[-0.065em] text-black transition-colors duration-300 group-hover:text-orange md:text-[72px]">
                    {stat.num}
                    <span className="mt-2 font-sans text-[26px] font-medium leading-none tracking-normal text-orange">{stat.suffix}</span>
                  </h3>
                  <p className="mt-3 font-sans text-[15px] font-medium leading-snug tracking-[-0.02em] text-black/70 transition-colors duration-300 group-hover:text-black">
                    {stat.label}
                  </p>
                </div>
                <p className="hidden border-l border-black/10 py-1 pl-6 text-left text-[13px] font-normal leading-[1.65] tracking-[-0.01em] text-black/55 md:block">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-32 w-full overflow-hidden border-y border-black/5 py-8">
        <div ref={marqueeRef} className="animate-marquee flex w-max items-center gap-12">
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
