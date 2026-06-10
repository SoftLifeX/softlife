"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-init";
import Link from "next/link";
import Navbar from "../shared/nav";
import { usePageReady } from "@/hooks/usePageReady";
import { useRevealMask } from "@/hooks/useRevealMask";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blockRef = useRef<HTMLDivElement | null>(null);
  const blockRef2 = useRef<HTMLDivElement | null>(null);
  const blockRef3 = useRef<HTMLDivElement | null>(null);
  const heroWidthRef = useRef<HTMLDivElement | null>(null);

  // Single hook replaces 3 RAF loops + 4 useEffects from the original
  const { revealRef, hovered, handleMouseEnter, handleMouseLeave } = useRevealMask();

  const ready = usePageReady();

  useGSAP(
    () => {
      if (!ready) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      gsap.set(
        [".heading", ".description", ".description-large", ".link-container",
          blockRef3.current, blockRef.current, blockRef2.current],
        { visibility: "visible" }
      );

      if (prefersReducedMotion) {
        gsap.set([".heading", ".description", ".description-large", ".link-container"],
          { opacity: 1, yPercent: 0, xPercent: 0 });
        gsap.set([blockRef.current, blockRef2.current, blockRef3.current], { width: 0 });
        window.dispatchEvent(new CustomEvent("hero-animations-complete"));
        return;
      }

      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          document.fonts.ready.then(() => {
            const tl = gsap.timeline({
              onComplete: () => {
                tl.kill();
                window.dispatchEvent(new CustomEvent("hero-animations-complete"));
              },
            });

            const wipeConfigs: Array<{
              el: HTMLElement | null;
              from: gsap.TweenVars;
              exitTo: gsap.TweenVars;
            }> = [
                { el: blockRef.current, from: { width: "0%", right: "0%" }, exitTo: { width: 0, right: "100%" } },
                { el: blockRef2.current, from: { width: "0%", left: "0%" }, exitTo: { width: 0, left: "100%" } },
                { el: blockRef3.current, from: { width: "0%", left: "0%" }, exitTo: { width: 0, left: "100%" } },
              ];

            wipeConfigs.forEach(({ el, from, exitTo }) => {
              if (!el) return;
              tl.fromTo(el, from, {
                width: "100%", duration: 1, ease,
                onComplete: () => { gsap.to(el, { ...exitTo, duration: 0.4, ease }); },
              }, 0.4);
            });

            const titleSplit = new SplitText(".heading", {
              type: "chars, words", mask: "chars", wordsClass: "heading++",
            });
            gsap.set(titleSplit.chars, { xPercent: 100, opacity: 0 });

            tl.to(titleSplit.chars, {
              xPercent: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease,
              onComplete: () => {
                gsap.to(titleSplit.words, {
                  yPercent: -50, opacity: 0, stagger: 0.05, ease,
                  scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "30% top", end: "+=10%", scrub: true,
                  },
                });
              },
            });

            new SplitText(".reveal", { type: "words", wordsClass: "reveal++" });

            const descSplit = new SplitText(".description", {
              type: "words, lines", wordsClass: "des++", mask: "lines",
            });
            const descLargeSplit = new SplitText(".description-large", {
              type: "words, lines", wordsClass: "des-large++", mask: "lines",
            });
            const linkSplit = new SplitText(".herolink", {
              type: "words, lines", mask: "lines",
            });

            gsap.set([descSplit.words, descLargeSplit.words, linkSplit.words],
              { yPercent: 100, opacity: 0 });

            const scrollExit = (trigger: Element | null) => ({
              yPercent: -50, opacity: 0, stagger: 0.2, ease,
              scrollTrigger: { trigger, start: "30% top", end: "+=10%", scrub: true },
            });

            [
              [descSplit.words, containerRef.current, "<"],
              [descLargeSplit.words, containerRef.current, "<0.2"],
              [linkSplit.words, containerRef.current, "<"],
            ].forEach(([words, trigger, position]) => {
              tl.to(words as HTMLElement[], {
                yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease,
                onComplete: () => {
                  gsap.set(words as HTMLElement[], { yPercent: 0, opacity: 1 });
                  gsap.to(words as HTMLElement[], scrollExit(trigger as Element | null));
                },
              }, position as string);
            });

            gsap.set(heroWidthRef.current, { width: 0 });
            tl.to(heroWidthRef.current, {
              width: "100%", stagger: 1, ease,
              onComplete: () => {
                gsap.to(heroWidthRef.current, {
                  width: 0, stagger: 1, ease,
                  scrollTrigger: {
                    trigger: containerRef.current,
                    start: "30% top", end: "+=10%", scrub: true,
                  },
                });
              },
            }, "<");

            ctx.add(() => () => {
              titleSplit.revert();
              descSplit.revert();
              descLargeSplit.revert();
              linkSplit.revert();
            });
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  return (
    <section ref={sectionRef} className="px relative min-h-svh bg-primary" id="#">
      <Navbar />
      <div ref={containerRef} className="hero">
        <div data-speed="1.1" className="relative w-full flex md:pt-10 pt-80 pb-6 md:pb-12">
          <div className="relative w-full flex justify-end">
            <h1
              className="heading gsap-hide large text-4xl md:text-[5rem] text-right leading-tight text-transparent"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              role="heading"
              aria-level={1}
              aria-label="I am SoftLifeX Developer & Designer"
            >
              I am SoftLifeX <br /> Developer &amp; Designer <br />
            </h1>

            <div
              ref={revealRef}
              className="w-full reveal hidden md:block pointer-events-none absolute inset-0 leading-tight text-4xl md:text-[5rem] z-10 bg-primary text-end text-foreground"
              style={{
                opacity: hovered ? 1 : 0,
                transition: "opacity 0s ease",
                willChange: "clip-path",
              }}
              aria-hidden="true"
            >
              Building Products People Actually Want To Click
            </div>

            <div
              ref={blockRef}
              className="gsap-hide absolute w-0 h-full top-0 right-0 pointer-events-none bg-foreground"
            />
          </div>
        </div>

        <div className="pb-6">
          <div className="relative w-fit">
            <p className="description relative gsap-hide text-sm text-foreground">
              I&apos;m Daniel, Known online as softlifeX. <br />
              Currently based in Lagos, Nigeria <br />
            </p>
            <p className="description-large gsap-hide text-foreground text-xl md:text-3xl">
              Building digital products since 2022
            </p>
            <div
              ref={blockRef2}
              className="gsap-hide absolute w-0 h-full top-0 right-0 pointer-events-none bg-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full items-start md:justify-center md:items-center">
          <div className="relative w-fit">
            <div className="link-container gsap-hide relative flex flex-col md:flex-row items-start md:justify-center md:items-center w-full gap-4">
              <Link
                href="/contact"
                className="link relative inline-block text-sm text-primary-foreground group"
              >
                <span className="relative block h-[1.2em] overflow-hidden z-10">
                  <span className="herolink block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-8">
                    Start A Conversation
                  </span>
                  <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
                    Start A Conversation
                  </span>
                </span>
                <span
                  ref={heroWidthRef}
                  className="absolute left-0 right-0 -bottom-px h-px bg-current z-0 origin-left scale-x-100 transition-transform duration-500 ease-(--ease-custom) group-hover:origin-right group-hover:scale-x-0"
                />
              </Link>

              <Link
                href="/resume.pdf"
                target="_blank"
                download
                className="link relative inline-block text-sm text-primary-foreground group"
              >
                <span className="relative block h-[1.2em] overflow-hidden z-10">
                  <span className="herolink block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-8">
                    Resume
                  </span>
                  <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
                    Resume
                  </span>
                </span>
                <span className="absolute left-0 right-0 -bottom-px h-px bg-current z-0 origin-right scale-x-0 transition-transform duration-500 ease-(--ease-custom) group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            </div>
            <div
              ref={blockRef3}
              className="gsap-hide absolute w-0 h-full top-0 right-0 pointer-events-none bg-foreground"
            />
          </div>
        </div>
      </div>
    </section>
  );
}