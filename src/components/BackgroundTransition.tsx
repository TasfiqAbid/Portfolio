"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { colors } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

// Pre-compute OKLAB values for perceptually smooth transitions
const darkLab = srgbToOklab(hexToSrgb(colors.bgDark));
const lightLab = srgbToOklab(hexToSrgb(colors.bg));

export default function BackgroundTransition() {
  useEffect(() => {
    const bg = document.getElementById("page-bg");
    const nav = document.getElementById("main-nav");
    if (!bg) return;

    const setNavDark = (dark: boolean) => {
      nav?.classList.toggle("nav-dark", dark);
    };

    // Initial state
    gsap.set(bg, { backgroundColor: colors.bgDark });
    setNavDark(true);

    const triggers: ScrollTrigger[] = [];

    // ─── 0. DARK → WHITE  (entering Hero name) ──────────────────────────────────
    triggers.push(
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.8}`,
        scrub: true,
        onEnter: () => setNavDark(true),
        onLeave: () => setNavDark(false),
        onEnterBack: () => setNavDark(false),
        onLeaveBack: () => setNavDark(true),
        onUpdate: (self) => {
          bg.style.backgroundColor = lerpOklab(darkLab, lightLab, smoothstep(self.progress));
        },
      }),
    );

    // ─── 1. WHITE → DARK  (entering Work) ───────────────────────────────────
    triggers.push(
      ScrollTrigger.create({
        trigger: "#work",
        start: "top 95%",
        end: "top 5%",
        scrub: true,
        onEnter: () => setNavDark(true),
        onLeaveBack: () => setNavDark(false),
        onUpdate: (self) => {
          bg.style.backgroundColor = lerpOklab(lightLab, darkLab, smoothstep(self.progress));
        },
      }),
    );

    // ─── 2. DARK → WHITE  (entering About) ──────────────────────────────────
    triggers.push(
      ScrollTrigger.create({
        trigger: "#about",
        start: "top 95%",
        end: "top 5%",
        scrub: true,
        onEnter: () => setNavDark(false),
        onLeaveBack: () => setNavDark(true),
        onUpdate: (self) => {
          bg.style.backgroundColor = lerpOklab(darkLab, lightLab, smoothstep(self.progress));
        },
      }),
    );

    // ─── 3. WHITE → DARK  (entering Awards) ─────────────────────────────────
    triggers.push(
      ScrollTrigger.create({
        trigger: "#awards",
        start: "top 95%",
        end: "top 5%",
        scrub: true,
        onEnter: () => setNavDark(true),
        onLeaveBack: () => setNavDark(false),
        onUpdate: (self) => {
          bg.style.backgroundColor = lerpOklab(lightLab, darkLab, smoothstep(self.progress));
        },
      }),
    );

    // ─── 4. DARK → WHITE  (entering Contact) ────────────────────────────────
    triggers.push(
      ScrollTrigger.create({
        trigger: "#contact",
        start: "top 95%",
        end: "top 5%",
        scrub: true,
        onEnter: () => setNavDark(false),
        onLeaveBack: () => setNavDark(true),
        onUpdate: (self) => {
          bg.style.backgroundColor = lerpOklab(darkLab, lightLab, smoothstep(self.progress));
        },
      }),
    );

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      id="page-bg"
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: colors.bgDark }}
    />
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────

/** Smoothstep easing – eliminates harsh linear boundaries */
function smoothstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

/** Parse hex to linear sRGB (0-1 range, linearized) */
function hexToSrgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: srgbTransfer(parseInt(result[1], 16) / 255),
    g: srgbTransfer(parseInt(result[2], 16) / 255),
    b: srgbTransfer(parseInt(result[3], 16) / 255),
  };
}

/** sRGB gamma → linear */
function srgbTransfer(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** linear → sRGB gamma */
function srgbTransferInv(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** Linear sRGB → OKLAB */
function srgbToOklab(c: { r: number; g: number; b: number }): { L: number; a: number; b: number } {
  const l_ = Math.cbrt(0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b);
  const m_ = Math.cbrt(0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b);
  const s_ = Math.cbrt(0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b);
  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

/** OKLAB → Linear sRGB → gamma sRGB → CSS rgb() */
function oklabToRgbString(lab: { L: number; a: number; b: number }): string {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.2914855480 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = Math.round(Math.max(0, Math.min(1, srgbTransferInv(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s))) * 255);
  const g = Math.round(Math.max(0, Math.min(1, srgbTransferInv(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s))) * 255);
  const b = Math.round(Math.max(0, Math.min(1, srgbTransferInv(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s))) * 255);

  return `rgb(${r},${g},${b})`;
}

/** Interpolate in OKLAB space for perceptually uniform blending */
function lerpOklab(
  from: { L: number; a: number; b: number },
  to: { L: number; a: number; b: number },
  t: number,
): string {
  return oklabToRgbString({
    L: from.L + (to.L - from.L) * t,
    a: from.a + (to.a - from.a) * t,
    b: from.b + (to.b - from.b) * t,
  });
}
