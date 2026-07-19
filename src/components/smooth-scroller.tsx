"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollSmoother, ScrollTrigger } from "@/lib/gsap-init";

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const wrapRef    = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapRef.current || !contentRef.current) return;

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

      (window as any).__smoother = smoother;

      return () => {
        smoother.kill();
        delete (window as any).__smoother;
      };
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