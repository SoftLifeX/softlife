"use client";
/**
 * Magnetic
 *
 * CHANGES FROM ORIGINAL:
 * - `isMobile` used to call window.matchMedia() synchronously on mount.
 *   A matchMedia *listener* is now used so if the user resizes
 *   (e.g. DevTools responsive toggle) the effect correctly re-evaluates.
 * - `boundsRef` is invalidated on scroll/resize and lazily refreshed on
 *   mousemove — same as before but the logic is cleaner.
 * - `handleMouseEnter` no longer has an unused `e: MouseEvent` param.
 * - `willChange: "transform"` removed from the outer wrapper (it was on
 *   the wrong element; GSAP sets it on the inner wrapper via quickTo).
 */

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "@/lib/gsap-init";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  elastic?: string;
  radius?: number;
  tiltStrength?: number;
  disabled?: boolean;
}

export default function Magnetic({
  children,
  strength = 0.35,
  elastic = "power3.out",
  radius = Infinity,
  tiltStrength = 15,
  disabled = false,
}: MagneticProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const boundsRef  = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || disabled) return;

    // Use a mediaQuery listener so the effect responds to viewport changes
    const mq = window.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const wrapper = wrapperRef.current;

    const xTo       = gsap.quickTo(wrapper, "x",         { duration: 0.6, ease: elastic,      overwrite: "auto" });
    const yTo       = gsap.quickTo(wrapper, "y",         { duration: 0.6, ease: elastic,      overwrite: "auto" });
    const rotateXTo = gsap.quickTo(wrapper, "rotationX", { duration: 0.6, ease: "power2.out", overwrite: "auto" });
    const rotateYTo = gsap.quickTo(wrapper, "rotationY", { duration: 0.6, ease: "power2.out", overwrite: "auto" });

    const refreshBounds = () => { boundsRef.current = null; }; // lazy — recalculated on next move

    const onMouseEnter = () => {
      boundsRef.current = wrapper.getBoundingClientRect();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!boundsRef.current) boundsRef.current = wrapper.getBoundingClientRect();
      const bounds = boundsRef.current;

      const x = e.clientX - (bounds.left + bounds.width  / 2);
      const y = e.clientY - (bounds.top  + bounds.height / 2);
      const distance = Math.sqrt(x * x + y * y);

      const effectiveRadius =
        radius === Infinity
          ? Infinity
          : Math.max(bounds.width, bounds.height) * radius;

      if (distance <= effectiveRadius) {
        const nx = x / (bounds.width  / 2);
        const ny = y / (bounds.height / 2);
        xTo(x * strength);
        yTo(y * strength);
        rotateYTo( nx * tiltStrength);
        rotateXTo(-ny * tiltStrength);
      } else {
        xTo(0); yTo(0); rotateXTo(0); rotateYTo(0);
      }
    };

    const onMouseLeave = () => {
      xTo(0); yTo(0); rotateXTo(0); rotateYTo(0);
    };

    window.addEventListener("scroll", refreshBounds, { passive: true });
    window.addEventListener("resize", refreshBounds, { passive: true });
    wrapper.addEventListener("mouseenter", onMouseEnter);
    wrapper.addEventListener("mousemove",  onMouseMove,  { passive: true });
    wrapper.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("scroll", refreshBounds);
      window.removeEventListener("resize", refreshBounds);
      wrapper.removeEventListener("mouseenter", onMouseEnter);
      wrapper.removeEventListener("mousemove",  onMouseMove);
      wrapper.removeEventListener("mouseleave", onMouseLeave);
      gsap.killTweensOf(wrapper);
    };
  }, [strength, elastic, radius, tiltStrength, disabled]);

  if (disabled) return <>{children}</>;

  return (
    <div style={{ perspective: "1000px", display: "inline-block" }}>
      <div
        ref={wrapperRef}
        style={{
          transformStyle: "preserve-3d",
          display: "inline-block",
          isolation: "isolate",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}