"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { projects } from "@/lib/projects";

export default function WorkCarousel() {
  const stageRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  // Core physics & animation refs
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const initialX = useRef(0);
  const initialY = useRef(0);
  const totalDragDistance = useRef(0);
  const hasDragged = useRef(false);

  // Velocity & momentum tracking for fluid flick/swipe
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  // Cached DOM references to eliminate per-frame GC churn
  const titleElRef = useRef<HTMLElement | null>(null);
  const numElRef = useRef<HTMLElement | null>(null);
  const dotsRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const activeIndexRef = useRef<number>(-1);

  // Wheel accumulation & cooldown
  const wheelAccumulatorRef = useRef(0);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelStepTimeRef = useRef(0);

  useEffect(() => {
    // Cache DOM queries once on mount
    if (paginationRef.current) {
      titleElRef.current = paginationRef.current.querySelector(".title-el");
      numElRef.current = paginationRef.current.querySelector(".num-el");
      dotsRef.current = paginationRef.current.querySelectorAll(".dot");
    }

    let animationFrameId: number;
    let isVisible = true;
    let needsRender = true;

    // Pause RAF when WorkCarousel is offscreen to preserve 100% CPU/GPU during page scroll
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          needsRender = true;
        }
      },
      { rootMargin: "250px" }
    );

    if (stageRef.current) {
      observer.observe(stageRef.current);
    }

    const update = () => {
      animationFrameId = requestAnimationFrame(update);

      if (!isVisible) return;

      const diff = targetRef.current - progressRef.current;
      const isMoving = Math.abs(diff) >= 0.0002;

      // Skip 32 heavy DOM style writes when carousel is stationary and not dragged
      if (!isMoving && !isDragging.current && !needsRender) {
        return;
      }

      needsRender = isMoving || isDragging.current;

      const lerpSpeed = isDragging.current ? 0.22 : 0.12;

      if (Math.abs(diff) < 0.0002) {
        progressRef.current = targetRef.current;
      } else {
        progressRef.current += diff * lerpSpeed;
      }

      const N = projects.length;

      // Update 3D card transforms with stable, organic geometry
      if (deckRef.current) {
        const cards = deckRef.current.children;
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i] as HTMLElement;

          // Infinite wrapped offset around circle
          let offset = (i - progressRef.current) % N;
          offset = ((offset % N) + N) % N;
          if (offset > N / 2) offset -= N;

          const absOffset = Math.abs(offset);

          // Stable 3D curve (pure geometric function, zero shaky jitter)
          const rotateY = Math.sign(offset) * -1 * Math.min(42, Math.pow(absOffset, 0.8) * 24);

          // Focus factor (1.0 at center, fading out to 0 at distance 1)
          const focusVar = Math.max(0, 1 - absOffset);

          // Front card stays elevated at Z:20px, side cards recede deeply into background
          const translateZ = (focusVar * 20) - Math.pow(absOffset, 1.25) * 140 - Math.pow(absOffset, 2) * 20;
          const translateX = Math.sign(offset) * (Math.pow(absOffset, 0.88) * 230);

          // Scale: center card is ~1.22, side cards scale gracefully (~0.80 down to 0.68)
          const scale = Math.max(0.68, 0.80 + (focusVar * 0.42) - Math.min(0.12, Math.max(0, absOffset - 1) * 0.08));

          // Seamless opacity fade: card reaches exactly 0 opacity before wrapping at offset 4
          // Fades smoothly from 1.0 to 0.0 between absOffset 1.8 and 3.2
          const opacity = Math.max(0, Math.min(1, 1 - Math.max(0, absOffset - 1.8) / 1.4));

          card.style.transform = `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
          card.style.setProperty("--focus", focusVar.toString());
          card.style.zIndex = Math.round(100 - absOffset * 10).toString();
          card.style.opacity = opacity.toString();
        }
      }

      // Update active index and pagination only when the active card changes
      let currentActive = Math.round(progressRef.current) % N;
      currentActive = ((currentActive % N) + N) % N;

      if (currentActive !== activeIndexRef.current) {
        activeIndexRef.current = currentActive;

        if (titleElRef.current) {
          titleElRef.current.textContent = projects[currentActive].title;
        }
        if (numElRef.current) {
          numElRef.current.textContent = `${(currentActive + 1).toString().padStart(2, "0")} / ${N.toString().padStart(2, "0")}`;
        }
        if (dotsRef.current) {
          dotsRef.current.forEach((dot, idx) => {
            if (idx === currentActive) {
              dot.classList.add("w-8", "bg-gradient-to-r", "from-orange", "to-yellow-400");
              dot.classList.remove("w-1.5", "bg-white/20", "hover:bg-white/40");
            } else {
              dot.classList.remove("w-8", "bg-gradient-to-r", "from-orange", "to-yellow-400");
              dot.classList.add("w-1.5", "bg-white/20", "hover:bg-white/40");
            }
          });
        }
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

    if (isHorizontal) {
      // Trackpad two-finger horizontal scroll: fluid continuous tracking
      targetRef.current += e.deltaX * 0.0025;

      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(() => {
        if (!isDragging.current) {
          targetRef.current = Math.round(targetRef.current);
        }
      }, 150);
    } else {
      // Vertical mouse wheel: step cleanly 1 card per notch with smooth 220ms cooldown
      const now = performance.now();
      wheelAccumulatorRef.current += e.deltaY;

      if (now - lastWheelStepTimeRef.current > 220 && Math.abs(wheelAccumulatorRef.current) >= 35) {
        const step = Math.sign(wheelAccumulatorRef.current);
        targetRef.current = Math.round(targetRef.current) + step;
        wheelAccumulatorRef.current = 0;
        lastWheelStepTimeRef.current = now;
      }

      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(() => {
        wheelAccumulatorRef.current = 0;
      }, 180);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    startY.current = e.clientY;
    initialX.current = e.clientX;
    initialY.current = e.clientY;
    totalDragDistance.current = 0;

    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    if (stageRef.current) {
      stageRef.current.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - startY.current;

    totalDragDistance.current += Math.abs(deltaX) + Math.abs(deltaY);

    const distFromStart = Math.hypot(
      e.clientX - initialX.current,
      e.clientY - initialY.current
    );

    if (distFromStart > 8 || totalDragDistance.current > 8) {
      hasDragged.current = true;
    }

    // Natural drag calibration: 1 card per ~260px of drag
    targetRef.current -= deltaX * 0.0038;

    // Track smoothed flick velocity
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const instantVelocity = (-deltaX * 0.0038) / dt;
    velocityRef.current = velocityRef.current * 0.6 + instantVelocity * 0.4;

    lastTimeRef.current = now;
    lastXRef.current = e.clientX;
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {}

    if (stageRef.current) {
      stageRef.current.style.cursor = "";
    }

    const distFromStart = Math.hypot(
      e.clientX - initialX.current,
      e.clientY - initialY.current
    );

    const isActualDrag = hasDragged.current || distFromStart > 8 || totalDragDistance.current > 8;

    // If it was a clean click (no drag):
    if (!isActualDrag) {
      const rect = stageRef.current?.getBoundingClientRect();
      if (rect) {
        const center = rect.left + rect.width / 2;
        // Center card click threshold (+/- 150px)
        if (e.clientX < center - 150) {
          // Clicked left side card -> rotate to previous card
          targetRef.current = Math.round(targetRef.current) - 1;
          return;
        } else if (e.clientX > center + 150) {
          // Clicked right side card -> rotate to next card
          targetRef.current = Math.round(targetRef.current) + 1;
          return;
        } else {
          // Clicked center card -> open project URL
          const N = projects.length;
          const currentRounded = Math.round(targetRef.current);
          let currentActive = currentRounded % N;
          currentActive = ((currentActive % N) + N) % N;

          const url = projects[currentActive]?.url;
          if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
          }
          return;
        }
      }
    }

    // Drag release with flick momentum support
    const now = performance.now();
    const timeSinceLastMove = now - lastTimeRef.current;

    if (timeSinceLastMove < 100 && Math.abs(velocityRef.current) > 0.001) {
      const throwSteps = Math.round(velocityRef.current * 180);
      const clamped = Math.max(-2, Math.min(2, throwSteps));
      if (clamped !== 0) {
        targetRef.current = Math.round(progressRef.current + clamped);
      } else {
        targetRef.current = Math.round(targetRef.current);
      }
    } else {
      // Gentle release: smoothly snap to nearest card
      targetRef.current = Math.round(targetRef.current);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {}
    if (isDragging.current) {
      isDragging.current = false;
      targetRef.current = Math.round(targetRef.current);
      if (stageRef.current) {
        stageRef.current.style.cursor = "";
      }
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (isDragging.current && !stageRef.current?.hasPointerCapture?.(e.pointerId)) {
      isDragging.current = false;
      targetRef.current = Math.round(targetRef.current);
      if (stageRef.current) {
        stageRef.current.style.cursor = "";
      }
    }
  };

  const selectCard = (index: number) => {
    const N = projects.length;
    const currentRounded = Math.round(targetRef.current);

    let currentActive = currentRounded % N;
    currentActive = ((currentActive % N) + N) % N;

    if (index === currentActive) return;

    // Shortest path around circle
    let diff = (index - currentActive) % N;
    diff = ((diff % N) + N) % N;
    if (diff > N / 2) diff -= N;

    targetRef.current = currentRounded + diff;
  };

  return (
    <div className="relative w-full h-[100dvh] min-h-[750px] flex flex-col items-center justify-center overflow-hidden">
      <div
        ref={stageRef}
        className="stage relative w-full h-[400px] touch-none isolate -mt-8 md:-mt-12 select-none"
        style={{ perspective: "1450px" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerLeave}
        onClickCapture={(e) => {
          if (hasDragged.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div
          ref={deckRef}
          className="deck absolute inset-0 z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          {projects.map((project, i) => (
            <div
              key={project.slug}
              data-index={i}
              className="card group absolute top-1/2 left-1/2 -mt-[200px] -ml-[140px] w-[280px] md:w-[320px] md:-ml-[160px] aspect-[3/4] cursor-pointer select-none"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                WebkitBoxReflect: "below 2px linear-gradient(transparent 60%, rgba(0,0,0,0.5) 100%)",
              }}
            >
              {/* Exact position -top-10 md:-top-14 with sharp font-mono, clear contrast and active focus scale */}
              <div
                className="absolute -top-10 md:-top-14 left-0 right-0 text-center text-[11px] md:text-[13px] font-mono tracking-[0.25em] uppercase font-bold pointer-events-none select-none"
                style={{
                  color: "rgba(255, 255, 255, calc(0.35 + var(--focus) * 0.65))",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.95)",
                  WebkitFontSmoothing: "antialiased",
                  MozOsxFontSmoothing: "grayscale",
                  textRendering: "optimizeLegibility",
                  transform: "translateZ(10px) scale(calc(0.9 + var(--focus) * 0.1))",
                  backfaceVisibility: "hidden",
                }}
              >
                {project.client}
              </div>

              <div
                className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0d0d0d] shadow-2xl pointer-events-none"
                style={{
                  border: "1px solid rgba(255, 255, 255, calc(0.08 + var(--focus) * 0.22))",
                  boxShadow:
                    "0 0 calc(var(--focus) * 55px) rgba(245, 166, 35, calc(var(--focus) * 0.22)), 0 25px 60px -15px rgba(0, 0, 0, 0.95)",
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  draggable={false}
                  className="object-cover select-none pointer-events-none"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    filter:
                      "brightness(calc(0.35 + var(--focus) * 0.65)) contrast(calc(0.92 + var(--focus) * 0.12)) saturate(calc(0.6 + var(--focus) * 0.4))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination: numbers, title, and interactive slide dots */}
      <div
        ref={paginationRef}
        className="relative mt-24 md:mt-32 flex flex-col items-center gap-4 pointer-events-none z-20"
      >
        <div className="flex flex-col items-center gap-2 text-center select-none">
          <div
            className="num-el text-[11px] font-mono font-bold tracking-[0.3em] text-orange"
            style={{
              textShadow: "0 0 10px rgba(245, 166, 35, 0.45)",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            01 / {projects.length.toString().padStart(2, "0")}
          </div>
          <div
            className="title-el text-3xl md:text-5xl font-display uppercase font-bold text-white tracking-wide"
            style={{
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.95), 0 1px 2px rgba(0, 0, 0, 0.8)",
              letterSpacing: "0.05em",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            {projects[0].title}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 pointer-events-auto">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => selectCard(i)}
              className={`dot h-1.5 rounded-full transition-all duration-300 ${
                i === 0
                  ? "w-8 bg-gradient-to-r from-orange to-yellow-400"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
