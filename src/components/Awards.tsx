"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { awards } from "@/lib/projects";
import styles from "./Awards.module.css";

function AwardAccent({ mirrored = false }: { mirrored?: boolean }) {
  const gradientId = mirrored ? "laurel-gold-right" : "laurel-gold-left";
  return (
    <span className={`${styles.accent} ${mirrored ? styles.mirrored : ""}`} aria-hidden="true">
      <svg className={styles.branch} viewBox="0 0 100 200" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="25" y1="185" x2="65" y2="10" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c78e48" />
            <stop offset=".5" stopColor="#eab66f" />
            <stop offset="1" stopColor="#f4d69f" />
          </linearGradient>
        </defs>
        <g fill={`url(#${gradientId})`}>
          <path d="M59 175C40 173 30 162 29 149C43 155 52 163 59 175Z" />
          <path d="M59 175C54 159 58 145 70 135C72 150 68 164 59 175Z" />
          <path d="M46 152C28 148 18 134 18 122C32 130 41 140 46 152Z" />
          <path d="M46 152C44 134 49 121 60 113C62 129 56 143 46 152Z" />
          <path d="M36 127C17 119 10 104 12 91C25 101 32 114 36 127Z" />
          <path d="M36 127C35 109 42 96 53 90C52 105 46 119 36 127Z" />
          <path d="M31 101C14 92 9 77 13 64C24 76 29 88 31 101Z" />
          <path d="M31 101C32 84 41 72 53 68C50 83 43 95 31 101Z" />
          <path d="M33 75C18 62 17 46 23 35C31 48 34 62 33 75Z" />
          <path d="M33 75C38 59 49 51 61 50C55 64 46 72 33 75Z" />
          <path d="M39 50C31 37 31 22 38 13C44 27 44 41 39 50Z" />
          <path d="M39 50C45 37 58 31 68 32C61 44 51 49 39 50Z" />
          <path d="M48 26C45 14 50 5 60 1C62 13 55 22 48 26Z" />
        </g>
        <path d="M68 188C32 150 19 87 49 24" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

gsap.registerPlugin(ScrollTrigger);

export default function Awards() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImg(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".awards-heading", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(".award-row", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="awards"
      ref={sectionRef}
      className="relative min-h-screen px-6 pt-16 pb-32 md:px-12 md:pt-20 lg:px-20"
    >
      <div className={styles.ambient} aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="awards-heading section-heading opacity-0 translate-y-[60px] mb-12 relative">
          <div className={styles.titleGroup}>
            <AwardAccent />
            <h2 className={`section-title ${styles.title} relative z-10`}>
              <em>My</em>{" "}Awards
            </h2>
            <AwardAccent mirrored />
          </div>
        </div>

        {/* Award rows */}
        <div className="divide-y divide-white/10 border-t border-white/10">
          {awards.map((award, index) => (
            <div key={award.id} className="award-row opacity-0 translate-y-[50px] group py-8 md:py-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Left: index + title + meta */}
                <div className="flex items-start gap-6">
                  <span className="mt-1 min-w-[2rem] text-sm font-medium text-white/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-orange md:text-2xl">
                      {award.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-sm text-white/40">
                      {award.year && <>
                        <span>{award.year}</span>
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                      </>}
                      <span>{award.category}</span>
                    </div>
                  </div>
                </div>

                {/* Right: two image placeholders */}
                <div className={`flex shrink-0 items-center gap-3 md:gap-4 ${award.id === "award-2" ? "w-[236px] md:w-[272px]" : ""}`}>
                  {/* Keep the certificate inside the existing fixed-size box. */}
                  <button
                    type="button"
                    disabled={!award.images[0]}
                    aria-label={`View certificate: ${award.title}`}
                    className="group/img relative flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-sm border border-white/10 bg-white/5 transition-all duration-300 hover:border-orange/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,166,35,0.2)] md:h-24 md:w-32"
                    onClick={() => award.images[0] && setSelectedImg(award.images[0])}
                  >
                    {award.images[0] && (
                      <Image src={award.images[0]} alt={`${award.title} certificate`} fill sizes="(min-width: 768px) 128px, 112px" className={award.id === "award-2" ? "bg-white object-cover object-[center_60%]" : award.id === "award-4" ? "bg-white object-cover object-top" : award.id === "award-5" ? "bg-white object-cover" : "bg-white object-contain"} />
                    )}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] border border-transparent transition-colors duration-300 group-hover/img:border-orange/40"
                    />
                  </button>

                  {/* Crest / Trophy placeholder */}
                  {award.id !== "award-2" && (
                  <div
                    className="group/img relative flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-sm border border-white/10 bg-white/5 transition-all duration-300 hover:border-orange/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,166,35,0.2)] md:h-24 md:w-32"
                    onClick={() => award.images[1] && setSelectedImg(award.images[1])}
                  >
                    {award.images[1] && (
                      <Image src={award.images[1]} alt={`${award.title} award photo`} fill sizes="(min-width: 768px) 128px, 112px" className="object-cover transition-transform duration-500 group-hover/img:scale-110" />
                    )}
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] border border-transparent transition-colors duration-300 group-hover/img:border-orange/40" />
                  </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Certificate and award preview"
          data-lenis-prevent
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] rounded-xl bg-white/5 p-2 border border-white/10 shadow-[0_0_40px_rgba(245,166,35,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close preview"
              className="absolute -top-14 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-orange hover:text-white"
              onClick={() => setSelectedImg(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <img
              src={selectedImg}
              alt="Enlarged Award"
              className="max-h-[80vh] max-w-full w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
