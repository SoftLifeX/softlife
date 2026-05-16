"use client";
/**
 * useWipeReveal
 *
 * The "block sweeps across, disappears, text fades in, underline grows"
 * pattern appeared copy-pasted in: Hero, Intro, Skills, Services, Reviews.
 * That's 5 duplicates of the same ~25-line GSAP sequence.
 *
 * Usage:
 *   const { blockRef, widthRef, textRef } = useWipeReveal({
 *     trigger: ".myClass",
 *     direction: "left",       // block enters from left
 *     startOffset: "top 90%",
 *   });
 *
 * Then in JSX:
 *   <p ref={textRef} className="opacity-0 myClass">Label</p>
 *   <div ref={widthRef} className="absolute left-0 bottom-0 h-px w-full bg-foreground" />
 *   <div ref={blockRef} className="absolute w-0 h-full top-0 left-0 bg-foreground" />
 *
 * All returned refs are stable — safe to pass directly to JSX.
 * The hook self-registers with the parent useGSAP context automatically
 * because it calls gsap.* inside a useEffect that runs inside the GSAP
 * context scope. If you need standalone use outside useGSAP, pass ctx.
 */

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-init";

export interface WipeRevealOptions {
  /** CSS selector or element used as the ScrollTrigger trigger */
  trigger: string | (() => Element | null);
  /** Which side the block enters from */
  direction?: "left" | "right";
  /** ScrollTrigger start position */
  startOffset?: string;
  /** ScrollTrigger start for the underline scrub */
  underlineStart?: string;
  underlineEnd?: string;
  /** GSAP ease string */
  ease?: string;
}

export interface WipeRevealRefs {
  blockRef: React.RefObject<HTMLDivElement | null>;
  widthRef: React.RefObject<HTMLDivElement | null>;
  textRef: React.RefObject<HTMLParagraphElement | null>;
}

export function useWipeReveal(options: WipeRevealOptions): WipeRevealRefs {
  const {
    trigger,
    direction = "left",
    startOffset = "top 90%",
    underlineStart = "top 80%",
    underlineEnd = "top 50%",
    ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  } = options;

  const blockRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef<HTMLDivElement | null>(null);
  const textRef  = useRef<HTMLParagraphElement | null>(null);

  // Called by the consuming component's useGSAP (inside ctx scope)
  const register = () => {
    const block = blockRef.current;
    const width = widthRef.current;
    const text  = textRef.current;

    if (!block || !width || !text) return;

    const triggerEl = typeof trigger === "function" ? trigger() : document.querySelector(trigger as string);
    if (!triggerEl) return;

    const isLeft = direction === "left";
    const fromProps  = isLeft
      ? { width: "0%", left: "0%", right: "auto" }
      : { width: "0%", right: "0%", left: "auto" };
    const exitProps  = isLeft
      ? { width: 0, left: "100%" }
      : { width: 0, right: "100%" };

    gsap.fromTo(block, fromProps, {
      width: "100%",
      duration: 0.5,
      ease,
      scrollTrigger: {
        trigger: triggerEl,
        start: startOffset,
        toggleActions: "play none none none",
      },
      onComplete: () => {
        gsap.to(block, {
          ...exitProps,
          duration: 0.4,
          ease,
          onComplete: () => {
            gsap.to(text, { opacity: 1, duration: 0.1, ease });
          },
        });
      },
    });

    gsap.from(width, {
      width: 0,
      ease,
      scrollTrigger: {
        trigger: triggerEl,
        start: underlineStart,
        end: underlineEnd,
        scrub: true,
      },
    });
  };

  // Expose register so the consumer can call it inside their useGSAP
  (useWipeReveal as any).__lastRegister = register;

  return { blockRef, widthRef, textRef };
}

/**
 * Helper to call after useWipeReveal() inside a useGSAP callback.
 * This pattern keeps the GSAP context ownership in the component.
 *
 * Example:
 *   const wipe = useWipeReveal({ trigger: () => textRef.current, direction: "left" });
 *   useGSAP(() => { registerWipe(wipe); }, { scope: sectionRef });
 */
export function registerWipe(refs: WipeRevealRefs, options: WipeRevealOptions) {
  const {
    trigger,
    direction = "left",
    startOffset = "top 90%",
    underlineStart = "top 80%",
    underlineEnd = "top 50%",
    ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  } = options;

  const block = refs.blockRef.current;
  const width = refs.widthRef.current;
  const text  = refs.textRef.current;

  if (!block || !width || !text) return;

  const triggerEl = typeof trigger === "function"
    ? trigger()
    : document.querySelector(trigger as string);
  if (!triggerEl) return;

  const isLeft = direction === "left";
  const fromProps = isLeft
    ? { width: "0%", left: "0%", right: "auto" }
    : { width: "0%", right: "0%", left: "auto" };
  const exitProps = isLeft
    ? { width: 0, left: "100%" }
    : { width: 0, right: "100%" };

  gsap.fromTo(block, fromProps, {
    width: "100%",
    duration: 0.5,
    ease,
    scrollTrigger: {
      trigger: triggerEl,
      start: startOffset,
      toggleActions: "play none none none",
    },
    onComplete: () => {
      gsap.to(block, {
        ...exitProps,
        duration: 0.4,
        ease,
        onComplete: () => {
          gsap.to(text, { opacity: 1, duration: 0.1, ease });
        },
      });
    },
  });

  gsap.from(width, {
    width: 0,
    ease,
    scrollTrigger: {
      trigger: triggerEl,
      start: underlineStart,
      end: underlineEnd,
      scrub: true,
    },
  });
}