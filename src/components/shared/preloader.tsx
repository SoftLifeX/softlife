"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const snap = "cubic-bezier(0.76, 0, 0.24, 1)";
const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

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
  const softRef = useRef<HTMLDivElement>(null);
  const lifeRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let tl: gsap.core.Timeline | undefined;

    ((document.fonts?.ready ?? Promise.resolve()) as Promise<unknown>).then(() => {
      if (cancelled) return;

      const overlay = overlayRef.current;
      const softEl = softRef.current;
      const lifeEl = lifeRef.current;
      if (!overlay || !softEl || !lifeEl) return;

      gsap.set([softEl, lifeEl], { visibility: "visible" });

      const computedFont = `500 ${getComputedStyle(softEl).fontSize} system-ui, sans-serif`;
      const measureCtx = document.createElement("canvas").getContext("2d");
      const nWidth = measureCtx
        ? measureCtx.measureText.call(Object.assign(measureCtx, { font: computedFont }), "n").width
        : 40;
      const half = nWidth / 2;

      const nHalfSpan = (side: "left" | "right", cls: string) => {
        const shift = side === "left" ? 0 : -half;
        return `<span style="display:inline-block;width:${half}px;height:1em;overflow:hidden;vertical-align:top;position:relative;line-height:1">
          <span class="${cls}" style="display:inline-block;position:absolute;left:${shift}px;top:0;line-height:1">n</span>
        </span>`;
      };

      const buildCharSpan = (ch: string, cls: string) =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:top"><span class="${cls}" style="display:inline-block;line-height:1">${ch}</span></span>`;

      softEl.innerHTML =
        buildCharSpan("d", "sf") + buildCharSpan("a", "sf") + nHalfSpan("left", "sf");
      lifeEl.innerHTML =
        nHalfSpan("right", "lf") + buildCharSpan("i", "lf") + buildCharSpan("e", "lf") + buildCharSpan("l", "lf");

      const softChars = Array.from(softEl.querySelectorAll<HTMLElement>(".sf"));
      const lifeChars = Array.from(lifeEl.querySelectorAll<HTMLElement>(".lf"));

      gsap.set(softChars, { x: 60, opacity: 0 });
      gsap.set(lifeChars, { x: 60, opacity: 0 });

      const hole = { left: 50, right: 50, top: 50, bottom: 50 };
      overlay.style.clipPath = buildClip(hole.left, hole.right, hole.top, hole.bottom);

      const applyClip = () => {
        overlay.style.clipPath = buildClip(hole.left, hole.right, hole.top, hole.bottom);
      };

      const textHalfVh = 12;

      tl = gsap.timeline();

      tl.to(softChars, { x: 0, opacity: 1, duration: 0.55, stagger: 0.04, ease });
      tl.to(lifeChars, { x: 0, opacity: 1, duration: 0.55, stagger: 0.04, ease }, "<0.12");

      tl.to({}, { duration: 0.18 });

      tl.add("split");
      tl.to(softEl, { x: "-12vw", duration: 0.45, ease: snap }, "split");
      tl.to(lifeEl, { x: "12vw", duration: 0.45, ease: snap }, "split");
      tl.to(hole, {
        left: 40,
        right: 60,
        top: 50 - textHalfVh,
        bottom: 50 + textHalfVh,
        duration: 0.45,
        ease: snap,
        onUpdate: applyClip,
      }, "split");

      tl.to({}, {
        duration: 0.12,
        onStart: () => {
          window.dispatchEvent(new CustomEvent("preloader-complete"));
        },
      });

      tl.to(hole, {
        left: 0,
        right: 100,
        top: 0,
        bottom: 100,
        duration: 0.5,
        ease: snap,
        onUpdate: applyClip,
        onComplete: () => setMounted(false),
      });
      tl.to([softEl, lifeEl], { opacity: 0, duration: 0.15 }, "-=0.35");
    });

    return () => {
      cancelled = true;
      tl?.kill();
    };
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
        <div style={{ display: "flex", width: "50vw", justifyContent: "flex-end" }}>
          <div ref={softRef} className="gsap-hide" style={{ ...TEXT, color: fg }} />
        </div>

        <div style={{ display: "flex", width: "50vw", justifyContent: "flex-start" }}>
          <div ref={lifeRef} className="gsap-hide" style={{ ...TEXT, color: fg, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
}