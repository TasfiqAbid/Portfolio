"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const curtainEase = gsap.parseEase("power3.inOut");
const curtainFrames = (from: number, to: number): Keyframe[] =>
  Array.from({ length: 121 }, (_, index) => ({
    offset: index / 120,
    transform: `translate3d(0, ${from + (to - from) * curtainEase(index / 120)}%, 0)`,
  }));

function setCovered(covered: boolean) {
  document.documentElement.dataset.pageCovered = String(covered);
  window.dispatchEvent(new Event("portfolio:page-cover"));
}

function getHeadingScrollOffset(section: HTMLElement) {
  let current = section.querySelector<HTMLElement>("h2");
  let headingOffset = 0;
  // Layout offsets exclude entrance-animation transforms, including first visits.
  while (current && current !== section) {
    headingOffset += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  if (current !== section) return -100;
  const navBottom = document.getElementById("main-nav")?.getBoundingClientRect().bottom ?? 0;
  return headingOffset - navBottom - 20;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Remove forced scroll to top to prevent jumping/glitching on hydration

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      const handleAnchorClick = (event: MouseEvent) => {
        const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href="#work"], a[href="#about"]');
        if (!anchor) return;
        const section = document.querySelector<HTMLElement>(anchor.getAttribute("href")!);
        if (!section) return;
        event.preventDefault();
        window.scrollTo({
          top: window.scrollY + section.getBoundingClientRect().top + getHeadingScrollOffset(section),
          behavior: "instant",
        });
      };
      document.addEventListener("click", handleAnchorClick);
      return () => document.removeEventListener("click", handleAnchorClick);
    }

    // One clock for wheel easing and scroll-driven animation. Touch retains
    // browser momentum; avoid stacking a long duration on top of the hero scrub.
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, syncTouch: false, autoRaf: false });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", refresh);
    let navigationId = 0;
    let disposed = false;
    let curtain: Animation | null = null;
    const introComplete = () => {
      lenis.resize();
      lenis.start();
    };
    window.addEventListener("portfolio:intro-complete", introComplete);
    if (document.documentElement.dataset.introComplete !== "true") lenis.stop();

    const navigate = async (href: string, el: HTMLElement) => {
      const id = ++navigationId;
      window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: { href } }));
      const overlay = document.getElementById("page-transition-overlay");
      if (!overlay) return;
      const from = overlay.getBoundingClientRect().top / overlay.clientHeight * 100;
      overlay.style.transform = `translate3d(0, ${from}%, 0)`;
      curtain?.cancel();
      lenis.stop();
      const current = () => !disposed && id === navigationId;
      try {
        // Native compositor animations keep the curtain moving through main-
        // thread section setup. They use the original GSAP curve and duration.
        curtain = overlay.animate(curtainFrames(from, 0), { duration: 600, fill: "forwards" });
        await curtain.finished;
        if (!current()) return;
        overlay.style.transform = "translate3d(0, 0, 0)";
        curtain.cancel();
        setCovered(true);
        if (href === "#contact") {
          lenis.scrollTo("bottom", { immediate: true, force: true });
        } else if (href === "#home") {
          lenis.scrollTo(0, { immediate: true, force: true });
        } else if (href === "#about" && ScrollTrigger.getById("about-story")?.pin) {
          // Offset measurements inside an active pin depend on the current
          // scroll position. Land after the paragraphs and final card reveal.
          ScrollTrigger.refresh();
          const aboutStory = ScrollTrigger.getById("about-story")!;
          lenis.scrollTo(aboutStory.labelToScroll("content-ready"), { immediate: true, force: true });
        } else {
          const offset = href === "#work" || href === "#about" ? getHeadingScrollOffset(el) : -100;
          lenis.scrollTo(el, { offset, immediate: true, force: true });
        }
        ScrollTrigger.update();
        if (href === "#about") {
          // Finish delayed scrub while the curtain still covers the destination.
          ScrollTrigger.getById("about-story")?.getTween()?.progress(1);
        }
        // Let destination layout/observers settle underneath the opaque cover.
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        if (!current()) return;
        setCovered(false);
        curtain = overlay.animate(curtainFrames(0, -100), { duration: 600, delay: 100, fill: "both" });
        await curtain.finished;
        if (!current()) return;
        overlay.style.transform = "translate3d(0, 100%, 0)";
        curtain.cancel();
        curtain = null;
        lenis.start();
      } catch (error) {
        if (!current()) return;
        // A canceled native animation must never leave input locked.
        overlay.style.transform = "translate3d(0, 100%, 0)";
        setCovered(false);
        lenis.start();
        if (!(error instanceof DOMException && error.name === "AbortError")) console.error(error);
      }
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;

      e.preventDefault();

      if (document.documentElement.dataset.introComplete !== "true") return;
      void navigate(href, el);
    };

    document.addEventListener("click", handleAnchorClick);
    ScrollTrigger.refresh();

    return () => {
      disposed = true;
      navigationId++;
      curtain?.cancel();
      window.removeEventListener("portfolio:intro-complete", introComplete);
      document.removeEventListener("click", handleAnchorClick);
      ScrollTrigger.removeEventListener("refresh", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div
        id="page-transition-overlay"
        className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center pointer-events-none will-change-transform"
        style={{ transform: "translate3d(0, 100%, 0)" }}
      >
        <div className="w-16 h-16 border-4 border-orange/20 border-t-orange rounded-full animate-spin opacity-50"></div>
      </div>
      {children}
    </>
  );
}
