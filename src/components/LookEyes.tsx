"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LookEyes.module.css";

export default function LookEyes({ paused = false }: { paused?: boolean }) {
  const wordRef = useRef<HTMLSpanElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    const eyes = Array.from(word.querySelectorAll<HTMLElement>("[data-eye]"));
    const pupils = eyes.map((eye) => eye.querySelector<HTMLElement>("[data-pupil]")!);
    const sockets = pupils.map((pupil) => pupil.parentElement!);
    const shapes = eyes.map((eye) => eye.querySelector<HTMLElement>("[data-shape]")!);
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let awake = false;
    let tracking = false;
    let frame = 0;
    let needsMeasure = true;
    let geometry: { x: number; y: number; rangeX: number; rangeY: number; focusDepth: number }[] = [];
    let blinks: Animation[] = [];

    const center = () => pupils.forEach((pupil) => {
      pupil.style.removeProperty("--look-x");
      pupil.style.removeProperty("--look-y");
    });

    const render = () => {
      frame = 0;
      if (!tracking) return;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      if (needsMeasure) {
        geometry = eyes.map((eye, index) => {
          const rect = eye.getBoundingClientRect();
          const socket = sockets[index];
          const socketStyle = getComputedStyle(socket);
          const pupilStyle = getComputedStyle(pupils[index]);
          const width = parseFloat(socketStyle.width);
          const height = parseFloat(socketStyle.height);
          // Layout dimensions stay stable while the inner shape blinks.
          const inset = Math.max(1, width * .025);
          return {
            x: rect.left + scrollX + parseFloat(socketStyle.left),
            y: rect.top + scrollY + parseFloat(socketStyle.top),
            rangeX: Math.max(0, (width - parseFloat(pupilStyle.width)) / 2 - inset),
            rangeY: Math.max(0, (height - parseFloat(pupilStyle.height)) / 2 - inset),
            focusDepth: Math.max(36, width * 1.25),
          };
        });
        needsMeasure = false;
      }
      pupils.forEach((pupil, index) => {
        const eye = geometry[index];
        const pointer = pointerRef.current;
        // Document coordinates remain valid while the page scrolls. Derive the
        // viewport position without measuring layout on every scroll frame.
        const dx = pointer ? pointer.x - (eye.x - scrollX) : 0;
        const dy = pointer ? pointer.y - (eye.y - scrollY) : 0;
        const distance = Math.hypot(dx, dy);
        // Project the gaze along the exact cursor direction onto the eye's ellipse.
        // A shallow focal distance makes nearby movement visible without a hard snap.
        const directionX = distance ? dx / distance : 0;
        const directionY = distance ? dy / distance : 0;
        const edge = distance && eye.rangeX && eye.rangeY
          ? 1 / Math.hypot(directionX / eye.rangeX, directionY / eye.rangeY)
          : 0;
        const travel = edge * distance / Math.hypot(distance, eye.focusDepth);
        pupil.style.setProperty("--look-x", `${directionX * travel}px`);
        pupil.style.setProperty("--look-y", `${directionY * travel}px`);
      });
    };

    const schedule = () => {
      if (tracking && !frame) frame = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const layout = () => { needsMeasure = true; schedule(); };
    const leave = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      pointerRef.current = null;
      schedule();
    };
    const blink = () => {
      if (!awake || reducedMotion.matches || blinks.some((animation) => animation.playState === "running")) return;
      blinks.forEach((animation) => animation.cancel());
      blinks = shapes.map((shape, index) => shape.animate([
        { transform: "scaleY(1)", offset: 0 },
        { transform: "scaleY(.12)", offset: .35 },
        { transform: "scaleY(1)", offset: 1 },
      ], { duration: 380, delay: index * 45, easing: "ease-in-out" }));
    };

    const sync = () => {
      const nextAwake = visible && !document.hidden && !paused;
      const entering = nextAwake && !awake;
      awake = nextAwake;
      word.dataset.awake = String(awake);
      const nextTracking = awake && finePointer.matches && !reducedMotion.matches;
      if (nextTracking !== tracking) {
        tracking = nextTracking;
        if (tracking) {
          window.addEventListener("scroll", schedule, { passive: true });
          window.addEventListener("resize", layout);
          needsMeasure = true;
          schedule();
        } else {
          window.removeEventListener("scroll", schedule);
          window.removeEventListener("resize", layout);
          cancelAnimationFrame(frame);
          frame = 0;
          center();
        }
      }
      if (entering) blink();
      if (!awake || reducedMotion.matches) blinks.forEach((animation) => animation.cancel());
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .15 });
    observer.observe(word);
    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(word);
    // Pin spacing and archive/layout changes can move the heading without
    // resizing it. Refresh the cache when ScrollTrigger finishes measuring.
    ScrollTrigger.addEventListener("refresh", layout);
    // Remember the cursor offscreen too; only visible, active eyes schedule frames.
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    word.addEventListener("pointerenter", blink);
    document.addEventListener("visibilitychange", sync);
    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      ScrollTrigger.removeEventListener("refresh", layout);
      cancelAnimationFrame(frame);
      blinks.forEach((animation) => animation.cancel());
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointerout", leave);
      word.removeEventListener("pointerenter", blink);
      document.removeEventListener("visibilitychange", sync);
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
      delete word.dataset.awake;
      center();
    };
  }, [paused]);

  return (
    <span ref={wordRef} className={styles.word}>
      <span className="sr-only">look</span>
      <span aria-hidden="true">l{[0, 1].map((index) => (
        <span key={index} className={styles.eye} data-eye>
          <span className={styles.shape} data-shape>
            o<span className={styles.sclera}><span className={styles.pupil} data-pupil /></span>
          </span>
        </span>
      ))}k</span>
    </span>
  );
}
