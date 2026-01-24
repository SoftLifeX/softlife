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

export default function Header({ strength = 0.35, elastic = "elastic.out(1, 0.35)" }: Props) {
  const [isActive, setIsActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const magneticRef = useRef<HTMLDivElement | null>(null);

  const isMobileView = useRef(false);
  const rafId = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isMagneticActive = useRef(false);
  const boundsRef = useRef<DOMRect | null>(null);

  /** Intersection observer for contrast sections */
  useEffect(() => {
    const contrastSections = document.getElementById("contrast");
    if (!contrastSections) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: "0px 0px -100% 0px" }
    );

    observer.observe(contrastSections);
    return () => observer.disconnect();
  }, [pathname]);

  /** Unified scroll listener */
  useEffect(() => {
    const distance = 0.1;
    const onScroll = () => {
      const scrolledNow = window.scrollY > window.innerHeight * distance;
      setScrolled(scrolledNow);

      // Auto-close menu near top
      if (window.scrollY <= window.innerHeight * 0.2) {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialize
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Close menu on route change */
  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname]);

  /** Close menu on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Magnetic animation (desktop only) */
  useEffect(() => {
    if (!magneticRef.current || !scrolled) return;

    isMobileView.current = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobileView.current || prefersReducedMotion) return;

    const el = magneticRef.current;

    const xTo = gsap.quickTo(el, "x", { duration: 1.15, ease: elastic, overwrite: true });
    const yTo = gsap.quickTo(el, "y", { duration: 1.15, ease: elastic, overwrite: true });
    const rotateXTo = gsap.quickTo(el, "rotationX", { duration: 1.15, ease: elastic, overwrite: true });
    const rotateYTo = gsap.quickTo(el, "rotationY", { duration: 1.15, ease: elastic, overwrite: true });

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

      mousePos.current = { x: e.clientX - centerX, y: e.clientY - centerY };

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(update);
      }
    };

    const handleMouseLeave = () => {
      isMagneticActive.current = false;
      boundsRef.current = null;
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
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
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [strength, elastic, scrolled]);

  /** Safe toggle handler */
  const handleMenuToggle = () => setIsActive((prev) => !prev);

  return (
    <>
      <div
        ref={wrapperRef}
        className={cn(
          "fixed right-5 top-5 w-20 h-20 p-4 flex items-center justify-center rounded-full pointer-events-auto z-[999]",
          scrolled ? "scale-100" : "scale-0"
        )}
      >
        <div style={{ perspective: "1000px", display: "inline-block" }}>
          <div
            ref={magneticRef}
            style={{ transformStyle: "preserve-3d", display: "inline-block" }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                onClick={handleMenuToggle}
                className="relative w-15 h-15 rounded-full flex items-center justify-center cursor-pointer z-[1000]"
              >
                {/* Hamburger / menu icon */}
                <span className="block w-6 h-0.5 bg-current mb-1"></span>
                <span className="block w-6 h-0.5 bg-current mb-1"></span>
                <span className="block w-6 h-0.5 bg-current"></span>
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
