"use client";
/**
 * ThemeToggle
 *
 * FIXES:
 * - animateRays was defined inside the component and called from useEffect,
 *   creating a stale closure on `isLight`. It's now a stable function that
 *   takes `show` as a param and reads raysRef directly — no closure issues.
 * - The initialization useEffect depended on `isLight` which caused it to
 *   re-run on every theme change and fight the toggle animation.
 *   Split into two effects: one for mount-only init, one for theme-driven rays.
 * - Added gsap.killTweensOf(raysRef.current) before each animation so rapid
 *   toggles don't stack conflicting tweens.
 * - `mounted` guard moved to a stable pattern — returns a sized placeholder
 *   to prevent layout shift.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { cn } from "@/lib/utils";

gsap.registerPlugin(MorphSVGPlugin);

const SUN_PATH =
  "M70 49.5C70 60.82 60.82 70 49.5 70C38.18 70 29 60.82 29 49.5C29 38.18 38.18 29 49.5 29C60 29 69.5 38 70 49.5Z";
const MOON_PATH =
  "M70 49.5C70 60.82 60.82 70 49.5 70C38.18 70 29 60.82 29 49.5C29 38.18 38.18 29 49.5 29C41 39 50 62 70 49.5Z";

const RAY_PATHS = [
  "M50 2V11",
  "M85 15L78 22",
  "M98 50H89",
  "M85 85L78 78",
  "M50 98V89",
  "M23 78L16 84",
  "M11 50H2",
  "M23 23L16 16",
];

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted]       = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const raysRef      = useRef<(SVGPathElement | null)[]>([]);
  const themePathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const isLight = resolvedTheme === "light";

  // ── Stable ray animation — no stale closure ───────────────────────────────
  const animateRays = useCallback((show: boolean) => {
    const rays = raysRef.current.filter(Boolean) as SVGPathElement[];
    if (!rays.length) return;

    gsap.killTweensOf(rays);

    if (show) {
      gsap.fromTo(
        rays,
        {
          strokeDasharray:  (_, el) => el.getTotalLength(),
          strokeDashoffset: (_, el) => el.getTotalLength(),
          scale: 0,
          transformOrigin: "50% 50%",
        },
        {
          strokeDashoffset: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
        }
      );
    } else {
      gsap.to(rays, {
        strokeDashoffset: (_, el) => el.getTotalLength(),
        scale: 0,
        transformOrigin: "50% 50%",
        duration: 0.4,
        stagger: 0.05,
        ease: "power3.in",
      });
    }
  }, []);

  // ── Mount-only: set initial dasharray state on rays ───────────────────────
  useEffect(() => {
    if (!mounted) return;
    const rays = raysRef.current.filter(Boolean) as SVGPathElement[];
    rays.forEach((el) => {
      const len = el.getTotalLength();
      gsap.set(el, {
        strokeDasharray:  len,
        strokeDashoffset: len,
        scale: 0,
        transformOrigin: "50% 50%",
      });
    });
  // Intentionally runs once after mount — raysRef is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // ── Theme change: drive rays to match current theme ───────────────────────
  useEffect(() => {
    if (!mounted) return;
    animateRays(isLight);
  }, [mounted, isLight, animateRays]);

  // ── Toggle handler ────────────────────────────────────────────────────────
  const handleToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnimating) return;

    setIsAnimating(true);
    const nextTheme = isLight ? "dark" : "light";
    setTheme(nextTheme);

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => setIsAnimating(false),
    });

    // Ray animation fires immediately
    tl.add(() => animateRays(nextTheme === "light"), 0);

    // Morph the body shape
    if (themePathRef.current) {
      tl.to(
        themePathRef.current,
        {
          duration: 1,
          morphSVG: nextTheme === "light" ? SUN_PATH : MOON_PATH,
          fill:   "var(--background)",
          stroke: "var(--background)",
        },
        "-=0.2"
      );
    }
  };

  // Prevent layout shift while next-themes resolves
  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={handleToggle}
      onTouchEnd={handleToggle}
      className="cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-primary/25 rounded-lg touch-none select-none relative"
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      disabled={isAnimating}
    >
      <svg
        width={100}
        height={100}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-10 h-10 origin-center transition-transform duration-500 pointer-events-none",
          isLight ? "scale-65 hover:rotate-90" : "scale-100"
        )}
      >
        {/* Rays */}
        <g className="stroke-5 stroke-background">
          {RAY_PATHS.map((d, i) => (
            <path
              key={i}
              ref={(el) => { raysRef.current[i] = el; }}
              d={d}
            />
          ))}
        </g>

        {/* Sun / moon body */}
        <path
          ref={themePathRef}
          d={isLight ? SUN_PATH : MOON_PATH}
          fill="var(--background)"
          stroke="var(--background)"
          strokeWidth={4}
          fillOpacity={0.5}
          strokeOpacity={1}
        />
      </svg>
    </button>
  );
};

export default ThemeToggle;