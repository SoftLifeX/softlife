/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import gsap from "gsap";


interface Props {
  strength?: number;
  elastic?: string;
}

export default function Header({
  strength = 0.35,
  elastic = "elastic.out(1, 0.35)",
}: Props) {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean>(false);

  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {

    const contrastSections = document.getElementById('contrast');
    if (!contrastSections) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        root: null,
        threshold: 0,
        rootMargin: '0px 0px -100% 0px',
      }
    );

    observer.observe(contrastSections);
    return () => observer.disconnect();
  }, [pathname]);

  const distance = 0.1;

  useEffect(() => {
    if (scrolled) setScrolled(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * distance);
    onScroll();

    if (window.scrollY < window.innerHeight * 0.2) {
      setIsActive(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  //close  on page top
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY <= window.innerHeight * 0.2) {
        setIsActive(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname]);

  //close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //magnetic
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const magneticRef = useRef<HTMLDivElement | null>(null);
  const isMobileView = useRef(false);
  const rafId = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isMagneticActive = useRef(false);
  const boundsRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (!magneticRef.current || !scrolled) return;

    // Detect mobile and reduced motion preference
    isMobileView.current = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobileView.current || prefersReducedMotion) return;

    const el = magneticRef.current;

    const xTo = gsap.quickTo(el, "x", {
      duration: 1.15,
      ease: elastic,
      overwrite: true,
    });

    const yTo = gsap.quickTo(el, "y", {
      duration: 1.15,
      ease: elastic,
      overwrite: true,
    });

    const rotateXTo = gsap.quickTo(el, "rotationX", {
      duration: 1.15,
      ease: elastic,
      overwrite: true,
    });

    const rotateYTo = gsap.quickTo(el, "rotationY", {
      duration: 1.15,
      ease: elastic,
      overwrite: true,
    });

    // Throttled update using RAF
    const update = () => {
      if (!isMagneticActive.current || !boundsRef.current) return;

      const bounds = boundsRef.current;
      const { x, y } = mousePos.current;

      const normalizedX = x / (bounds.width / 2);
      const normalizedY = y / (bounds.height / 2);

      xTo(x * strength);
      yTo(y * strength);
      rotateYTo(normalizedX * 15); 
      rotateXTo(-normalizedY * 15);

      rafId.current = null;
    };

    const handleMouseEnter = () => {
      boundsRef.current = el.getBoundingClientRect();
      isMagneticActive.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!boundsRef.current) return;

      const bounds = boundsRef.current;
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      mousePos.current = {
        x: e.clientX - centerX,
        y: e.clientY - centerY,
      };

      // Throttle updates with RAF
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(update);
      }
    };

    const handleMouseLeave = () => {
      isMagneticActive.current = false;
      boundsRef.current = null;

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }

      xTo(0);
      yTo(0);
      rotateXTo(0);
      rotateYTo(0);
    };

    el.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [strength, elastic, scrolled]);

  return (
    <>
      <div
        onClick={() => setIsActive(!isActive)}
        ref={wrapperRef}
        className={cn(
          "fixed right-5 w-20 h-20  p-4 flex items-center justify-center rounded-full",
          scrolled ? "scale-100 pointer-events-auto z-50" : "scale-0 -z-50 pointer-events-none"
        )}
      >
        <div
          style={{
            perspective: "1000px",
            display: "inline-block",
          }}
        >
          <div
            ref={magneticRef}
            style={{
              transformStyle: "preserve-3d",
              display: "inline-block",
            }}
          >
            <div className="relative">
              <div
                aria-hidden
                className={cn(
                  "absolute w-20 h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none -z-1 animate-pulse-ring",
                  scrolled ? "scale-100" : "scale-0",
                  isIntersecting ? "bg-background/90" : "bg-foreground/50",
                  isActive ? "hidden" : "block"
                )}
              />
              <div
                aria-hidden
                className={cn(
                  "absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full backdrop-blur-sm z-0 pointer-events-none",
                  isActive
                    ? "hidden animate-none w-15 h-15"
                    : "block w-18 h-18 animate-pulse-dot",
                  scrolled ? "scale-100" : "scale-0",
                  isIntersecting ? "bg-background" : "bg-foreground"
                )}
              />
              <div
                className={cn(
                  "relative w-15 h-15 rounded-full flex items-center justify-center cursor-pointer",
                  scrolled ? "scale-100" : "scale-0",
                  isIntersecting ? "bg-background" : "bg-foreground"
                )}
              >
                <div
                  className={cn(
                    "relative w-full h-0 transition-all duration-300",
                    "before:absolute before:content-[''] before:w-2/5 before:h-0.5 before:-top-0.5 before:left-1/2 before:-translate-x-1/2 before:transition-all before:duration-300",
                    " after:absolute after:content-[''] after:w-2/5 after:h-0.5 after:top-0.5 after:left-1/2 after:-translate-x-1/2 after:transition-all after:duration-300",
                    isActive
                      ? "before:rotate-45 after:top-0 after:-rotate-45 before:top-0 after:-translate-y-px"
                      : "",
                    isIntersecting
                      ? "before:bg-foreground after:bg-foreground"
                      : "before:bg-background after:bg-background"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isActive && <Nav />}
      </AnimatePresence>
    </>
  );

}
