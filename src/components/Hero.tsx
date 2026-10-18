"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero3DObject from "./Hero3DObject";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/TasfiqAbid",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.395-.135-.345-.72-1.395-1.23-1.665-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/tasfiq-abid",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/tasfiqabid/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/tasfiq_abid",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const [sceneMounted, setSceneMounted] = useState(false);

  useEffect(() => {
    // Context creation/texture upload can stall the GPU too. Mount only after
    // the compositor has finished the moving fill, underneath the filled logo.
    const mountScene = () => setSceneMounted(true);
    window.addEventListener("portfolio:intro-filled", mountScene);
    if (document.documentElement.dataset.introFilled === "true") mountScene();
    return () => window.removeEventListener("portfolio:intro-filled", mountScene);
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    let handleMouseMove: (e: MouseEvent) => void;
    let pointerFrame: number | null = null;

    const ctx = gsap.context(() => {
      // Set initial state completely off-screen to the right with force3D
      gsap.set(contentRef.current, { x: "100vw", opacity: 0, force3D: true });

      // Create scroll-driven timeline with smooth scrub damping and end-buffer
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=280%", // Ample runway for silky smooth pace
          scrub: 0.35,
          pin: true,     // Pin the section
          refreshPriority: 1,
        },
      });

      // Phase 1: Enter from completely off-screen right at a graceful, seamless pace
      // Opacity fades in cleanly in the first 1.2s so text is crisp and solid as it approaches center
      tl.to(contentRef.current, {
        opacity: 1,
        duration: 1.2,
        ease: "power1.out",
      }, 0)
      .to(contentRef.current, {
        x: 0,
        duration: 3.0,
        ease: "sine.inOut", // Gentle zero-jerk start, steady glide, gentle settling into center
      }, 0)
      // Phase 2: Hold position in center for comfortable reading
      .to(contentRef.current, {
        duration: 2.0,
      })
      // Phase 3: Exit upwards smoothly
      .to(contentRef.current, {
        y: "-45vh",
        opacity: 0,
        duration: 1.6,
        ease: "power1.in",
      })
      // Phase 4: Buffer so scrub: 1.0 completely settles before unpinning
      .to({}, { duration: 0.6 });

      if (scrollLineRef.current) {
        gsap.fromTo(
          scrollLineRef.current,
          { yPercent: -100 },
          {
            yPercent: 100,
            duration: 1.5,
            repeat: -1,
            ease: "circ.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          }
        );
      }

      if (cursorGlowRef.current) {
        gsap.set(cursorGlowRef.current, {
          x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
          y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
        });

        const xTo = gsap.quickTo(cursorGlowRef.current, "x", { duration: 0.35, ease: "power3" });
        const yTo = gsap.quickTo(cursorGlowRef.current, "y", { duration: 0.35, ease: "power3" });
        let pointerX = 0;
        let pointerY = 0;

        handleMouseMove = (e: MouseEvent) => {
          // The hero is pinned to the viewport. Read pointer coordinates only;
          // measuring its animated layout on each input forces style resolution.
          if (window.scrollY > window.innerHeight * 2.8) return;
          pointerX = e.clientX;
          pointerY = e.clientY;
          if (pointerFrame !== null) return;
          pointerFrame = requestAnimationFrame(() => {
            pointerFrame = null;
            xTo(pointerX);
            yTo(pointerY);
          });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
      }
    });

    return () => {
      if (handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      if (pointerFrame !== null) cancelAnimationFrame(pointerFrame);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-20"
    >
      {/* Background Interactive Elements */}
      <div className="pointer-events-none absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,black_78%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_78%,transparent_98%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] bg-center" />

        <div
          ref={cursorGlowRef}
          className="hero-cursor-glow absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        />

      </div>
      {sceneMounted && <Hero3DObject />}

      <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center opacity-0 translate-x-[100vw] will-change-transform will-change-opacity transform-gpu">
        <p className="mb-4 text-xs font-bold tracking-[0.25em] text-black uppercase">
          Hello, I&apos;m
        </p>

        <h1 className="font-display text-[clamp(4rem,9vw,8rem)] leading-[0.95] tracking-tight">
          <span className="text-black font-semibold tracking-tighter block md:inline">Galib Tasfiq </span>
          <span className="text-orange font-serif italic font-normal tracking-normal">Abid</span>
        </h1>

        <div className="mt-4 flex flex-col items-center">
          <p className="text-xl font-bold md:text-2xl text-black">
            A Designer & Developer
          </p>

          <p className="mt-3 font-mono text-sm font-bold text-black/80">
            where design meets code
          </p>
        </div>

        <a
          href="#work"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition-transform hover:scale-105"
        >
          View My Work
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="mt-0.5"
          >
            <path
              d="M3 11L11 3M11 3H5M11 3V9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <div className="mt-14 flex items-center gap-5 text-black">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              className="inline-block transition-transform duration-300 hover:scale-125 hover:-translate-y-1 hover:text-orange"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-0 flex w-full flex-col items-center gap-3">
        <span className="text-[10px] font-medium tracking-[0.3em] text-grey uppercase">
          Scroll
        </span>
        <div className="relative h-12 w-px overflow-hidden bg-grey/20">
          <div ref={scrollLineRef} className="absolute left-0 top-0 h-full w-full bg-grey/80" />
        </div>
      </div>
    </section>
  );
}
