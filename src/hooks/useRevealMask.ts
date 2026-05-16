"use client";
/**
 * useRevealMask
 *
 * Manages the circular clip-path reveal effect used in Hero and Intro.
 *
 * BEFORE: Each component had:
 *   1. A continuous RAF loop (always running)
 *   2. handleMouseEnter that ALSO started its own RAF if one wasn't running
 *   3. handleMouseLeave that ALSO started its own RAF if one wasn't running
 *   → Up to 3 concurrent RAF loops writing to the same element
 *   → Plus scroll + mousemove listeners duplicated in every component
 *
 * AFTER: One loop, one set of listeners, shared via a hook.
 * The loop is idle-aware: when the radius is settled and the mask
 * is inactive it still runs (single rAF is ~0 cost) but writes nothing
 * meaningful, so there's no reason to start/stop it.
 */

import { useEffect, useRef, useState } from "react";
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
  const maskActiveRef = useRef(false);
  const hasMoved = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);

  // ── Single continuous RAF ─────────────────────────────────────────────────
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const tick = () => {
      const x = cursorStore.x;
      const y = cursorStore.y;

      const rect = el.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;

      const target = maskActiveRef.current ? radius : 0;
      const ease = maskActiveRef.current ? expandEase : collapseEase;

      easedRadiusRef.current += (target - easedRadiusRef.current) * ease;

      // Snap to avoid perpetual micro-updates
      if (Math.abs(easedRadiusRef.current - target) < 0.01) {
        easedRadiusRef.current = target;
      }

      const clip = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
      el.style.clipPath = clip;
      (el.style as ExtendedCSSProperties).WebkitClipPath = clip;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
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
  // (actual position is read from cursorStore inside the RAF loop)
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