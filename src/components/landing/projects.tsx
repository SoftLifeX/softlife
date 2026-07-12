"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "@/lib/gsap-init";
import { project } from "@/lib/constants/project-data";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";
import { useGsapScope } from "@/hooks/useGsapScope";
import { WipeLabel, useWipeRefs } from "@/lib/animations/wipeLabel";
import { ProjectCard } from "@/components/ui/project-card";
import { EASE } from "@/lib/animations/tokens";

const INDEX_LABELS = ["01", "02", "03", "04", "05", "06", "07", "08"];
const featured = project.slice(0, 6);
const offsetY = ["", "md:-translate-y-15", "", "", "md:translate-y-15", "", ""];

export default function Projects() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const label = useWipeRefs();
  const ready = usePageReady();

  useGsapScope(projectsRef, {
    ready,

    reducedMotionFallback: () => {
      gsap.set(label.textRef.current, { visibility: "visible", opacity: 1 });
      gsap.set(".project-card", { visibility: "visible", opacity: 1, x: 0, y: 0, scale: 1 });
      gsap.set([".projects-heading", ".projectline"], { visibility: "visible", opacity: 1, yPercent: 0, xPercent: 0 });
    },

    animate: (ctx) => {
      gsap.set(label.textRef.current, { visibility: "visible" });
      registerWipe(label, {
        trigger: () => label.textRef.current,
        direction: "left",
        startOffset: "top 90%",
        underlineStart: "top 80%",
        underlineEnd: "top 60%",
      });

      const isMobile = window.innerWidth < 768;
      const yAmt = isMobile ? 0 : 18;

      gsap.utils.toArray<HTMLElement>(".parallax-container").forEach((container) => {
        const img = container.querySelector<HTMLImageElement>("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -yAmt },
          { yPercent: yAmt, ease: "none", scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });

      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 769px)", mobile: "(max-width: 768px)" }, (context) => {
        const { desktop, mobile } = context.conditions!;
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");

        if (desktop && cards.length > 1) {
          gsap.set(cards, { visibility: "visible" });

          const rects = cards.map((c) => c.getBoundingClientRect());
          const baseIndex = 1;
          const base = rects[baseIndex];

          cards.forEach((card, i) => {
            gsap.set(card, {
              x: base.left - rects[i].left,
              y: base.top - rects[i].top,
              opacity: 0,
              scale: 0,
              willChange: "opacity, transform",
            });
          });

          gsap.to(cards, {
            x: 0, y: 0, opacity: 1, scale: 1, ease: EASE, stagger: 0.15,
            scrollTrigger: { trigger: cards[baseIndex], start: "top bottom", end: "top 45%", scrub: true },
            onComplete: () => {
              gsap.set(cards, { willChange: "auto" });
            },
          });
        }

        if (mobile) {
          gsap.set(cards, { clearProps: "all" }); // wipe any leftover desktop inline styles (x/y/opacity/scale)
          gsap.set(cards, { visibility: "visible" }); // then explicitly show them
        }
      });

      ctx.add(() => () => mm.revert());
    },

    // Heading + centered text — both need SplitText, both wait fonts.ready.
    animateWithSplitText: (ctx) => {
      gsap.set([".projects-heading", ".projectline"], { visibility: "visible" });

      const headingSplit = new SplitText(".projects-heading", { type: "lines, words", mask: "lines" });
      gsap.fromTo(
        headingSplit.words,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "power2.out",
          stagger: 0.03,
          scrollTrigger: { trigger: ".projects-heading", start: "top 85%", end: "top 60%", scrub: true },
        }
      );

      // Same treatment as Services' .serviceline
      const projectlineSplit = new SplitText(".projectline", { type: "chars, words", mask: "chars" });
      gsap.set(projectlineSplit.chars, { xPercent: 100, opacity: 0 });
      gsap.to(projectlineSplit.chars, {
        xPercent: 0,
        opacity: 1,
        ease: EASE,
        stagger: 0.02,
        scrollTrigger: { trigger: ".projectline", start: "top 80%", end: "top 65%", scrub: true },
      });

      ctx.add(() => () => {
        headingSplit.revert();
        projectlineSplit.revert();
      });
    },
  });

  const handleLockedClick = (e: React.MouseEvent, isDisabled?: boolean) => {
    if (!isDisabled) return;
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.add("shake-animation");
    setTimeout(() => target.classList.remove("shake-animation"), 500);
  };

  return (
    <div ref={projectsRef} id="craft" className="px py my-[8svh]">
      <WipeLabel {...label} label="selected work" className="mb-4" />

      <h2 className="projects-heading gsap-hide text-3xl md:text-6xl font-bold leading-tight text-foreground mb-12 md:mb-16 w-full">
        a few things that made it past &ldquo;good enough&rdquo;
      </h2>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((p, i) => (
            <div key={p.id} className="project-card gsap-hide">
              <ProjectCard
                p={p}
                index={INDEX_LABELS[i] ?? String(i + 1).padStart(2, "0")}
                onLockedClick={handleLockedClick}
                offsetClass={offsetY[i]}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
          <p className="projectline gsap-hide text-sm">
            The work speaks, I'll be quiet.
          </p>
        </div>
      </div>
    </div>
  );
}