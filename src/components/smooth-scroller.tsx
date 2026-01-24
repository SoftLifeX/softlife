"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export default function SmoothScroller({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.matchMedia("(min-width: 769px)").matches);
  }, []);

  useEffect(() => {
    if (!mounted || !isDesktop || !wrapRef.current || !contentRef.current) return;

    const timer = setTimeout(() => {
      if (!wrapRef.current || !contentRef.current) return;

      smootherRef.current = ScrollSmoother.create({
        wrapper: wrapRef.current,
        content: contentRef.current,
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      smootherRef.current?.kill();
    };
  }, [mounted, isDesktop]);

  return (
    <div id="smooth-wrapper" ref={wrapRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
