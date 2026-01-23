"use client";
import { useEffect, useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, SplitText);

// Extend CSSStyleDeclaration for WebKit properties
interface ExtendedCSSProperties extends CSSStyleDeclaration {
  WebkitClipPath?: string;
}

export default function Intro() {
  const introRevealRef = useRef<HTMLDivElement | null>(null);
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const introSectionRef = useRef<HTMLDivElement | null>(null);
  const introBlockRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollTriggersRef = useRef<any[]>([]);

  const easedRadiusRef = useRef(0);
  const mouseMoveRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const maskActiveRef = useRef(false);

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


  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMove = (e: MouseEvent) => {
      if (Math.abs(e.movementX) > 0 || Math.abs(e.movementY) > 0) {
        mouseMoveRef.current = true;
      }

      // Throttle: only process every 16ms (~60fps)
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

    // Restart RAF if it was stopped
    if (!rafRef.current) {
      const el = introRevealRef.current;
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

    // Restart RAF if it was stopped (to animate back to 0)
    if (!rafRef.current) {
      const el = introRevealRef.current;
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


  useEffect(() => {
    const el = introRevealRef.current;
    if (!el) return;

    const tick = () => {
      const { x, y } = cursorPosRef.current;

      const rect = el.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;

      // Ease radius only
      const targetRadius = maskActiveRef.current ? 195 : 0;

      // If reduced motion, snap instantly instead of easing

        // different easing for enter vs exit
        const ease = maskActiveRef.current ? 0.18 : 0.35;
        easedRadiusRef.current += (targetRadius - easedRadiusRef.current) * ease;

        if (Math.abs(easedRadiusRef.current - targetRadius) < 0.01) {
          easedRadiusRef.current = targetRadius;
        }
      

      const clipPath = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
      el.style.clipPath = clipPath;
      (el.style as ExtendedCSSProperties).WebkitClipPath = clipPath;

      // Only continue RAF if we're still animating (not at target yet)
      // OR if the mask is active (so cursor position updates)
      if (Math.abs(easedRadiusRef.current - targetRadius) > 0.01 || maskActiveRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Stop RAF when animation is complete and mask is inactive
        rafRef.current = null;
      }
    };

    // Start the loop
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
          const currentY = window.scrollY;
          if (currentY !== lastY) {
            maskActiveRef.current = false;
            mouseMoveRef.current = false;
            setHovered(false);
          }
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      // If user prefers reduced motion, show everything immediately and skip animations
      if (prefersReducedMotion) {
        gsap.set([".about", ".intro", ".subtitle"], {
          opacity: 1,
          yPercent: 0,
        });
        gsap.set(widthRef.current, {
          width: "100%",
        });
        return;
      }

      const ctx = gsap.context(() => {
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
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });

        // intro animations
        const introTitleSplit = new SplitText(".intro", {
          type: "chars, words, lines",
          linesClass: "line",
        });

        gsap.from(introTitleSplit.words, {
          opacity: 0,
          ease,
          stagger: 0.02,
          scrollTrigger: {
            trigger: ".intro",
            start: "top 90%",
            end: "bottom top",
            scrub: true,
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });

        gsap.fromTo(
          introBlockRef.current,
          {
            width: "0%",
            left: "0%",
          },
          {
            width: "100%",
            duration: 0.5,
            ease,
            scrollTrigger: {
              trigger: ".subtitle",
              start: "top 90%",
              toggleActions: "play none none none",
              onEnter: (self) => scrollTriggersRef.current.push(self),
            },
            onComplete: () => {
              gsap.to(introBlockRef.current, {
                width: 0,
                left: "100%",
                duration: 0.4,
                ease,
                onComplete: () => {
                  gsap.to(".subtitle", {
                    opacity: 1,
                    duration: 0.1,
                    ease,
                  });
                }
              });
            },
          }
        );

        gsap.from(widthRef.current, {
          width: 0,
          stagger: 1,
          ease,
          clearProps: "transform",
          scrollTrigger: {
            trigger: ".subtitle",
            start: "top 80%",
            end: "top 60%",
            scrub: true,
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });

        // Cleanup function
        return () => {
          introTitleSplit.revert();
          aboutSplit.revert();

          // Kill all ScrollTriggers
          scrollTriggersRef.current.forEach(st => st.kill());
          scrollTriggersRef.current = [];
        };
      }, introSectionRef);

      return () => {
        ctx.revert();
        // Extra cleanup - kill any remaining ScrollTriggers
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger?.closest('.intro-section')) {
            st.kill();
          }
        });
      };
    },
    { scope: introSectionRef }
  );

  return (
    <section
      ref={introSectionRef}
      className="intro-section relative py px"
    >
      <div className=" relative w-fit">
        <div className="relative w-fit group">
          <p
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
      <div className="flex justify-end-safe w-full pt-4 pb-3 md:pb-12 text-sm text-primary-foreground">
        <p className="about text-end">
          Asides from the &ldquo;generic&ldquo; slab of text you&apos;re about to read,
          <br /> i&apos;m just a chill guy, I like traveling, learning new things,
          <br /> I enjoy the peace and quiet but will opt for the occasional
          chaos at times.
          <br />
          ohh and most importantly, i&apos;m obsessed with sweets
        </p>
      </div>
      <div className="relative w-full flex justify-start">
        <p
          className="intro large text-3xl md:text-8xl w-full text-foreground"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          I&apos;m an award winning Full-stack & Mobile Software
          Engineer and designer, with 4 years of experience focused on crafting
          high quality digital & immersive experiences
        </p>

        {/* ALWAYS mounted */}
        <div
          ref={introRevealRef}
          id="about"
          className="hidden md:block pointer-events-none absolute inset-0 text-3xl md:text-8xl z-10 bg-background"
          style={{
            opacity: hovered ? 1 : 0,
            transition: "opacity 0s ease",
            willChange: "clip-path",
          }}
        >
          A Developer who&apos;s skills haven&apos;t been replaced by chatGPT - (&ldquo;yet&ldquo;), specialized in motion design, I
          make stuff MOVE!  - only when you pay me enough... Or bribe me with sweets
        </div>
      </div>
    </section>
  );
}