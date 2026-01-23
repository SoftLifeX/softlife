"use client";

import { forwardRef, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(DrawSVGPlugin as any);
}

interface CurvyArrowProps {
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

const CurvyArrow = forwardRef<SVGSVGElement, CurvyArrowProps>(
  ({ className = "w-24 h-auto", delay = 2.2, duration = 4, stagger = 0.1 }, ref) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useLayoutEffect(() => {
      const svg = svgRef.current;
      if (!svg) return;

      const ctx = gsap.context(() => {
        const paths = gsap.utils.toArray<SVGPathElement>("path", svg);
        const hasDraw = gsap.plugins?.DrawSVGPlugin;

        gsap.set(svg, { autoAlpha: 1 });

        if (hasDraw) {
          gsap.set(paths, { drawSVG: "0% 0%" });
        } else {
          paths.forEach((p) => {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          });
        }

        gsap.timeline()
          .to(
            paths,
            hasDraw
              ? { drawSVG: "0% 100%", duration, delay, ease: "power2.out", stagger }
              : { strokeDashoffset: 0, duration, delay, ease: "power2.out", stagger }
          );
      }, svgRef);

      return () => ctx.revert();
    }, [delay, duration, stagger]);

    return (
      <div className={`mt-0 ${className}`}>
        <svg
          ref={(node) => {
            svgRef.current = node;
            if (ref) {
              if (typeof ref === "function") ref(node);
              else ref.current = node;
            }
          }}
          className="w-full h-full block"
          style={{ transform: "rotate(200deg) scale(1)", transformOrigin: "center center" }}
          viewBox="0 0 386 127"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.95}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    );
  }
);

CurvyArrow.displayName = "CurvyArrow";

export default CurvyArrow;
