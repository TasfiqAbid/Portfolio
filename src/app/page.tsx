import BackgroundTransition from "@/components/BackgroundTransition";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Services from "@/components/Services";
import Awards from "@/components/Awards";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative">
      <BackgroundTransition />
      <Navigation />
      <Hero />
      <Work />
      <About />
      <Services />
      <Awards />
      <Contact />
    </main>
  );
}
