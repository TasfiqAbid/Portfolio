"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkCarousel from "@/components/WorkCarousel";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Refresh global scroll triggers after the DOM updates its height
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative h-screen min-h-[750px] w-full flex items-center justify-center overflow-hidden"
    >
      {/* Ambient Glowing Orbs Background (GPU accelerated) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden transform-gpu"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          transform: "translateZ(0)",
          willChange: "transform"
        }}
      >
        <div className="absolute -left-[10%] -top-[20%] h-[800px] w-[400px] rotate-[45deg] rounded-full bg-orange/30 blur-[100px] transform-gpu" />
        <div className="absolute -bottom-[15%] -left-[5%] h-[300px] w-[500px] rotate-[-15deg] rounded-full bg-orange/20 blur-[90px] transform-gpu" />
        <div className="absolute -right-[15%] -top-[15%] h-[700px] w-[600px] rotate-[-30deg] rounded-full bg-orange/20 blur-[100px] transform-gpu" />
        <div className="absolute -bottom-[10%] -right-[5%] h-[400px] w-[400px] rounded-full bg-orange/15 blur-[90px] transform-gpu" />
      </div>

      <div className="relative z-10 w-full max-w-[100vw]">
        <WorkCarousel />
      </div>
    </section>
  );
}
