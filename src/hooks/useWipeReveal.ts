"use client"; 

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
      duration: 0.4,
      ease,
      scrollTrigger: {
        trigger: triggerEl,
        start: startOffset,
        toggleActions: "play none none none",
      },
      onComplete: () => {
        gsap.to(block, {
          ...exitProps,
          duration: 0.3,
          ease,
          onComplete: () => {
            gsap.to(text, { opacity: 1, duration: 0.05, ease });
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
    duration: 0.4,
    ease,
    scrollTrigger: {
      trigger: triggerEl,
      start: startOffset,
      toggleActions: "play none none none",
    },
    onComplete: () => {
      gsap.to(block, {
        ...exitProps,
        duration: 0.3,
        ease,
        onComplete: () => {
          gsap.to(text, { opacity: 1, duration: 0.05, ease });
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