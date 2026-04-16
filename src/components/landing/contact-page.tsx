"use client";
import { useEffect, useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {Fragment} from "react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface ExtendedCSSProperties extends CSSStyleDeclaration {
  WebkitClipPath?: string;
}

const YEAR = new Date().getFullYear();

export default function Contact() {
  const contactRevealRef = useRef<HTMLDivElement | null>(null);
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contactWidthRef = useRef<HTMLSpanElement | null>(null);
  const marqueRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const easedRadiusRef = useRef(0);
  const mouseMoveRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const maskActiveRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollTriggersRef = useRef<any[]>([]);

  // Custom cursor sync
  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y } = (e as CustomEvent).detail;
      cursorPosRef.current.x = x;
      cursorPosRef.current.y = y;
    };
    window.addEventListener("custom-cursor-move", handler);
    return () => window.removeEventListener("custom-cursor-move", handler);
  }, []);

  // Mouse move detection
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleMove = (e: MouseEvent) => {
      if (Math.abs(e.movementX) > 0 || Math.abs(e.movementY) > 0) mouseMoveRef.current = true;
      if (timeoutId) return;
      timeoutId = setTimeout(() => { timeoutId = null as unknown as NodeJS.Timeout; }, 16);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => { window.removeEventListener("mousemove", handleMove); if (timeoutId) clearTimeout(timeoutId); };
  }, []);

  // Reveal mask RAF
  useEffect(() => {
    const el = contactRevealRef.current;
    if (!el) return;

    const tick = () => {
      const { x, y } = cursorPosRef.current;
      const rect = el.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;
      const targetRadius = maskActiveRef.current ? 195 : 0;
      const ease = maskActiveRef.current ? 0.18 : 0.35;

      easedRadiusRef.current += (targetRadius - easedRadiusRef.current) * ease;
      if (Math.abs(easedRadiusRef.current - targetRadius) < 0.01) easedRadiusRef.current = targetRadius;

      const clipPath = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
      el.style.clipPath = clipPath;
      (el.style as ExtendedCSSProperties).WebkitClipPath = clipPath;

      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };
  }, []);

  // Reset mask on scroll
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY !== lastY) { maskActiveRef.current = false; mouseMoveRef.current = false; setHovered(false); }
          lastY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (!mouseMoveRef.current) return;
    maskActiveRef.current = true;
    setHovered(true);
  };

  const handleMouseLeave = () => {
    maskActiveRef.current = false;
    setHovered(false);
  };

  // Marquee animation
  useEffect(() => {
    const el = marqueRef.current;
    if (!el) return;
    gsap.to(el, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
  }, []);

  // GSAP scroll animations
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    gsap.set([".contact-heading", ".contact-sub", ".contact-links", footerRef.current], { visibility: "visible" });

    if (prefersReducedMotion) {
      gsap.set([".contact-heading", ".contact-sub", ".contact-links"], { opacity: 1, yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Main heading chars
      const contactSplit = new SplitText(".contact-heading", { type: "chars, words", mask: "chars" });
      gsap.set(contactSplit.chars, { xPercent: 100, opacity: 0 });

      gsap.to(contactSplit.chars, {
        xPercent: 0,
        opacity: 1,
        stagger: 0.04,
        duration: 1,
        ease,
        scrollTrigger: {
          trigger: contactSectionRef.current,
          start: "top 65%",
          end: "top 35%",
          scrub: true,
          onEnter: (self) => scrollTriggersRef.current.push(self),
        },
      });

      // Sub text
      const subSplit = new SplitText(".contact-sub", { type: "words, lines", mask: "lines" });
      gsap.set(subSplit.words, { yPercent: 100, opacity: 0 });

      gsap.to(subSplit.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 55%",
          end: "top 30%",
          scrub: true,
          onEnter: (self) => scrollTriggersRef.current.push(self),
        },
      });

      // Contact links
      const linkSplit = new SplitText(".contact-link-text", { type: "words, lines", mask: "lines" });
      gsap.set(linkSplit.words, { yPercent: 100, opacity: 0 });

      gsap.to(linkSplit.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
          end: "top 25%",
          scrub: true,
          onEnter: (self) => scrollTriggersRef.current.push(self),
        },
      });

      // Underline
      gsap.set(contactWidthRef.current, { width: 0 });
      gsap.to(contactWidthRef.current, {
        width: "100%",
        ease,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
          end: "top 25%",
          scrub: true,
          onEnter: (self) => scrollTriggersRef.current.push(self),
        },
      });

      // Footer fade up
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            end: "top 70%",
            scrub: true,
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        }
      );

      return () => {
        contactSplit.revert();
        subSplit.revert();
        linkSplit.revert();
        scrollTriggersRef.current.forEach((st) => st.kill());
        scrollTriggersRef.current = [];
      };
    }, contactSectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === contactSectionRef.current || st.trigger === containerRef.current) st.kill();
      });
    };
  }, { scope: contactSectionRef });

  return (
    <section
      ref={contactSectionRef}
      id="contact"
      className="relative bg-foreground font-light overflow-hidden"
    >
      {/* Marquee ticker — decorative */}
      <div className="relative overflow-hidden border-b border-background/10 py-3" aria-hidden="true">
        <div ref={marqueRef} className="flex gap-12 whitespace-nowrap w-max">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12">
              {["Available for work", "Open to collaboration", "Lagos, Nigeria", "Let's build something", "daniel.c.daniel.dev@gmail.com"].map((t) => (
                <span key={t} className="text-background/25 text-xs tracking-[0.25em] uppercase">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main CTA block */}
      <div ref={containerRef} className="px py contact flex flex-col items-center justify-center min-h-[90svh]">

        {/* Eyebrow */}
        <p className="contact-sub gsap-hide text-[10px] tracking-[0.4em] text-background/30 uppercase mb-6 text-center">
          get in touch
        </p>

        {/* Headline */}
        <div className="relative w-full flex justify-center">
          <h2
            className="contact-heading gsap-hide large text-4xl md:text-8xl text-center leading-tight text-background"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="It all starts with a conversation"
          >
            It all starts with<br />a conversation.
          </h2>

          {/* Hover reveal layer */}
          <div
            ref={contactRevealRef}
            className="contact-reveal hidden md:flex pointer-events-none absolute inset-0 leading-tight text-4xl md:text-8xl z-10 bg-foreground text-center items-center justify-center text-background"
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 0s ease",
              willChange: "clip-path",
            }}
            aria-hidden="true"
          >
            Just say hello —<br />it&apos;s not that deep.
          </div>
        </div>

        {/* Sub copy */}
        <p className="contact-sub gsap-hide text-sm text-background/45 max-w-md text-center mt-6 leading-relaxed">
          Whether you have a project in mind, a question, or just want to connect — the door is always open.
        </p>

        {/* CTA Links */}
        <div className="contact-links gsap-hide mt-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">

          {/* Primary CTA */}
          {/* Primary CTA */}
          <Link
            href="mailto:daniel.c.daniel.dev@gmail.com"
            className="cta-primary group relative inline-flex items-center gap-3 px-8 py-4 border border-background/20 text-background text-sm tracking-wide hover:border-background/60 transition-colors duration-500 overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="cta-fill absolute inset-0 bg-background"
            />

            <span className="relative z-10 block h-[1.2em] overflow-hidden">
              <span className="contact-link-text block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full group-hover:text-foreground">
                Send an email
              </span>
              <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full group-hover:text-foreground">
                Send an email
              </span>
            </span>

            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground"
            >
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Secondary — phone */}
          <Link
            href="tel:+2348139331585"
            className="link relative inline-block text-sm text-background group"
          >
            <span className="relative block h-[1.2em] overflow-hidden z-10">
              <span className="contact-link-text block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
                +234 813 933 1585
              </span>
              <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
                +234 813 933 1585
              </span>
            </span>
            <span
              ref={contactWidthRef}
              className="absolute left-0 right-0 -bottom-px h-px bg-current z-0"
            />
          </Link>
        </div>

        {/* Social row */}
        <div className="contact-sub gsap-hide mt-10 flex items-center gap-2">
          {[
            { label: "GitHub", href: "https://github.com/SoftLifeX" },
            { label: "LinkedIn", href: "https://linkedin.com/in/daniel-c-daniel-dev" },
          ].map(({ label, href }, i, arr) => (
            <Fragment key={label}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/30 text-xs tracking-[0.2em] uppercase hover:text-background/70 transition-colors duration-300 px-3"
              >
                {label}
              </Link>
              {i < arr.length - 1 && (
                <span className="text-background/15 text-xs" aria-hidden="true">·</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer

        className="gsap-hide px border-t border-background/10"
        style={{ visibility: "visible", opacity: 1 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          <p className="text-background/25 text-xs tracking-[0.16em]">
            © {YEAR} Daniel — The Only One Softlife. All rights and lefts reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-background/15 text-xs tracking-widest uppercase">Designed &amp; Built in Lagos</span>
            <span className="w-px h-3 bg-background/15 hidden sm:block" />
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
        </div>
      </footer>
    </section>
  );
}