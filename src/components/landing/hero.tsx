"use client";
import { useEffect, useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
import Navbar from "../shared/nav";
import { usePreloaderDone } from "@/components/shared/preloader-wrapper";

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, SplitText);

// Extend CSSStyleDeclaration for WebKit properties
interface ExtendedCSSProperties extends CSSStyleDeclaration {
  WebkitClipPath?: string;
}

export default function Hero() {
  const revealRef = useRef<HTMLDivElement | null>(null);
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blockRef = useRef<HTMLDivElement | null>(null);
  const blockRef2 = useRef<HTMLDivElement | null>(null);
  const blockRef3 = useRef<HTMLDivElement | null>(null);
  const heroWidthRef = useRef<HTMLDivElement | null>(null);

  const easedRadiusRef = useRef(0);
  const mouseMoveRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const maskActiveRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollTriggersRef = useRef<any[]>([]);

  // Listen to CustomCursor position
  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y } = (e as CustomEvent).detail;
      cursorPosRef.current.x = x;
      cursorPosRef.current.y = y;
    };

    window.addEventListener("custom-cursor-move", handler);
    return () => window.removeEventListener("custom-cursor-move", handler);
  }, []);

  // Mouse move tracker for conditional mask
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMove = (e: MouseEvent) => {
      if (Math.abs(e.movementX) > 0 || Math.abs(e.movementY) > 0) {
        mouseMoveRef.current = true;
      }

      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeoutId = null as any;
      }, 16);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Conditional hover
  const handleMouseEnter = () => {
    if (!mouseMoveRef.current) return;
    maskActiveRef.current = true;
    setHovered(true);

    if (!rafRef.current) {
      const el = revealRef.current;
      if (!el) return;

      const tick = () => {
        const { x, y } = cursorPosRef.current;
        const rect = el.getBoundingClientRect();
        const localX = x - rect.left;
        const localY = y - rect.top;
        const targetRadius = maskActiveRef.current ? 195 : 0;

        const ease = maskActiveRef.current ? 0.19 : 0.35;
        easedRadiusRef.current += (targetRadius - easedRadiusRef.current) * ease;

        if (Math.abs(easedRadiusRef.current - targetRadius) < 0.01) {
          easedRadiusRef.current = targetRadius;
        }

        const clipPath = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
        el.style.clipPath = clipPath;
        (el.style as ExtendedCSSProperties).WebkitClipPath = clipPath;

        if (Math.abs(easedRadiusRef.current - targetRadius) > 0.01 || maskActiveRef.current) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      };
      tick();
    }
  };

  const handleMouseLeave = () => {
    maskActiveRef.current = false;
    setHovered(false);

    if (!rafRef.current) {
      const el = revealRef.current;
      if (!el) return;

      const tick = () => {
        const { x, y } = cursorPosRef.current;
        const rect = el.getBoundingClientRect();
        const localX = x - rect.left;
        const localY = y - rect.top;
        const targetRadius = maskActiveRef.current ? 195 : 0;

        const ease = maskActiveRef.current ? 0.19 : 0.35;
        easedRadiusRef.current += (targetRadius - easedRadiusRef.current) * ease;

        if (Math.abs(easedRadiusRef.current - targetRadius) < 0.01) {
          easedRadiusRef.current = targetRadius;
        }

        const clipPath = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
        el.style.clipPath = clipPath;
        (el.style as ExtendedCSSProperties).WebkitClipPath = clipPath;

        if (Math.abs(easedRadiusRef.current - targetRadius) > 0.01 || maskActiveRef.current) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      };
      tick();
    }
  };

  // Clip-path loop (reads from CustomCursor)
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const tick = () => {
      const { x, y } = cursorPosRef.current;

      const rect = el.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;

      const targetRadius = maskActiveRef.current ? 195 : 0;
      const ease = maskActiveRef.current ? 0.18 : 0.35;

      easedRadiusRef.current += (targetRadius - easedRadiusRef.current) * ease;

      if (Math.abs(easedRadiusRef.current - targetRadius) < 0.01) {
        easedRadiusRef.current = targetRadius;
      }

      const clipPath = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
      el.style.clipPath = clipPath;
      (el.style as ExtendedCSSProperties).WebkitClipPath = clipPath;

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY !== lastY) {
            maskActiveRef.current = false;
            mouseMoveRef.current = false;
            setHovered(false);
          }
          lastY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const preloaderDone = usePreloaderDone();
  // GSAP Animations
  useGSAP(
    () => {
      if (!preloaderDone) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      gsap.set(
        [
          ".heading",
          ".description",
          ".description-large",
          ".link-container",
          blockRef3.current,
          blockRef.current,
          blockRef2.current,
        ],
        { visibility: "visible" }
      );

      if (prefersReducedMotion) {
        gsap.set(
          [".heading", ".description", ".description-large", ".link-container"],
          { opacity: 1, yPercent: 0, xPercent: 0 }
        );
        gsap.set([blockRef.current, blockRef2.current, blockRef3.current], { width: 0 });
        // Dispatch immediately for reduced motion
        window.dispatchEvent(new CustomEvent("hero-animations-complete"));
        return;
      }

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            tl.kill();
            // ← Dispatch event so MobileExperiencePopup knows hero is done
            window.dispatchEvent(new CustomEvent("hero-animations-complete"));
          },
        });

        tl.fromTo(
          blockRef.current,
          { width: "0%", right: "0%" },
          {
            width: "100%",
            duration: 1,
            ease,
            onComplete: () => {
              gsap.to(blockRef.current, { width: 0, right: "100%", duration: 0.4, ease });
            },
          },
          0.4
        );

        tl.fromTo(
          blockRef2.current,
          { width: "0%", left: "0%" },
          {
            width: "100%",
            duration: 1,
            ease,
            onComplete: () => {
              gsap.to(blockRef2.current, { width: 0, left: "100%", duration: 0.4, ease });
            },
          },
          0.4
        );

        tl.fromTo(
          blockRef3.current,
          { width: "0%", left: "0%" },
          {
            width: "100%",
            duration: 1,
            ease,
            onComplete: () => {
              gsap.to(blockRef3.current, { width: 0, left: "100%", duration: 0.4, ease });
            },
          },
          0.4
        );

        const titleSplit = new SplitText(".heading", {
          type: "chars, words",
          mask: "chars",
          wordsClass: "heading++",
        });

        gsap.set(titleSplit.chars, { xPercent: 100, opacity: 0 });

        tl.to(titleSplit.chars, {
          xPercent: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.6,
          ease,
          onComplete: () => {
            gsap.set(titleSplit.words, { yPercent: 0, opacity: 1 });
            gsap.to(titleSplit.words, {
              yPercent: -50,
              opacity: 0,
              stagger: 0.05,
              ease,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "30% top",
                end: "+=10%",
                scrub: true,
                onEnter: (self) => scrollTriggersRef.current.push(self),
              },
            });
          },
        });

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

        gsap.set([descSplit.words, descLargeSplit.words], { yPercent: 100, opacity: 0 });

        tl.to(
          descSplit.words,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease,
            onComplete: () => {
              gsap.set(descSplit.words, { yPercent: 0, opacity: 1 });
              gsap.to(descSplit.words, {
                yPercent: -50,
                opacity: 0,
                stagger: 0.2,
                ease,
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: "30% top",
                  end: "+=10%",
                  scrub: true,
                  onEnter: (self) => scrollTriggersRef.current.push(self),
                },
              });
            },
          },
          "<"
        );

        tl.to(
          descLargeSplit.words,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease,
            onComplete: () => {
              gsap.set(descLargeSplit.words, { yPercent: 0, opacity: 1 });
              gsap.to(descLargeSplit.words, {
                yPercent: -50,
                opacity: 0,
                stagger: 0.2,
                ease,
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: "30% top",
                  end: "+=10%",
                  scrub: true,
                  onEnter: (self) => scrollTriggersRef.current.push(self),
                },
              });
            },
          },
          "<0.2"
        );

        const linkSplit = new SplitText(".herolink", {
          type: "words, lines",
          mask: "lines",
        });

        gsap.set(linkSplit.words, { yPercent: 100, opacity: 0 });

        tl.to(
          linkSplit.words,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease,
            onComplete: () => {
              gsap.set(linkSplit.words, { yPercent: 0, opacity: 1 });
              gsap.to(linkSplit.words, {
                yPercent: -50,
                opacity: 0,
                stagger: 0.2,
                ease,
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: "30% top",
                  end: "+=10%",
                  scrub: true,
                  onEnter: (self) => scrollTriggersRef.current.push(self),
                },
              });
            },
          },
          "<"
        );

        gsap.set(heroWidthRef.current, { width: 0 });

        tl.to(
          heroWidthRef.current,
          {
            width: "100%",
            stagger: 1,
            ease,
            onComplete: () => {
              gsap.to(heroWidthRef.current, {
                width: 0,
                stagger: 1,
                ease,
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: "30% top",
                  end: "+=10%",
                  scrub: true,
                  onEnter: (self) => scrollTriggersRef.current.push(self),
                },
              });
            },
          },
          "<"
        );

        return () => {
          titleSplit.revert();
          descSplit.revert();
          descLargeSplit.revert();
          linkSplit.revert();
          scrollTriggersRef.current.forEach((st) => st.kill());
          scrollTriggersRef.current = [];
        };
      }, sectionRef);

      return () => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((st) => {
          if (
            st.trigger === sectionRef.current ||
            st.trigger === containerRef.current
          ) {
            st.kill();
          }
        });
      };
    },
    { scope: sectionRef, dependencies: [preloaderDone] }
  );

  return (
    <section
      ref={sectionRef}
      className="px relative min-h-svh bg-primary"
      id="#"
    >
      <Navbar />
      <div ref={containerRef} className="hero">
        <div
          data-speed="1.1"
          className="relative w-full flex md:pt-10 pt-80 pb-6 md:pb-12"
        >
          <div className="relative w-full flex justify-end">
            <h1
              className="heading gsap-hide large text-4xl md:text-8xl text-right leading-tight text-transparent"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              role="heading"
              aria-level={1}
              aria-label="I am SoftLifeX Developer & Designer"
            >
              I am SoftLifeX <br /> Developer &amp; Designer
              <br />
            </h1>

            {/* Mask text - reveal on hover */}
            <div
              ref={revealRef}
              className="w-full reveal hidden md:block pointer-events-none absolute inset-0 leading-tight text-4xl md:text-8xl z-10 bg-primary text-end text-foreground"
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