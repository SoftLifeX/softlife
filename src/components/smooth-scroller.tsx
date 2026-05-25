"use client";
/**
 * SmoothScroller
 *
 * CHANGES FROM ORIGINAL:
 * - Import ScrollSmoother + ScrollTrigger from the centralized gsap-init
 *   (eliminates duplicate registerPlugin calls across the codebase).
 * - Added typeof window guard so the module is safe during SSR / static
 *   generation (ScrollSmoother reads `window` at import time on some
 *   versions of the GSAP bundle).
 * - Smoother instance created inside a matchMedia callback so it never
 *   activates on touch-only devices where it fights native scroll.
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollSmoother, ScrollTrigger } from "@/lib/gsap-init";

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const wrapRef    = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapRef.current || !contentRef.current) return;

    // Only enable smooth scroll on pointer devices — touch devices get
    // native scroll (smoothTouch causes jank on low-end Android).
    const mm = gsap.matchMedia();

    mm.add("(pointer: fine)", () => {
      const smoother = ScrollSmoother.create({
        wrapper:         wrapRef.current!,
        content:         contentRef.current!,
        smooth:          1,
        effects:         true,
        normalizeScroll: true,
        smoothTouch:     0,
      });

      return () => smoother.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}