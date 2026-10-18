"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/lib/projects";
import styles from "./Work.module.css";
import LookEyes from "./LookEyes";

gsap.registerPlugin(ScrollTrigger);

const nextCrumbPoster = "/work/next-crumb-cookie.png";

const wall = [
  { slug: "milimani", image: "/work/milimani.webp", position: "mountain", aspectRatio: 2 / 3 },
  { slug: "next-crumb", image: nextCrumbPoster, position: "cookies", aspectRatio: 2 / 3 },
  { slug: "street-photography", image: "/work/unscripted-cover.webp", position: "photography", aspectRatio: 3 / 2 },
  { slug: "life-edition", image: "/work/life-edition.webp", position: "edition", aspectRatio: 2 / 3 },
  { slug: "summer-nights", image: "/work/summer-nights.webp", position: "summer", aspectRatio: 2 / 3 },
] as const;

type Preview = { project: Project; image: string };

export default function Work() {
  const [expanded, setExpanded] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewImageRef = useRef<HTMLDivElement>(null);
  const previewOriginRef = useRef<DOMRect | null>(null);
  const closeAnimationRef = useRef<Animation | null>(null);
  const closingRef = useRef(false);
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = wallRef.current;
    if (!element) return;
    const pieces = Array.from(element.querySelectorAll<HTMLElement>("figure"));
    const media = gsap.matchMedia();

    media.add({
      desktop: "(min-width: 900px)",
      mobile: "(max-width: 899px)",
      reducedMotion: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reducedMotion) return;
      const desktop = context.conditions?.desktop;
      const bounds = element.getBoundingClientRect();
      const offsets = pieces.map((piece) => {
        const rect = piece.getBoundingClientRect();
        return {
          x: (bounds.left + bounds.width / 2 - rect.left - rect.width / 2) * .32,
          y: 35 + (bounds.top + bounds.height / 2 - rect.top - rect.height / 2) * .1,
        };
      });
      const clear = (targets: HTMLElement[]) => gsap.set(targets, {
        clearProps: "transform,opacity,visibility,willChange",
      });
      const animations: gsap.core.Tween[] = [];

      if (desktop) {
        animations.push(gsap.fromTo(pieces, {
          x: (index: number) => offsets[index].x,
          y: (index: number) => offsets[index].y,
          rotation: (index: number) => (index - 2) * 3,
          scale: .93,
          autoAlpha: 0,
        }, {
          x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1,
          duration: 1.05,
          stagger: .1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom top",
            toggleActions: "play none play none",
          },
          onStart: () => gsap.set(pieces, { willChange: "transform,opacity" }),
          onComplete: () => { clear(pieces); },
        }));
      } else {
        // Each mobile row reveals on entry rather than animating below the viewport.
        pieces.forEach((piece, index) => {
          animations.push(gsap.fromTo(piece, {
            x: index % 2 ? -16 : 16, y: 35, rotation: index % 2 ? 3 : -3,
            scale: .96, autoAlpha: 0,
          }, {
            x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1,
            duration: .8, ease: "power3.out",
            scrollTrigger: {
              trigger: piece,
              start: "top 92%",
              end: "bottom top",
              toggleActions: "play none play none",
            },
            onStart: () => gsap.set(piece, { willChange: "transform,opacity" }),
            onComplete: () => { clear([piece]); },
          }));
        });
      }

      // Entry thresholds start the reveal, but must never hide visible posters.
      // Re-arm only after the entire collage has left, including tilted/hovered edges.
      const reset = () => {
        animations.forEach((animation) => animation.pause(0));
        gsap.set(pieces, { clearProps: "willChange" });
      };
      ScrollTrigger.create({
        trigger: element,
        start: "top bottom+=96",
        end: "bottom top-=96",
        onLeave: reset,
        onLeaveBack: reset,
      });
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    // Expanding the archive moves the sections below it; update their scroll ranges.
    ScrollTrigger.refresh();
  }, [expanded]);

  useEffect(() => {
    if (!preview) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closingRef.current = false;
    dialog.showModal();
    const image = previewImageRef.current;
    const aspectRatio = wall.find((item) => item.image === preview.image)?.aspectRatio;
    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width <= 0 || height <= 0) return;
      // object-fit: contain can make the artwork much narrower than its container.
      // Layout dimensions stay stable while the opening transform is animating.
      setPreviewWidth(Math.ceil(aspectRatio ? Math.min(width, height * aspectRatio) : width));
    });
    if (image) resizeObserver.observe(image);
    const animations: Animation[] = [];
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animations.push(dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out" }));
      const origin = previewOriginRef.current;
      if (image && origin) {
        const destination = image.getBoundingClientRect();
        animations.push(image.animate([
          {
            transform: `translate(${origin.left - destination.left}px, ${origin.top - destination.top}px) scale(${origin.width / destination.width}, ${origin.height / destination.height})`,
            opacity: .3,
          },
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
        ], { duration: 480, easing: "cubic-bezier(.22, 1, .36, 1)" }));
      }
    }
    return () => {
      resizeObserver.disconnect();
      animations.forEach((animation) => animation.cancel());
      closeAnimationRef.current?.cancel();
      closeAnimationRef.current = null;
      closingRef.current = false;
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [preview]);

  const openPreview = (project: Project, image: string, source?: HTMLElement) => {
    previewOriginRef.current = source?.getBoundingClientRect() ?? null;
    setImageFailed(false);
    setPreviewWidth(null);
    setPreview({ project, image });
  };

  const closePreview = () => {
    if (closingRef.current) return;
    const dialog = dialogRef.current;
    if (!dialog || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPreview(null);
      return;
    }
    closingRef.current = true;
    const animation = dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: "ease-out", fill: "forwards" });
    closeAnimationRef.current = animation;
    animation.finished.then(() => setPreview(null)).catch(() => {});
  };

  return (
    <section id="work" className={styles.section} aria-labelledby="work-heading">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="work-heading" className="section-title" aria-label="Work worth a closer look.">Work worth a <em>closer</em> <LookEyes paused={!!preview} /><span className={styles.period}>.</span></h2>
        </header>
        <div ref={wallRef} className={styles.wall} aria-label="Selected project poster wall">
          {wall.map((item) => {
            const project = projects.find((project) => project.slug === item.slug)!;
            return (
              <figure key={item.position} className={`${styles.piece} ${styles[item.position]}`}>
                <button type="button" className={styles.poster} onClick={(event) => openPreview(project, item.image, event.currentTarget)} aria-label={`Take a closer look at ${project.title}`}>
                  <Image src={item.image} alt={`${project.title} — ${item.position === "photography" ? "photography cover" : "poster artwork"}`} fill quality={item.image === nextCrumbPoster || item.position === "photography" ? 90 : 75} sizes={item.position === "photography" ? "(max-width: 899px) min(88vw, 660px), min(30vw, 397px)" : item.position === "edition" || item.position === "summer" ? "(max-width: 899px) min(43vw, 321px), min(14vw, 185px)" : "(max-width: 899px) min(43vw, 321px), min(30vw, 397px)"} className={styles.artwork} />
                  <span className={styles.posterAction} aria-hidden="true">
                    View project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 19 5M5 5h14v14" /></svg>
                  </span>
                </button>
              </figure>
            );
          })}
        </div>

        <div className={styles.archiveAction}>
          <button type="button" aria-expanded={expanded} aria-controls="work-archive" onClick={() => setExpanded(!expanded)}>
            <span>{expanded ? "Close archive" : "View all projects"}</span>
              <svg className={styles.archiveArrow} aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={expanded ? "M5 12h14" : "M5 19 19 5M5 5h14v14"} />
              </svg>
          </button>
        </div>
        <div id="work-archive" hidden={!expanded} className={styles.archive}>
          {projects.map((project, index) => (
            <button key={project.slug} type="button" className={styles.archiveItem} onClick={() => openPreview(project, wall.find((item) => item.slug === project.slug)?.image ?? project.image)}>
              <span className={styles.archiveNumber}>{(index + 1).toString().padStart(2, "0")}</span>
              <span className={styles.archiveTitle}>{project.title}</span>
              <span className={styles.archiveYear}>{project.year}</span><span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        data-lenis-prevent
        aria-labelledby="project-preview-title"
        aria-describedby="project-preview-meta"
        onCancel={(event) => { event.preventDefault(); closePreview(); }}
        onClose={() => setPreview(null)}
      >
        {preview && (
          <div className={styles.preview}>
            <header className={styles.previewHeader}>
              <h3 id="project-preview-title">{preview.project.title}</h3>
              <button type="button" className={styles.close} onClick={closePreview} aria-label="Close project preview">
                <span>Close</span>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m6 6 12 12M6 18 18 6" /></svg>
              </button>
            </header>
            <div ref={previewImageRef} className={styles.previewImage}>
              {imageFailed ? (
                <p className={styles.unavailable}>Preview coming soon.</p>
              ) : previewWidth !== null ? (
                <Image src={preview.image} alt={`${preview.project.title} ${preview.project.slug === "street-photography" ? "photography cover" : "project preview"}`} fill quality={preview.image === nextCrumbPoster || preview.project.slug === "street-photography" ? 90 : 75} sizes={`${previewWidth}px`} loading="eager" className={styles.previewArtwork} onError={() => setImageFailed(true)} />
              ) : null}
            </div>
            <footer className={styles.previewFooter}>
              <p id="project-preview-meta">{preview.project.slug === "next-crumb" ? preview.project.client : preview.project.slug === "street-photography" ? "Street & Documentary Photography" : preview.image.startsWith("/work/") ? "Poster study" : preview.project.client}{preview.project.year && <><span aria-hidden="true">·</span>{preview.project.year}</>}</p>
              {preview.project.url && (
                <a className={styles.projectLink} href={preview.project.url} target="_blank" rel="noopener noreferrer">
                  Full project <span aria-hidden="true">↗</span>
                </a>
              )}
            </footer>
          </div>
        )}
      </dialog>
    </section>
  );
}
