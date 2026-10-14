export default function Contact() {
  return (
    <>
      <section
        id="contact"
        className="relative flex min-h-screen flex-col items-center justify-between pt-32 pb-6 px-6 md:px-12 lg:px-20"
      >
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-7xl text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-grey uppercase">
            Get in touch
          </p>
          <h2 className="mt-4 font-display text-[clamp(3.5rem,10vw,7rem)] leading-none font-semibold tracking-tighter text-black capitalize">
            Let&apos;s build
            <br />
            <span className="font-serif italic font-normal text-black/80">your </span>
            <span className="font-serif italic font-normal text-orange">vision</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base text-[#555]">
            Have a project in mind? I&apos;d love to hear about it.
          </p>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=abidtasfiq6@gmail.com&su=Project+Inquiry+—+Let's+Work+Together"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-10 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-8 py-4 text-sm font-medium text-black shadow-sm overflow-hidden transition-all duration-300 hover:border-black hover:shadow-md"
          >
            <div className="absolute inset-0 bg-black translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 transition-colors duration-500 group-hover:text-white">Work with me</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="relative z-10 text-black transition-all duration-500 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <path
                d="M3 11L11 3M11 3H5M11 3V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Integrated Light Footer */}
        <footer className="w-full mt-auto pt-16 pb-6">
          <div className="mx-auto flex w-full max-w-7xl flex-col border-t border-black/10 pt-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center w-full">

              {/* Profile */}
              <div className="shrink-0 flex justify-center md:justify-start">
                <p className="font-display text-xl font-semibold tracking-tight text-black">
                  Galib Tasfiq Abid.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center">
                <ul className="flex flex-nowrap whitespace-nowrap items-center justify-center gap-4 sm:gap-6 md:gap-7 lg:gap-8">
                  {[
                    { label: "Facebook", href: "https://www.facebook.com/tasfiqabid/" },
                    { label: "LinkedIn", href: "https://www.linkedin.com/in/tasfiq-abid" },
                    { label: "Instagram", href: "https://www.instagram.com/tasfiq_abid" },
                    { label: "GitHub", href: "https://github.com/TasfiqAbid" },
                    { label: "Behance", href: "https://www.behance.net/tasfiq_abid" },
                  ].map((s) => (
                    <li key={s.label} className="shrink-0">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex flex-col items-center justify-center py-2 text-xs font-bold tracking-widest uppercase text-black/80 transition-colors whitespace-nowrap"
                      >
                        {/* Kinetic Roll-Up Text */}
                        <span className="relative block overflow-hidden leading-tight">
                          <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                            {s.label}
                          </span>
                          <span className="absolute inset-0 block text-orange translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                            {s.label}
                          </span>
                        </span>

                        {/* Center Dot Indicator */}
                        <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-orange opacity-0 scale-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Back to Top */}
              <div className="shrink-0 flex justify-center md:justify-end">
                <a
                  href="#home"
                  className="group flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-black/80 transition-colors hover:text-black whitespace-nowrap"
                >
                  <span>Back to Top</span>
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm overflow-hidden transition-all duration-300 group-hover:border-black group-hover:shadow-md">
                    <div className="absolute inset-0 bg-black translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-black transition-all duration-500 group-hover:text-white group-hover:-translate-y-1">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  </div>
                </a>
              </div>

            </div>
          </div>
        </footer>
      </section>
    </>
  );
}
