"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "@/lib/gsap-init";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  elastic?: string;
  radius?: number;
  tiltStrength?: number;
  disabled?: boolean;
  /** Renders both wrappers as block/w-full instead of inline-block — needed
   *  for grid/flex children (like ProjectCard) so the wrapper doesn't
   *  shrink-to-fit and collapse the card's own w-full sizing. */
  fullWidth?: boolean;
  className?: string;
}

export default function Magnetic({
  children,
  strength = 0.35,
  elastic = "power3.out",
  radius = Infinity,
  tiltStrength = 15,
  disabled = false,
  fullWidth = false,
  className,
}: MagneticProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const boundsRef  = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || disabled) return;

    const mq = window.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const wrapper = wrapperRef.current;

    const xTo       = gsap.quickTo(wrapper, "x",         { duration: 0.6, ease: elastic,      overwrite: "auto" });
    const yTo       = gsap.quickTo(wrapper, "y",         { duration: 0.6, ease: elastic,      overwrite: "auto" });
    const rotateXTo = gsap.quickTo(wrapper, "rotationX", { duration: 0.6, ease: "power2.out", overwrite: "auto" });
    const rotateYTo = gsap.quickTo(wrapper, "rotationY", { duration: 0.6, ease: "power2.out", overwrite: "auto" });

    const refreshBounds = () => { boundsRef.current = null; };

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
    <div
      className={cn(fullWidth && "block w-full", className)}
      style={{ perspective: "1000px", display: fullWidth ? "block" : "inline-block" }}
    >
      <div
        ref={wrapperRef}
        className={cn(fullWidth && "block w-full")}
        style={{
          transformStyle: "preserve-3d",
          display: fullWidth ? "block" : "inline-block",
          isolation: "isolate",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}