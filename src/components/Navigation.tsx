"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/projects";

function Logo() {
  return (
    <a
      href="#home"
      className="block pb-1 text-3xl text-white transition-opacity hover:opacity-80"
      style={{ fontFamily: "var(--font-signature), cursive" }}
    >
      Gta
    </a>
  );
}

export default function Navigation() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const aboutStage = document.getElementById("about-stage");
      const aboutBounds = aboutStage?.getBoundingClientRect();
      // The About content is pinned, so the section itself is not a reliable
      // IntersectionObserver target while the story is playing.
      if (aboutBounds && aboutBounds.top < window.innerHeight * 0.72 && aboutBounds.bottom > window.innerHeight * 0.28) {
        setActive("About");
        return;
      }

      const midpoint = window.innerHeight / 2;
      const current = navLinks.find((link) => {
        const section = document.querySelector<HTMLElement>(link.href);
        if (!section) return false;
        const bounds = section.getBoundingClientRect();
        return bounds.top <= midpoint && bounds.bottom >= midpoint;
      });
      if (current) setActive(current.label);
    };
    window.addEventListener("scroll", handleScroll);
    const handleNavigate = (event: Event) => {
      const href = (event as CustomEvent<{ href?: string }>).detail?.href;
      const match = navLinks.find((link) => link.href === href);
      if (match) setActive(match.label);
    };
    window.addEventListener("portfolio:navigate", handleNavigate);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("portfolio:navigate", handleNavigate);
    };
  }, []);

  return (
    <header className="fixed left-0 right-0 top-6 z-50 flex justify-center px-6">
      <nav
        id="main-nav"
        className={`relative grid w-full max-w-4xl grid-cols-[1fr_auto] items-center gap-x-6 rounded-full px-6 py-3 transition-all duration-500 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-8 ${
          scrolled
            ? "border border-white/10 bg-black/40 shadow-2xl shadow-black/20 backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center justify-start">
          <Logo />
        </div>

        {/* Half the CTA's 20px text inset balances the visible text gaps. */}
        <ul className="hidden min-w-0 translate-x-2.5 items-center justify-center gap-5 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="group relative flex flex-col items-center justify-center text-xs font-medium tracking-widest uppercase transition-colors duration-300"
              >
                <span
                  className={`transition-colors duration-300 ${
                    active === link.label ? "text-white" : "text-white/60 group-hover:text-white"
                  }`}
                >
                  {link.label}
                </span>

                {/* Active Indicator Dot */}
                <span
                  className={`absolute -bottom-4 h-1 w-1 rounded-full bg-orange transition-all duration-300 ${
                    active === link.label ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end">
          <a
            href="#contact"
            className="group/btn relative flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all duration-300 hover:border-orange hover:bg-orange hover:text-black hover:shadow-[0_0_15px_rgba(245,166,35,0.4)]"
          >
            <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-3">
              Let&apos;s Talk
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-3 z-10 translate-x-8 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
