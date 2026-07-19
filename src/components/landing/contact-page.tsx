"use client";

import { useEffect, useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "@/lib/gsap-init";
import { Fragment } from "react";
import Link from "next/link";
import { useRevealMask } from "@/hooks/useRevealMask";
import { usePageReady } from "@/hooks/usePageReady";
import { useGsapScope } from "@/hooks/useGsapScope";
import { EASE } from "@/lib/animations/tokens";
import Magnetic from "../magnetic";

const YEAR = new Date().getFullYear();

export default function Contact() {
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contactWidthRef = useRef<HTMLSpanElement | null>(null);
  const marqueRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const ready = usePageReady();

  const { revealRef, hovered, handleMouseEnter, handleMouseLeave } = useRevealMask();

  const [ctaPos, setCtaPos] = useState({ x: 50, y: 50 });
  const [ctaHovered, setCtaHovered] = useState(false);

  const handleCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCtaPos({ x, y });
  };

  useEffect(() => {
    const el = marqueRef.current;
    if (!el) return;
    const tween = gsap.to(el, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
    return () => { tween.kill(); };
  }, []);

  useGsapScope(contactSectionRef, {
    ready,

    reducedMotionFallback: () => {
      gsap.set([".contact-heading", ".contact-sub", ".contact-links", footerRef.current], {
        visibility: "visible",
        opacity: 1,
        yPercent: 0,
      });
      gsap.set(contactWidthRef.current, { width: "100%" });
    },

    animate: () => {
      gsap.set([contactWidthRef.current, footerRef.current], { visibility: "visible" });

      gsap.set(contactWidthRef.current, { width: 0 });
      gsap.to(contactWidthRef.current, {
        width: "100%",
        ease: EASE,
        scrollTrigger: { trigger: containerRef.current, start: "top 50%", end: "top 25%", scrub: true },
      });

      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: EASE,
          scrollTrigger: { trigger: footerRef.current, start: "top 90%", end: "top 70%", scrub: true },
        }
      );
    },

    animateWithSplitText: (ctx) => {
      gsap.set([".contact-heading", ".contact-sub", ".contact-links"], { visibility: "visible" });

      const contactSplit = new SplitText(".contact-heading", { type: "chars, words", mask: "chars" });
      gsap.set(contactSplit.chars, { xPercent: 100, opacity: 0 });
      gsap.to(contactSplit.chars, {
        xPercent: 0,
        opacity: 1,
        stagger: 0.04,
        duration: 1,
        ease: EASE,
        scrollTrigger: { trigger: contactSectionRef.current, start: "top 65%", end: "top 35%", scrub: true },
      });

      const subSplit = new SplitText(".contact-sub", { type: "words, lines", mask: "lines" });
      gsap.set(subSplit.words, { yPercent: 100, opacity: 0 });
      gsap.to(subSplit.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: EASE,
        scrollTrigger: { trigger: containerRef.current, start: "top 55%", end: "top 30%", scrub: true },
      });

      const linkSplit = new SplitText(".contact-link-text", { type: "words, lines", mask: "lines" });
      gsap.set(linkSplit.words, { yPercent: 100, opacity: 0 });
      gsap.to(linkSplit.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: EASE,
        scrollTrigger: { trigger: containerRef.current, start: "top 50%", end: "top 25%", scrub: true },
      });

      ctx.add(() => () => {
        contactSplit.revert();
        subSplit.revert();
        linkSplit.revert();
      });
    },
  });

  return (
    <section ref={contactSectionRef} id="contact" className="relative bg-foreground font-light overflow-hidden">
      <div ref={containerRef} className="px py contact flex flex-col items-center justify-center min-h-[90svh]">
        <p className="contact-sub gsap-hide text-[10px] tracking-[0.4em] text-background/30 uppercase mb-6 text-center">
          get in touch
        </p>

        <div className="relative w-full flex justify-center">
          <h2
            className="contact-heading gsap-hide large text-3xl md:text-[5rem] text-center leading-tight text-background"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="It all starts with a conversation"
          >
            It all starts with<br />a conversation.
          </h2>

          <div
            ref={revealRef}
            className="contact-reveal hidden md:flex pointer-events-none absolute inset-0 leading-tight text-4xl md:text-[5rem] z-10 bg-foreground text-center items-center justify-center text-background"
            style={{ opacity: hovered ? 1 : 0, transition: "opacity 0s ease", willChange: "clip-path" }}
            aria-hidden="true"
          >
            Just say hello, <br />it&apos;s not that deep.
          </div>
        </div>

        <p className="contact-sub gsap-hide text-sm text-background/45 max-w-md text-center mt-6 leading-relaxed">
          Whether you have a project in mind, a question, or just want to connect — the door is always open.
        </p>

        <div className="contact-links gsap-hide mt-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <Magnetic strength={0} tiltStrength={8}>
            <Link
              href="mailto:daniel.c.daniel.dev@gmail.com"
              onMouseEnter={(e) => {
                handleCtaMove(e);
                setCtaHovered(true);
              }}
              onMouseMove={handleCtaMove}
              onMouseLeave={() => setCtaHovered(false)}
              className="link cta-primary group relative inline-flex items-center gap-3 px-8 py-4 border border-primary-foreground text-primary-foreground text-sm tracking-wide hover:border-background/60 transition-colors duration-500 overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="cta-fill absolute inset-0 bg-background"
                style={{
                  clipPath: `circle(${ctaHovered ? 150 : 0}% at ${ctaPos.x}% ${ctaPos.y}%)`,
                  opacity: ctaHovered ? 1 : 0,
                  transition: "clip-path 0.4s var(--ease-custom), opacity 0.4s var(--ease-custom)",
                }}
              />
              <span className="relative z-10 block h-[1.2em] overflow-hidden">
                <span className="contact-link-text block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full group-hover:text-foreground">
                  Send an email
                </span>
                <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-[90%] group-hover:text-foreground">
                  Send an email
                </span>
              </span>
              <span className="relative z-10 w-3.5 h-3.5 shrink-0 overflow-hidden">
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className="absolute inset-0 transition-transform duration-300 ease-(--ease-custom) group-hover:translate-x-4.5 group-hover:-translate-y-4.5 group-hover:text-foreground"
                >
                  <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className="absolute inset-0 -translate-x-4.5 translate-y-4.5 transition-transform duration-300 ease-(--ease-custom) group-hover:translate-x-0 group-hover:translate-y-0 group-hover:delay-150 group-hover:text-foreground"
                >
                  <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </Magnetic>
          <Link href="/resume.pdf" target="_blank" download className="link relative inline-block text-sm text-background group">
            <span className="relative block h-[1.2em] overflow-hidden z-10">
              <span className="contact-link-text block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
                Resume
              </span>
              <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-[85%]">
                Resume
              </span>
            </span>
            <span ref={contactWidthRef} className="gsap-hide absolute left-0 right-0 -bottom-px h-px bg-current z-0" />
          </Link>
        </div>

        <div className="link contact-sub gsap-hide mt-10 flex items-center gap-2">
          {[
            { label: "GitHub", href: "https://github.com/SoftLifeX" },
            { label: "LinkedIn", href: "https://linkedin.com/in/daniel-c-daniel-dev" },
          ].map(({ label, href }, i, arr) => (
            <Fragment key={label}>
              <Link href={href} target="_blank" rel="noopener noreferrer"
                className="text-background/30 text-xs tracking-[0.2em] uppercase hover:text-background/70 transition-colors duration-300 px-3">
                {label}
              </Link>
              {i < arr.length - 1 && <span className="text-background/15 text-xs" aria-hidden="true">·</span>}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}