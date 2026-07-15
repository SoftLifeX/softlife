"use client";

import { useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "@/lib/gsap-init";
import Link from "next/link";
import Navbar from "../shared/nav";
import { usePageReady } from "@/hooks/usePageReady";
import { useRevealMask } from "@/hooks/useRevealMask";
import { useGsapScope } from "@/hooks/useGsapScope";
import { EASE } from "@/lib/animations/tokens";
import { AnchorLink } from "../shared/anchor-link";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blockRef = useRef<HTMLDivElement | null>(null);
  const blockRef2 = useRef<HTMLDivElement | null>(null);
  const blockRef3 = useRef<HTMLDivElement | null>(null);
  const heroWidthRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const ctaLinkRef = useRef<HTMLAnchorElement | null>(null);
  const ctaIconRef = useRef<HTMLSpanElement | null>(null);

  const { revealRef, hovered, handleMouseEnter, handleMouseLeave } = useRevealMask();
  const ready = usePageReady();

  const interactionsReady = useRef(false);

  const [ctaPos, setCtaPos] = useState({ x: 50, y: 50 });
  const [ctaHovered, setCtaHovered] = useState(false);

  const handleCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCtaPos({ x, y });
  };

  const onHeadingEnter = () => {
    if (!interactionsReady.current) return;
    handleMouseEnter();
  };
  const onHeadingLeave = () => {
    if (!interactionsReady.current) return;
    handleMouseLeave();
  };

  let blocksSweepDone: Promise<void> = Promise.resolve();

  useGsapScope(sectionRef, {
    ready,

    reducedMotionFallback: () => {
      gsap.set(
        [".heading", ".description", ".description-large", ".link-container"],
        { visibility: "visible", opacity: 1, yPercent: 0, xPercent: 0 }
      );
      gsap.set([blockRef.current, blockRef2.current, blockRef3.current], {
        visibility: "visible",
        width: 0,
      });
      
      gsap.set([ctaLinkRef.current, ctaIconRef.current], { opacity: 1 });
      gsap.set(headingRef.current, { pointerEvents: "auto" });
      interactionsReady.current = true;
      window.dispatchEvent(new CustomEvent("hero-animations-complete"));
    },

    animate: () => {
      gsap.set([blockRef.current, blockRef2.current, blockRef3.current], {
        visibility: "visible",
      });

      gsap.set(headingRef.current, { pointerEvents: "none" });

      const wipeConfigs: Array<{
        el: HTMLElement | null;
        from: gsap.TweenVars;
        exitTo: gsap.TweenVars;
      }> = [
          { el: blockRef.current, from: { width: "0%", right: "0%" }, exitTo: { width: 0, right: "100%" } },
          { el: blockRef2.current, from: { width: "0%", left: "0%" }, exitTo: { width: 0, left: "100%" } },
          { el: blockRef3.current, from: { width: "0%", left: "0%" }, exitTo: { width: 0, left: "100%" } },
        ];

      const promises = wipeConfigs.map(({ el, from, exitTo }) => {
        if (!el) return Promise.resolve();
        return new Promise<void>((resolve) => {
          gsap.fromTo(el, from, {
            width: "100%",
            duration: 0.5,
            ease: EASE,
            delay: 0.4,
            onComplete: () => {
              gsap.to(el, { ...exitTo, duration: 0.4, ease: EASE, onComplete: () => resolve() });
            },
          });
        });
      });

      blocksSweepDone = Promise.all(promises).then(() => { });
    },

    animateWithSplitText: (ctx) => {
      gsap.set(
        [".heading", ".description", ".description-large", ".link-container"],
        { visibility: "visible" }
      );

      const titleSplit = new SplitText(".heading", {
        type: "chars, words",
        mask: "chars",
        wordsClass: "heading++",
      });
      gsap.set(titleSplit.chars, { xPercent: 100, opacity: 0 });

      new SplitText(".reveal", { type: "words", wordsClass: "reveal++" });

      const descSplit = new SplitText(".description", {
        type: "words, lines",
        wordsClass: "des++",
        mask: "lines",
      });
      const descLargeSplit = new SplitText(".description-large", {
        type: "words, lines",
        wordsClass: "des-large++",
        mask: "lines",
      });
      const linkSplit = new SplitText(".herolink", { type: "words, lines", mask: "lines" });

      gsap.set([descSplit.words, descLargeSplit.words, linkSplit.words], {
        yPercent: 100,
        opacity: 0,
      });

      gsap.set([ctaLinkRef.current, ctaIconRef.current], { opacity: 0 });
      gsap.set(heroWidthRef.current, { width: 0 });

      const scrollExit = (trigger: Element | null) => ({
        yPercent: -50,
        opacity: 0,
        stagger: 0.2,
        ease: EASE,
        scrollTrigger: { trigger, start: "30% top", end: "+=10%", scrub: true },
      });

      const scrollExitOpacityOnly = (trigger: Element | null) => ({
        opacity: 0,
        ease: EASE,
        scrollTrigger: { trigger, start: "30% top", end: "+=10%", scrub: true },
      });

      blocksSweepDone.then(() => {
        if (!sectionRef.current) return;

        interactionsReady.current = true;
        gsap.set(headingRef.current, { pointerEvents: "auto" });

        const tl = gsap.timeline({
          onComplete: () => {
            tl.kill();
            window.dispatchEvent(new CustomEvent("hero-animations-complete"));
          },
        });

        tl.to(titleSplit.chars, {
          xPercent: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.3,
          ease: EASE,
          onComplete: () => {
            gsap.to(titleSplit.words, {
              yPercent: -50,
              opacity: 0,
              stagger: 0.05,
              ease: EASE,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "30% top",
                end: "+=10%",
                scrub: true,
              },
            });
          },
        });

        (
          [
            [descSplit.words, containerRef.current, "<"],
            [descLargeSplit.words, containerRef.current, "<0.2"],
            [linkSplit.words, containerRef.current, "<"],
          ] as const
        ).forEach(([words, trigger, position]) => {
          tl.to(
            words as HTMLElement[],
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: EASE,
              onComplete: () => {
                gsap.set(words as HTMLElement[], { yPercent: 0, opacity: 1 });
                gsap.to(words as HTMLElement[], scrollExit(trigger));
              },
            },
            position
          );
        });

        tl.to(
          [ctaLinkRef.current, ctaIconRef.current],
          {
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: EASE,
            onComplete: () => {
              gsap.set([ctaLinkRef.current, ctaIconRef.current], { opacity: 1 });
              gsap.to(
                [ctaLinkRef.current, ctaIconRef.current],
                scrollExitOpacityOnly(containerRef.current)
              );
            },
          },
          "<"
        );

        tl.to(
          heroWidthRef.current,
          {
            width: "100%",
            ease: EASE,
            onComplete: () => {
              gsap.to(heroWidthRef.current, {
                width: 0,
                ease: EASE,
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: "30% top",
                  end: "+=10%",
                  scrub: true,
                },
              });
            },
          },
          "<"
        );
      });

      ctx.add(() => () => {
        titleSplit.revert();
        descSplit.revert();
        descLargeSplit.revert();
        linkSplit.revert();
      });
    },
  });

  return (
    <section ref={sectionRef} className="px relative md:min-h-svh min-h-[85svh] bg-primary" id="#">
      <Navbar />
      <div ref={containerRef} className="hero">
        <div data-speed="1.1" className="relative w-full flex md:items-end pt-40 md:pt-20 pb-6 md:pb-12">
          <div className="relative w-full flex justify-end">
            <h1
              ref={headingRef}
              className="heading gsap-hide large text-[2.4rem] md:text-[5rem] text-right leading-tight text-transparent"
              onMouseEnter={onHeadingEnter}
              onMouseLeave={onHeadingLeave}
              role="heading"
              aria-level={1}
              aria-label="I am Daniel. Developer & Designer"
            >
              Daniel c. Daniel. <br /> Developer &amp; Designer <br />
            </h1>

            <div
              ref={revealRef}
              className="w-full reveal hidden md:block pointer-events-none absolute inset-0 leading-tight text-[2.4rem] md:text-[5rem] z-10 bg-primary text-end text-foreground"
              style={{ opacity: hovered ? 1 : 0, transition: "opacity 0s ease", willChange: "clip-path" }}
              aria-hidden="true"
            >
              Building Products People Actually Want To Click
            </div>

            <div ref={blockRef} className="gsap-hide absolute w-0 h-full top-0 right-0 pointer-events-none bg-foreground" />
          </div>
        </div>

        <div className="pb-6">
          <div className="relative w-fit">
            <p className="description relative gsap-hide text-sm text-foreground">
              I&apos;m Daniel c. Daniel, Known online as softlifeX. <br />
              Currently based in Lagos, Nigeria <br />
            </p>
            <p className="description-large gsap-hide text-foreground text-xl md:text-2xl">
              Building digital products since 2022
            </p>
            <div ref={blockRef2} className="gsap-hide absolute w-0 h-full top-0 right-0 pointer-events-none bg-foreground" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full items-start md:justify-center md:items-center">
          <div className="relative w-fit">
            <div className="link-container gsap-hide relative flex flex-col md:flex-row items-start md:justify-center md:items-center w-full gap-4 mb-8 md:mb-0">
              <AnchorLink
                ref={ctaLinkRef}
                href="#contact"
                onMouseEnter={(e) => {
                  handleCtaMove(e);
                  setCtaHovered(true);
                }}
                onMouseMove={handleCtaMove}
                onMouseLeave={() => setCtaHovered(false)}
                className="link group relative inline-flex items-center gap-3 px-8 py-4 border border-primary-foreground text-primary-foreground text-sm tracking-wide hover:border-foreground transition-colors duration-500 overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-foreground"
                  style={{
                    clipPath: `circle(${ctaHovered ? 150 : 0}% at ${ctaPos.x}% ${ctaPos.y}%)`,
                    opacity: ctaHovered ? 1 : 0,
                    transition: "clip-path 0.4s var(--ease-custom), opacity 0.4s var(--ease-custom)",
                  }}
                />
                <span className="relative z-10 block h-[1.2em] overflow-hidden">
                  <span className="herolink block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
                    Start a conversation
                  </span>
                  <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full group-hover:text-background">
                    Start a conversation
                  </span>
                </span>
                <span
                  ref={ctaIconRef}
                  className="relative z-10 w-3.5 h-3.5 shrink-0 overflow-hidden rotate-135"
                >
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className="absolute inset-0 transition-transform duration-300 ease-(--ease-custom) group-hover:translate-x-4.5 group-hover:-translate-y-4.5 group-hover:text-foreground"
                  >
                    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className="absolute inset-0 -translate-x-4.5 translate-y-4.5 transition-transform duration-300 ease-(--ease-custom) group-hover:translate-x-0 group-hover:translate-y-0 group-hover:delay-150 group-hover:text-background"
                  >
                    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </AnchorLink>

              <Link href="/resume.pdf" target="_blank" download className="link relative inline-block text-sm text-primary-foreground group">
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
            <div ref={blockRef3} className="gsap-hide absolute w-0 h-full top-0 right-0 pointer-events-none bg-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}