import { services } from "@/lib/projects";

export default function Services() {
  return (
    <section id="services" className="relative px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-grey uppercase">
            What I Do
          </p>
          <h2 className="mt-2 text-6xl font-display font-semibold tracking-tighter text-black capitalize md:text-7xl lg:text-8xl">
            <span className="font-serif italic font-normal text-black/80 pr-2">My</span>
            Services
          </h2>
        </div>

        <ul className="mt-12 divide-y divide-black/10 border-t border-black/10">
          {services.map((service) => (
            <li
              key={service}
              className="group flex items-center justify-center py-6 transition-colors hover:text-orange"
            >
              <span className="text-xl font-medium text-black transition-colors group-hover:text-orange md:text-2xl text-center">
                {service}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
