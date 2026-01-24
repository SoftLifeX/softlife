"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { cn } from "@/lib/utils";

gsap.registerPlugin(MorphSVGPlugin);

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const raysRef = useRef<(SVGPathElement | null)[]>([]);
  const themePathRef = useRef<SVGPathElement | null>(null);

  const sunPath =
    "M70 49.5C70 60.82 60.82 70 49.5 70C38.18 70 29 60.82 29 49.5C29 38.18 38.18 29 49.5 29C60 29 69.5 38 70 49.5Z";
  const moonPath =
    "M70 49.5C70 60.82 60.82 70 49.5 70C38.18 70 29 60.82 29 49.5C29 38.18 38.18 29 49.5 29C41 39 50 62 70 49.5Z";

  const rayPaths: string[] = [
    "M50 2V11",
    "M85 15L78 22",
    "M98 50H89",
    "M85 85L78 78",
    "M50 98V89",
    "M23 78L16 84",
    "M11 50H2",
    "M23 23L16 16",
  ];

  // First effect: mount + initialize GSAP + sync theme
  useEffect(() => {
    setMounted(true);

    if (theme === "light" || theme === "dark") {
      setCurrentTheme(theme);
    }

    // Initialize rays
    raysRef.current.forEach((el) => {
      if (!el) return;
      const len = el.getTotalLength();
      gsap.set(el, {
        strokeDasharray: len,
        strokeDashoffset: len,
        scale: 0,
        transformOrigin: "50% 50%",
      });
    });

    // Animate rays if initial theme is light
    if (theme === "light") animateRays(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animateRays = (show: boolean) => {
    const tl = gsap.timeline({ defaults: { ease: "power3" } });
    if (show) {
      tl.fromTo(
        raysRef.current,
        {
          strokeDasharray: (i, el) => (el ? el.getTotalLength() : 0),
          strokeDashoffset: (i, el) => (el ? el.getTotalLength() : 0),
          scale: 0,
          transformOrigin: "50% 50%",
        },
        {
          strokeDashoffset: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
        }
      );
    } else {
      tl.to(raysRef.current, {
        strokeDashoffset: (i, el) => (el ? el.getTotalLength() : 0),
        scale: 0,
        transformOrigin: "50% 50%",
        duration: 0.4,
        stagger: 0.05,
      });
    }
  };

  const handleToggle = () => {
    if (!mounted) return;

    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);          // next-themes
    setCurrentTheme(nextTheme);   // local state

    const tl = gsap.timeline({ defaults: { ease: "power3" } });
    tl.add(() => animateRays(nextTheme === "light"), 0);

    if (themePathRef.current) {
      tl.to(
        themePathRef.current,
        {
          duration: 1,
          morphSVG: nextTheme === "light" ? sunPath : moonPath,
          fill: "var(--background)",
          stroke: "var(--background)",
        },
        "-=0.2"
      );
    }
  };

  // Update rays whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    animateRays(currentTheme === "light");
  }, [currentTheme, mounted]);

  if (!mounted) return null; // mobile-safe

  const isLight = currentTheme === "light";

  return (
    <div
      onClick={handleToggle}
      className="cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-primary/25 rounded-lg z-[50] pointer-events-auto"
    >
      <svg
        width={100}
        height={100}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "absolute w-10 h-10 origin-center transition-transform duration-500 ease-(--ease-custom)",
          isLight ? "scale-65 hover:rotate-90" : "scale-100"
        )}
      >
        <g className="stroke-5 stroke-background">
          {rayPaths.map((d, i) => (
            <path
              key={i}
              ref={(el) => (raysRef.current[i] = el)}
              d={d}
            />
          ))}
        </g>

        <path
          ref={themePathRef}
          d={isLight ? sunPath : moonPath}
          fill="var(--background)"
          stroke="var(--background)"
          strokeWidth={4}
          fillOpacity={0.5}
          strokeOpacity={1}
        />
      </svg>
    </div>
  );
};

export default ThemeToggle;
