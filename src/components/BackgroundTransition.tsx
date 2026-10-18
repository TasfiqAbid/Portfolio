"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { colors } from "@/lib/constants";
import styles from "./BackgroundTransition.module.css";

gsap.registerPlugin(ScrollTrigger);

type TransitionRange = { start: number; end: number; from: number; to: number };

export default function BackgroundTransition() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    const nav = document.getElementById("main-nav");
    const media = gsap.matchMedia();

    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      let ranges: TransitionRange[] = [];
      let previous = -1;
      const fadeTo = gsap.quickTo(light, "opacity", {
        duration: .2,
        ease: "power2.out",
      });

      const paint = (scroll: number, immediate = false) => {
        let opacity = 0;
        for (const range of ranges) {
          if (scroll < range.start) break;
          const progress = Math.max(0, Math.min(1, (scroll - range.start) / (range.end - range.start)));
          // Smootherstep keeps both ends of each crossfade gentle.
          const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
          opacity = range.from + (range.to - range.from) * eased;
        }
        if (opacity === previous && !immediate) return;
        previous = opacity;
        fadeTo(opacity);
        if (immediate || context.conditions?.reduced) fadeTo.tween.progress(1).pause();
        nav?.classList.toggle("nav-dark", opacity < .5);
      };

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => paint(self.scroll()),
        onRefresh: (self) => {
          const height = window.innerHeight;
          const scroll = self.scroll();
          ranges = [{ start: 0, end: height * .8, from: 0, to: 1 }];
          for (const [selector, from, to] of [
            ["#work", 1, 0],
            ["#about", 0, 1],
            ["#awards", 1, 0],
            ["#contact", 0, 1],
          ] as const) {
            const section = document.querySelector(selector);
            if (!section) continue;
            const top = section.getBoundingClientRect().top + scroll;
            ranges.push({ start: top - height * .95, end: top - height * .05, from, to });
          }
          // Measure after pin spacing/layout refreshes; one writer handles jumps
          // and reverse scrolling without competing section callbacks.
          paint(scroll, true);
        },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <div id="page-bg" className={styles.background} style={{ backgroundColor: colors.bgDark }} aria-hidden="true">
      <div id="page-bg-light" ref={lightRef} className={styles.light} style={{ backgroundColor: colors.bg }} />
    </div>
  );
}
