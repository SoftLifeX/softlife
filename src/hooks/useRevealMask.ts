"use client";
/**
 * useRevealMask
 *
 * Manages the circular clip-path reveal effect used in Hero and Intro.
 *
 * CHANGED: was its own `requestAnimationFrame` loop — a second scheduler
 * running alongside CustomCursor's own rAF loop AND GSAP's internal ticker,
 * three clocks doing the same job in the same page. Now registered on
 * gsap.ticker, same as CustomCursor — one shared clock for the whole site.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-init";
import { cursorStore } from "@/lib/cursor-store";

interface ExtendedCSSProperties extends CSSStyleDeclaration {
  WebkitClipPath?: string;
}

interface UseRevealMaskOptions {
  /** Fully-expanded radius in px */
  radius?: number;
  /** Easing factor when expanding (0–1) */
  expandEase?: number;
  /** Easing factor when collapsing (0–1) */
  collapseEase?: number;
}

export function useRevealMask(options: UseRevealMaskOptions = {}) {
  const { radius = 195, expandEase = 0.18, collapseEase = 0.35 } = options;

  const revealRef = useRef<HTMLDivElement | null>(null);
  const easedRadiusRef = useRef(0);
  const easedXRef = useRef(0);
  const easedYRef = useRef(0);
  const maskActiveRef = useRef(false);
  const hasMoved = useRef(false);
  const [hovered, setHovered] = useState(false);

  // ── Single tick, registered on GSAP's shared ticker ──────────────────────
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const tick = () => {
      easedXRef.current += (cursorStore.mouseX - easedXRef.current) * 0.16;
      easedYRef.current += (cursorStore.mouseY - easedYRef.current) * 0.16;

      const rect = el.getBoundingClientRect();
      const localX = easedXRef.current - rect.left;
      const localY = easedYRef.current - rect.top;

      const target = maskActiveRef.current ? radius : 0;
      const ease = maskActiveRef.current ? expandEase : collapseEase;

      easedRadiusRef.current += (target - easedRadiusRef.current) * ease;
      if (Math.abs(easedRadiusRef.current - target) < 0.01) {
        easedRadiusRef.current = target;
      }

      const clip = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
      el.style.clipPath = clip;
      (el.style as ExtendedCSSProperties).WebkitClipPath = clip;
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [radius, expandEase, collapseEase]);

  // ── Scroll: collapse mask ─────────────────────────────────────────────────
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (window.scrollY !== lastY) {
          maskActiveRef.current = false;
          hasMoved.current = false;
          setHovered(false);
        }
        lastY = window.scrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Mouse tracking: only needs to set hasMoved ────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!hasMoved.current && (Math.abs(e.movementX) > 0 || Math.abs(e.movementY) > 0)) {
        hasMoved.current = true;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleMouseEnter = () => {
    if (!hasMoved.current) return;
    maskActiveRef.current = true;
    setHovered(true);
  };

  const handleMouseLeave = () => {
    maskActiveRef.current = false;
    setHovered(false);
  };

  return { revealRef, hovered, handleMouseEnter, handleMouseLeave };
}