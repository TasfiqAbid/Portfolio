"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

// Native animations keep moving if scene preparation occupies JavaScript.
// Sample the existing eases so the original intro pacing stays the same.
function nativeEase(name: string) {
  const ease = gsap.parseEase(name);
  return "linear(" + Array.from({ length: 101 }, (_, index) => ease(index / 100).toFixed(5)).join(",") + ")";
}

const textExitEase = nativeEase("power3.in");
const curtainEase = nativeEase("expo.inOut");

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const fillClipperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const background = bgRef.current;
    const text = textWrapperRef.current;
    const clipper = fillClipperRef.current;
    if (!container || !background || !text || !clipper) return;

    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    let canceled = false;
    let completed = false;
    let fallback: number | undefined;

    container.style.display = "";
    document.body.style.overflow = "hidden";
    root.dataset.pageCovered = "true";
    delete root.dataset.introComplete;
    delete root.dataset.introFilled;
    window.dispatchEvent(new Event("portfolio:page-cover"));

    const releaseCover = () => {
      root.dataset.pageCovered = "false";
      window.dispatchEvent(new Event("portfolio:page-cover"));
    };

    const complete = () => {
      if (canceled || completed) return;
      completed = true;
      container.style.display = "none";
      document.body.style.overflow = previousOverflow;
      root.dataset.introComplete = "true";
      performance.mark("portfolio:intro-complete");
      window.dispatchEvent(new Event("portfolio:intro-complete"));
    };

    let settleScene: () => void;
    const sceneReady = new Promise<void>((resolve) => { settleScene = resolve; });
    const onSceneSettled = () => {
      window.clearTimeout(fallback);
      settleScene();
    };
    window.addEventListener("hero3d-ready", onSceneSettled);
    window.addEventListener("hero3d-error", onSceneSettled);
    if (root.dataset.hero3dReady === "true" || root.dataset.hero3dFailed === "true" ||
        root.dataset.hero3dStatus === "ready" || root.dataset.hero3dStatus === "error") {
      onSceneSettled();
    } else {
      // A missing scene must not lock the page. Known renderer setup reports
      // readiness/error itself; do not uncover it after an arbitrary deadline.
      fallback = window.setTimeout(() => {
        if (!document.querySelector("canvas") && root.dataset.hero3dStatus !== "loading") {
          onSceneSettled();
        }
      }, 8000);
    }

    // CSS already started the fill when the server HTML was painted.
    // Hydration waits for its finish without restarting it.
    const fillAnimations = clipper.getAnimations({ subtree: true });
    const elapsed = typeof fillAnimations[0]?.currentTime === "number" ? fillAnimations[0].currentTime : 0;
    performance.mark("portfolio:intro-start", { startTime: Math.max(0, performance.now() - elapsed) });
    const fillReady = Promise.all(fillAnimations.map((animation) => animation.finished.catch(() => {})));
    void fillReady.then(() => {
      if (canceled) return;
      root.dataset.introFilled = "true";
      performance.mark("portfolio:intro-filled");
      window.dispatchEvent(new Event("portfolio:intro-filled"));
    });

    void Promise.all([fillReady, sceneReady, document.fonts.ready]).then(async () => {
      if (canceled) return;
      // Resume the warmed scene during the covered text exit. The curtain
      // uncovers it 400ms later, preserving the original 200ms overlap.
      releaseCover();
      if (reducedMotion.matches) {
        complete();
        return;
      }

      animations.push(
        text.animate([
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
          { opacity: 0, transform: "translate3d(0, -40px, 0)" },
        ], { duration: 600, easing: textExitEase, fill: "forwards" }),
        background.animate([
          { transform: "translate3d(0, 0, 0)" },
          { transform: "translate3d(0, -100%, 0)" },
        ], { delay: 400, duration: 1200, easing: curtainEase, fill: "forwards" }),
      );
      await Promise.all(animations.map((animation) => animation.finished.catch(() => {})));
      complete();
    });

    const onMotionChange = () => {
      if (reducedMotion.matches) animations.forEach((animation) => animation.finish());
    };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      canceled = true;
      window.clearTimeout(fallback);
      window.removeEventListener("hero3d-ready", onSceneSettled);
      window.removeEventListener("hero3d-error", onSceneSettled);
      reducedMotion.removeEventListener("change", onMotionChange);
      animations.forEach((animation) => animation.cancel());
      document.body.style.overflow = previousOverflow;
      releaseCover();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center pointer-events-none"
    >
      <div ref={bgRef} className={"absolute inset-0 bg-[#0a0a0a] w-full h-full origin-top " + styles.curtain} />
      <div ref={textWrapperRef} className={"relative z-10 flex flex-col items-center gap-6 " + styles.text}>
        <div className="relative text-7xl md:text-9xl pb-12" style={{ fontFamily: "var(--font-signature), cursive" }}>
          {/* Opaque gray keeps overlapping script glyphs the same shade. */}
          <span className="text-[#2f2f2f]">Gta</span>
          <span ref={fillClipperRef} aria-hidden="true" className={styles.fillClipper}>
            <span className="absolute inset-0 pb-12 text-white">Gta</span>
          </span>
        </div>
      </div>
    </div>
  );
}
