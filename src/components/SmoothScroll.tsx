"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Remove forced scroll to top to prevent jumping/glitching on hydration

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;

      e.preventDefault();

      // Modern Awwwards-style Curtain Transition
      const overlay = document.getElementById("page-transition-overlay");
      if (!overlay) return;

      const tl = gsap.timeline();

      // 1. Slide overlay down
      tl.to(overlay, {
        y: "0%",
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          // 2. Instantly jump to the target section while hidden
          if (href === "#contact") {
            lenis.scrollTo("bottom", { immediate: true });
          } else if (href === "#home") {
            lenis.scrollTo(0, { immediate: true });
          } else {
            lenis.scrollTo(el, { offset: -100, immediate: true });
          }
        },
      })
        // 3. Slide overlay up to reveal
        .to(overlay, {
          y: "-100%",
          duration: 0.6,
          ease: "power3.inOut",
          delay: 0.1,
        })
        // 4. Reset overlay to bottom for next time
        .set(overlay, { y: "100%" });
    };

    document.addEventListener("click", handleAnchorClick);
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <div
        id="page-transition-overlay"
        className="fixed inset-0 z-[100] bg-[#0a0a0a] translate-y-full flex items-center justify-center pointer-events-none"
      >
        <div className="w-16 h-16 border-4 border-orange/20 border-t-orange rounded-full animate-spin opacity-50"></div>
      </div>
      {children}
    </>
  );
}
