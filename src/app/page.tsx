import Hero from "@/components/landing/hero";
import Projects from "@/components/landing/projects";
import Intro from "@/components/landing/intro";
import Skills from "@/components/landing/skills";
import Services from "@/components/landing/services";
import Reviews from "@/components/landing/reviews";
import Contact from "@/components/landing/contact-page";



export default function Home() {
  return (
    <div>
      <Hero />
      <Projects />
      <Intro />
      <Skills />

      <Services />
      <Reviews />
      <div
        id="contrast">
        <Contact />
      </div>
    </div>
  );
}
