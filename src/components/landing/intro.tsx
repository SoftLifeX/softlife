"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-init";
import { cn } from "@/lib/utils";
import { useRevealMask } from "@/hooks/useRevealMask";
import { registerWipe } from "@/hooks/useWipeReveal";

export default function Intro() {
  const introSectionRef = useRef<HTMLDivElement | null>(null);
  const introBlockRef   = useRef<HTMLDivElement | null>(null);
  const widthRef        = useRef<HTMLDivElement | null>(null);
  const subtitleRef     = useRef<HTMLParagraphElement | null>(null);

  const { revealRef, hovered, handleMouseEnter, handleMouseLeave } = useRevealMask();

  useGSAP(
    () => {
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set([subtitleRef.current, ".about", ".intro"], { opacity: 1, yPercent: 0 });
        gsap.set(widthRef.current, { width: "100%" });
        return;
      }

      const ctx = gsap.context(() => {
        document.fonts.ready.then(() => {
          registerWipe(
            { blockRef: introBlockRef, widthRef, textRef: subtitleRef },
            {
              trigger: () => subtitleRef.current,
              direction: "left",
              startOffset: "top 90%",
              underlineStart: "top 80%",
              underlineEnd: "top 60%",
              ease,
            }
          );

          const aboutSplit = new SplitText(".about", {
            type: "chars, words, lines",
            mask: "lines",
          });

          gsap.from(aboutSplit.words, {
            yPercent: 100,
            ease,
            stagger: 0.02,
            scrollTrigger: {
              trigger: ".about",
              start: "top 70%",
              end: "top 55%",
              scrub: true,
            },
          });

          const introTitleSplit = new SplitText(".intro", {
            type: "chars, words, lines",
            linesClass: "line",
          });

          gsap.set(".intro", { opacity: 1 });
          gsap.set(introTitleSplit.words, { opacity: 0 });

          gsap.to(introTitleSplit.words, {
            opacity: 1,
            ease,
            stagger: 0.02,
            scrollTrigger: {
              trigger: ".intro",
              start: "top 90%",
              end: "bottom top",
              scrub: true,
            },
          });

          ctx.add(() => () => {
            aboutSplit.revert();
            introTitleSplit.revert();
            gsap.set(".intro", { opacity: 1 }); // restore after revert
          });

          // Font swap changes element heights — recalculate all trigger
          // positions so nothing fires at a stale scroll offset.
          ScrollTrigger.refresh();
        });
      }, introSectionRef);

      return () => ctx.revert();
    },
    { scope: introSectionRef }
  );

  return (
    <section ref={introSectionRef} className="intro-section relative py px">
      {/* Subtitle with wipe reveal */}
      <div className="relative w-fit">
        <div className="relative w-fit group">
          <p
            ref={subtitleRef}
            className={cn(
              "opacity-0 subtitle relative justify-start w-fit text-sm text-foreground origin-left"
            )}
          >
            Who tf do I think i am?
          </p>
          <div
            ref={widthRef}
            className={cn(
              "absolute left-0 bottom-0 h-px w-full bg-foreground",
              "origin-left scale-x-100 transition-transform duration-500 ease-(--ease-custom)",
              "group-hover:origin-right group-hover:scale-x-0"
            )}
          />
        </div>
        <div
          ref={introBlockRef}
          className="absolute w-0 h-full top-0 left-0 pointer-events-none bg-foreground"
        />
      </div>

      {/* About paragraph */}
      <div className="flex justify-end-safe w-full pt-4 pb-3 md:pb-12 text-sm text-primary-foreground">
        <p className="about text-end">
          Asides from the &ldquo;generic&ldquo; slab of text you&apos;re about to read,
          <br /> i&apos;m just a chill guy, I like traveling, learning new things,
          <br /> I enjoy the peace and quiet but will opt for the occasional chaos at times.
          <br />
          ohh and most importantly, i&apos;m obsessed with sweets
        </p>
      </div>

      {/* Main intro paragraph with reveal mask */}
      <div className="relative w-full flex justify-start">
        <p
          className="intro large text-3xl md:text-8xl w-full text-foreground opacity-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          I&apos;m an award winning Full-stack &amp; Mobile Software Engineer and designer,
          with 4 years of experience focused on crafting high quality digital &amp; immersive experiences
        </p>

        <div
          ref={revealRef}
          id="about"
          className="hidden md:block pointer-events-none absolute inset-0 text-3xl md:text-8xl z-10 bg-background"
          style={{
            opacity: hovered ? 1 : 0,
            transition: "opacity 0s ease",
            willChange: "clip-path",
          }}
        >
          A Developer who&apos;s skills haven&apos;t been replaced by chatGPT - (&ldquo;yet&ldquo;),
          specialized in motion design, I make stuff MOVE! - only when you pay me enough...
          Or bribe me with sweets
        </div>
      </div>
    </section>
  );
}