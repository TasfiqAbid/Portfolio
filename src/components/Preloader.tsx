"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const fillTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock scroll during preloader
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        // Restore scroll
        document.body.style.overflow = "";
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
      }
    });

    // 1. Animate the logo fill from bottom to top
    tl.fromTo(fillTextRef.current, {
      backgroundPosition: "0% 0%"
    }, {
      backgroundPosition: "0% 100%",
      duration: 1.8,
      ease: "power2.inOut",
    })
    // 2. Fade and slide out the text
    .to(textWrapperRef.current, {
      opacity: 0,
      y: -40,
      duration: 0.6,
      ease: "power3.in",
    })
    // 3. Slide up the dark background smoothly to reveal the website
    .to(bgRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.inOut",
    }, "-=0.2");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center pointer-events-none"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-[#0a0a0a] w-full h-full origin-top"
      />
      <div
        ref={textWrapperRef}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div
          ref={fillTextRef}
          className="text-7xl md:text-9xl bg-clip-text text-transparent pb-12"
          style={{
            fontFamily: "var(--font-signature), cursive",
            backgroundImage: "linear-gradient(to top, #ffffff 49%, rgba(255,255,255,0.15) 51%)",
            backgroundSize: "100% 200%",
            backgroundPosition: "0% 0%",
            backgroundRepeat: "no-repeat"
          }}
        >
          Gta
        </div>
      </div>
    </div>
  );
}
