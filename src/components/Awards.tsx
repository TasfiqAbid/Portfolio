"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { awards } from "@/lib/projects";

function LaurelBranch({ className, flipped }: { className?: string; flipped?: boolean }) {
  return (
    <svg
      viewBox="-10 -40 120 280"
      fill="currentColor"
      className={className}
      style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
    >
      <path d="M80,230 C20,180 10,80 50,10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M72,205 C50,200 40,180 35,160 C50,170 65,185 72,205 Z" />
      <path d="M57,170 C35,165 20,145 15,120 C35,130 50,150 57,170 Z" />
      <path d="M43,130 C25,120 10,100 5,75 C25,85 40,110 43,130 Z" />
      <path d="M35,90 C15,80 5,60 0,35 C20,45 35,70 35,90 Z" />
      <path d="M38,50 C20,40 10,20 10,0 C30,10 40,30 38,50 Z" />
      <path d="M72,205 C90,180 100,155 95,130 C85,150 75,175 72,205 Z" />
      <path d="M57,170 C80,145 90,120 85,90 C70,110 60,140 57,170 Z" />
      <path d="M43,130 C70,105 80,80 75,50 C60,70 45,100 43,130 Z" />
      <path d="M35,90 C60,65 70,40 65,15 C50,35 40,65 35,90 Z" />
      <path d="M50,10 C45,-10 55,-25 65,-30 C65,-15 60,0 50,10 Z" />
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger);

export default function Awards() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImg(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".awards-heading", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(".award-row", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="awards"
      ref={sectionRef}
      className="relative min-h-screen px-6 pt-16 pb-32 md:px-12 md:pt-20 lg:px-20"
    >
      {/* Ambient Glowing Orbs Background (GPU accelerated to eliminate scroll lag) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden transform-gpu"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          transform: "translateZ(0)",
          willChange: "transform"
        }}
      >
        {/* Top-Left: Angled, elongated glow */}
        <div className="absolute -left-[10%] -top-[20%] h-[800px] w-[400px] rotate-[45deg] rounded-full bg-orange/30 blur-[100px] transform-gpu" />
        {/* Bottom-Left: Wide, flattened glow */}
        <div className="absolute -bottom-[15%] -left-[5%] h-[300px] w-[500px] rotate-[-15deg] rounded-full bg-orange/20 blur-[90px] transform-gpu" />
        {/* Top-Right: Huge, soft wash */}
        <div className="absolute -right-[15%] -top-[15%] h-[700px] w-[600px] rotate-[-30deg] rounded-full bg-orange/20 blur-[100px] transform-gpu" />
        {/* Bottom-Right: Dimmer, round glow */}
        <div className="absolute -bottom-[10%] -right-[5%] h-[400px] w-[400px] rounded-full bg-orange/15 blur-[90px] transform-gpu" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="awards-heading opacity-0 translate-y-[60px] mb-16 flex flex-col items-center justify-center relative">
          <div className="relative flex items-center gap-4 md:gap-8">
            <LaurelBranch className="h-16 w-auto text-[#f2b366] md:h-24 relative z-10" />
            <h2 className="text-5xl font-display font-semibold tracking-tighter text-white capitalize md:text-7xl lg:text-8xl relative z-10">
              <span className="font-serif italic font-normal text-white/90 pr-2">My</span>
              Awards
            </h2>
            <LaurelBranch className="h-16 w-auto text-[#f2b366] md:h-24 relative z-10" flipped />
          </div>
        </div>

        {/* Award rows */}
        <div className="divide-y divide-white/10 border-t border-white/10">
          {awards.map((award, index) => (
            <div key={award.id} className="award-row opacity-0 translate-y-[50px] group py-8 md:py-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Left: index + title + meta */}
                <div className="flex items-start gap-6">
                  <span className="mt-1 min-w-[2rem] text-sm font-medium text-white/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-orange md:text-2xl">
                      {award.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-sm text-white/40">
                      <span>{award.year}</span>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <span>{award.category}</span>
                    </div>
                  </div>
                </div>

                {/* Right: two image placeholders */}
                <div className="flex shrink-0 items-center gap-3 md:gap-4">
                  {/* Certificate placeholder */}
                  <div
                    className="group/img relative flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-sm border border-white/10 bg-white/5 transition-all duration-300 hover:border-orange/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,166,35,0.2)] md:h-24 md:w-32"
                    onClick={() => award.images[0] && setSelectedImg(award.images[0])}
                  >
                    {award.images[0] && (
                      <img src={award.images[0]} alt="Certificate" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                    )}
                  </div>

                  {/* Crest / Trophy placeholder */}
                  <div
                    className="group/img relative flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-sm border border-white/10 bg-white/5 transition-all duration-300 hover:border-orange/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,166,35,0.2)] md:h-24 md:w-32"
                    onClick={() => award.images[1] && setSelectedImg(award.images[1])}
                  >
                    {award.images[1] && (
                      <img src={award.images[1]} alt="Award" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] rounded-xl bg-white/5 p-2 border border-white/10 shadow-[0_0_40px_rgba(245,166,35,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-14 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-orange hover:text-white"
              onClick={() => setSelectedImg(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <img
              src={selectedImg}
              alt="Enlarged Award"
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
