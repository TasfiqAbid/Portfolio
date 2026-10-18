"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      const list = listRef.current;
      const stage = stageRef.current;
      if (!section || !list || !stage) return;
      const orange = getComputedStyle(section).getPropertyValue("--orange").trim() || "#f5a623";
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: () => `top ${Math.max(72, (window.innerHeight - stage.offsetHeight) / 2)}px`,
          end: () => `+=${window.innerHeight * services.length * 0.65}`,
          pin: true,
          pinSpacing: true,
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });
      const labels = list.querySelectorAll(".service-label");
      gsap.set(labels, { color: "#929292" });
      section.querySelectorAll<HTMLElement>(".service-row").forEach((row, index) => {
        const reveal = row.querySelector(".service-reveal");
        const label = row.querySelector(".service-label");
        const line = row.querySelector(".service-line");
        if (!reveal || !label || !line) return;

        const position = index * 2.1;
        timeline.from(reveal, {
          x: () => (index % 2 === 0 ? -1 : 1) * window.innerWidth,
          ease: "power2.inOut",
          force3D: true,
          duration: 1.6,
        }, position)
          .from(line, {
            scaleX: 0,
            autoAlpha: 0,
            transformOrigin: "center center",
            duration: 1.1,
            ease: "power3.out",
          }, position + 0.5)
          .to(label, { color: orange, scale: 1.06, duration: 0.5, ease: "sine.inOut" }, position + 1.1);
        if (index > 0) {
          timeline.to(labels[index - 1], { color: "#929292", scale: 1, duration: 0.5, ease: "sine.inOut" }, position);
        }
      });
      timeline.to({}, { duration: 0.65 });
    }, sectionRef);

    return () => media.revert();
  // Rebuild the scroll timeline whenever a service is added or removed.
  }, [services.length]);

  return (
    <section ref={sectionRef} id="services" className="relative overflow-x-clip py-24">
      {/* Pin a full-width shell; auto margins belong to its unpinned child. */}
      <div ref={stageRef} className="relative w-full">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20">
        <div className="section-heading">
          <p className="section-eyebrow translate-y-2 text-grey">
            What I Do
          </p>
          <h2 className="section-title text-black">
            <em>My</em>{" "}Services
          </h2>
        </div>

        <ul ref={listRef} className="mt-[clamp(16px,4vh,48px)]">
          {services.map((service) => (
            <li
              key={service}
              className="service-row relative flex items-center justify-center py-[clamp(6px,1.3vh,24px)]"
            >
              <span aria-hidden="true" className="service-line pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10" />
              <span className="block w-full px-4 py-1 text-center">
              <span className="service-reveal block">
              <span className="service-label inline-block origin-center text-xl font-medium text-black md:text-2xl">
                {service}
              </span>
              </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}
