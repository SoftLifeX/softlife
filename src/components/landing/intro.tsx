"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "@/lib/gsap-init";
import { useRevealMask } from "@/hooks/useRevealMask";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";
import { useGsapScope } from "@/hooks/useGsapScope";
import { WipeLabel, useWipeRefs } from "@/lib/animations/wipeLabel";
import { EASE } from "@/lib/animations/tokens";

export default function Intro() {
  const introSectionRef = useRef<HTMLDivElement | null>(null);
  const introLabel = useWipeRefs();

  const { revealRef, hovered, handleMouseEnter, handleMouseLeave } = useRevealMask();
  const ready = usePageReady();

  useGsapScope(introSectionRef, {
    ready,

    reducedMotionFallback: () => {
      gsap.set(introLabel.textRef.current, { visibility: "visible", opacity: 1, yPercent: 0 });
      gsap.set(introLabel.widthRef.current, { width: "100%" });
      gsap.set(".about", { visibility: "visible", opacity: 1, yPercent: 0 });
      gsap.set(".intro", { visibility: "visible", opacity: 1 });
    },

    animate: () => {
      gsap.set(introLabel.textRef.current, { visibility: "visible" });
      registerWipe(introLabel, {
        trigger: () => introLabel.textRef.current,
        direction: "left",
        startOffset: "top 90%",
        underlineStart: "top 80%",
        underlineEnd: "top 60%",
        ease: EASE,
      });
    },
    
    animateWithSplitText: (ctx) => {
      gsap.set(".about", { visibility: "visible" });
      const aboutSplit = new SplitText(".about", { type: "chars, words, lines", mask: "lines" });

      gsap.fromTo(
        aboutSplit.words,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: EASE,
          stagger: 0.02,
          scrollTrigger: { trigger: ".about", start: "top 70%", end: "top 55%", scrub: true },
        }
      );

      gsap.set(".intro", { visibility: "visible", opacity: 1 });
      const introTitleSplit = new SplitText(".intro", { type: "chars, words, lines", linesClass: "line" });
      gsap.set(introTitleSplit.words, { opacity: 0 });

      gsap.to(introTitleSplit.words, {
        opacity: 1,
        ease: EASE,
        stagger: 0.02,
        scrollTrigger: { trigger: ".intro", start: "top 90%", end: "bottom top", scrub: true },
      });

      ctx.add(() => () => {
        aboutSplit.revert();
        introTitleSplit.revert();
        gsap.set(".intro", { opacity: 1 });
      });
    },
  });

  return (
    <section id="about" ref={introSectionRef} className="intro-section relative py px">
      <WipeLabel {...introLabel} label="Who tf do I think i am?" />

      <div className="flex justify-end-safe w-full pt-4 pb-3 md:pb-12 text-sm text-primary-foreground">
        <p className="about gsap-hide text-end">
          Asides from the &ldquo;generic&rdquo; slab of text you&apos;re about to read,
          <br /> i&apos;m just a chill guy, I like traveling, learning new things,
          <br /> I enjoy the peace and quiet but will opt for the occasional chaos at times.
          <br />
          ohh and most importantly, i&apos;m obsessed with sweets
        </p>
      </div>

      <div className="relative w-full flex justify-start">
        <p
          className="intro gsap-hide large text-3xl md:text-[5rem] w-full text-foreground"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          An award winning Full-stack &amp; Mobile Software Engineer and Designer,
          with 4+ years of experience.
        </p>

        <div
          ref={revealRef}
          className="hidden md:block pointer-events-none absolute inset-0 text-3xl md:text-[5rem] z-10 bg-background"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0s ease", willChange: "clip-path" }}
        >
          A Developer making Apps and websites that actually look good (not just an overused AI generated template)
        </div>
      </div>
    </section>
  );
}