"use client";

import { clients } from "@/lib/projects";

export default function Clients() {
  const doubled = [...clients, ...clients];

  return (
    <section id="clients" className="relative overflow-hidden px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl flex flex-col items-center justify-center">
        <h2 className="text-5xl font-black tracking-tight text-black uppercase md:text-7xl" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
          MY CLIENTS
        </h2>
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div className="animate-marquee flex w-max gap-12">
          {doubled.map((client, i) => (
            <span
              key={`${client}-${i}`}
              className="whitespace-nowrap text-3xl font-medium text-black/20 md:text-5xl"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
