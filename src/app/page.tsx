import Hero     from "@/components/landing/hero";
import Projects  from "@/components/landing/projects";
import Intro     from "@/components/landing/intro";
import Skills    from "@/components/landing/skills";
import Reviews   from "@/components/landing/reviews";
import Contact   from "@/components/landing/contact-page";

const siteURL = "https://softlifex.vercel.app";

const personSchema = {
  "@context":   "https://schema.org",
  "@type":      "Person",
  name:         "Daniel Chimbu-Okaaomee Daniel",
  alternateName: ["SoftLifeX", "softlifex"],
  url:          siteURL,
  jobTitle:     "Full-Stack & Mobile Software Engineer",
  description:
    "Full-stack and mobile software engineer with 4 years of experience " +
    "building high-quality digital and immersive experiences using React, " +
    "Next.js, React Native, and Flutter.",
  address: {
    "@type":           "PostalAddress",
    addressLocality:   "Lagos",
    addressCountry:    "NG",
  },
  knowsAbout: [
    "React",
    "Next.js",
    "React Native",
    "Flutter",
    "TypeScript",
    "Node.js",
    "Motion Design",
    "GSAP",
    "Mobile App Development",
    "Web Development",
  ],
  sameAs: [
    // Add your real profile URLs — Google uses these to link your identity
    // across the web. Comment out any you don't have.
    "https://github.com/SoftLifeX",
    // "https://twitter.com/softlifex",
    // "https://linkedin.com/in/softlifex",
    // "https://instagram.com/softlifex",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type":    "WebSite",
  name:       "SoftLifeX",
  url:        siteURL,
  author:     { "@type": "Person", name: "Daniel Chimbu-Okaaomee Daniel" },
  description:
    "Portfolio of Daniel Chimbu-Okaaomee Daniel — full-stack & mobile " +
    "software engineer based in Lagos, Nigeria.",
};


export default function Home() {
  return (
    <>
      {/* Structured data — rendered server-side, invisible to users */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <div>
        <Hero />
        <Projects />
        <Intro />
        <Skills />
        <Reviews />
        <div id="contrast">
          <Contact />
        </div>
      </div>
    </>
  );
}