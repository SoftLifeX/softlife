"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const SNAP = "cubic-bezier(0.76, 0, 0.24, 1)";
const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

function buildClip(
  holeLeft: number,
  holeRight: number,
  holeTop: number,
  holeBottom: number
) {
  return `polygon(
    evenodd,
    0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
    ${holeLeft}% ${holeTop}%,
    ${holeLeft}% ${holeBottom}%,
    ${holeRight}% ${holeBottom}%,
    ${holeRight}% ${holeTop}%,
    ${holeLeft}% ${holeTop}%
  )`;
}

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const ooRef = useRef<HTMLDivElement>(null);
  const softRef = useRef<HTMLDivElement>(null);
  const lifeRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    ((document.fonts?.ready ?? Promise.resolve()) as Promise<unknown>).then(() => {
      const overlay = overlayRef.current;
      const ooEl = ooRef.current;
      const softEl = softRef.current;
      const lifeEl = lifeRef.current;
      if (!overlay || !ooEl || !softEl || !lifeEl) return;

      const splitChars = (el: HTMLElement, text: string, cls: string) => {
        el.innerHTML = [...text]
          .map((ch) =>
            ch === " "
              ? `<span style="display:inline-block;width:0.3em"> </span>`
              : `<span style="display:inline-block;overflow:hidden;vertical-align:top">`
              + `<span class="${cls}" style="display:inline-block;line-height:1">${ch}</span></span>`
          )
          .join("");
        return Array.from(el.querySelectorAll<HTMLElement>(`.${cls}`));
      };

      const ooChars = splitChars(ooEl, "only one", "oo");
      const softChars = splitChars(softEl, "soft", "sf");
      const lifeChars = splitChars(lifeEl, "life", "lf");

      gsap.set(ooChars, { x: -40, opacity: 0 });
      gsap.set(softChars, { x: 60, opacity: 0 });
      gsap.set(lifeChars, { x: 60, opacity: 0 });

      const hole = { left: 50, right: 50, top: 50, bottom: 50 };
      overlay.style.clipPath = buildClip(hole.left, hole.right, hole.top, hole.bottom);

      const applyClip = () => {
        overlay.style.clipPath = buildClip(hole.left, hole.right, hole.top, hole.bottom);
      };

      const textHalfVh = 12;

      const tl = gsap.timeline();

      tl.to(ooChars, { x: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: EASE });
      tl.to(softChars, { x: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: EASE }, "-=0.65");
      tl.to(lifeChars, { x: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: EASE }, "<0.18");

      tl.to({}, { duration: 0.75 });

      tl.to(ooChars, { y: -18, opacity: 0, duration: 0.3, stagger: 0.018, ease: EASE });
      tl.to({}, { duration: 0.2 });

      tl.add("split");
      tl.to(softEl, { x: "-12vw", duration: 0.7, ease: SNAP }, "split");
      tl.to(lifeEl, { x: "12vw", duration: 0.7, ease: SNAP }, "split");
      tl.to(hole, {
        left: 40,
        right: 60,
        top: 50 - textHalfVh,
        bottom: 50 + textHalfVh,
        duration: 0.7,
        ease: SNAP,
        onUpdate: applyClip,
      }, "split");

      tl.to({}, { duration: 0.35 });

      tl.to(hole, {
        left: 0,
        right: 100,
        top: 0,
        bottom: 100,
        duration: 1,
        ease: SNAP,
        onStart: () => {
          window.dispatchEvent(new CustomEvent("preloader-complete"));
        },
        onUpdate: applyClip,
        onComplete: () => setMounted(false),
      });
      tl.to([softEl, lifeEl], { opacity: 0, duration: 0.25 }, "-=0.6");
    });
  }, []);

  if (!mounted) return null;

  const bg = "var(--background, #06060a)";
  const fg = "var(--foreground, #fff)";

  const TEXT: React.CSSProperties = {
    fontFamily: "system-ui, sans-serif",
    fontSize: "clamp(52px, 10vw, 136px)",
    fontWeight: 500,
    letterSpacing: "-0.03em",
    lineHeight: 1,
    whiteSpace: "nowrap",
    userSelect: "none",
    pointerEvents: "none",
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: bg,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          ref={ooRef}
          style={{
            position: "absolute",
            bottom: "clamp(36px, 5vh, 64px)",
            left: "clamp(20px, 4vw, 52px)",
            fontFamily: "system-ui, sans-serif",
            fontSize: "clamp(9px, 0.9vw, 11px)",
            fontWeight: 400,
            letterSpacing: "0.44em",
            textTransform: "uppercase",
            color: fg,
            opacity: 0.35,
            whiteSpace: "nowrap",
          }}
        />

        <div style={{ display: "flex", width: "50vw", justifyContent: "flex-end" }}>
          <div ref={softRef} style={{ ...TEXT, color: fg }} />
        </div>

        <div style={{ display: "flex", width: "50vw", justifyContent: "flex-start" }}>
          <div ref={lifeRef} style={{ ...TEXT, color: fg, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
}