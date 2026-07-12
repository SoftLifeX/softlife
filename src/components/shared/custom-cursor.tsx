"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-init";
import { cursorStore } from "@/lib/cursor-store";

const baseSize = 30;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ mouseX: 0, mouseY: 0, destX: 0, destY: 0 });
  const scaleRef = useRef(1);
  const targetScaleRef = useRef(1);
  const lockRef = useRef(false);

  // Track mouse position
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current.mouseX = e.clientX;
      posRef.current.mouseY = e.clientY;
      if (lockRef.current) lockRef.current = false;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Scroll lock
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (window.scrollY !== lastY) {
        lockRef.current = true;
        targetScaleRef.current = 1;
      }
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hover scaling
  useEffect(() => {
    const onEnter = (e: Event) => {
      if (lockRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".link") || target.closest(".navlink")) {
        targetScaleRef.current = 0;
      } else if (target.closest(".large")) {
        targetScaleRef.current = 13;
      }
    };
    const onLeave = () => { targetScaleRef.current = 1; };

    document.addEventListener("pointerover", onEnter);
    document.addEventListener("pointerout", onLeave);
    return () => {
      document.removeEventListener("pointerover", onEnter);
      document.removeEventListener("pointerout", onLeave);
    };
  }, []);

  // Main animation loop — now driven by gsap.ticker instead of its own rAF
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const tick = () => {
      const p = posRef.current;
      p.destX += (p.mouseX - p.destX) * 0.16;
      p.destY += (p.mouseY - p.destY) * 0.16;
      scaleRef.current += (targetScaleRef.current - scaleRef.current) * 0.17;

      const s = scaleRef.current;
      const w = baseSize * s;
      el.style.width = `${w}px`;
      el.style.height = `${w}px`;
      el.style.transform = `translate3d(${p.destX - w / 2}px,${p.destY - w / 2}px,0)`;

      // Write to shared store — zero-cost for readers (no event dispatch)
      cursorStore.mouseX = p.mouseX;
      cursorStore.mouseY = p.mouseY;
      cursorStore.x = p.destX;
      cursorStore.y = p.destY;
      cursorStore.scale = s;
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="hidden md:block"
      style={{
        width: baseSize,
        height: baseSize,
        borderRadius: "50%",
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        transform: "translate3d(-9999px,-9999px,0)",
        transition: "background 0.18s ease, opacity 0.18s ease",
        mixBlendMode: "difference",
        background: "white",
      }}
    />
  );
}