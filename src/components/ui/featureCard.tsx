"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-init";
import { EASE_RAW } from "@/lib/animations/tokens";
import { cn } from "@/lib/utils";

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";

type Side = "top" | "left" | "bottom" | "right";

const ENTRANCE_CLIP: Record<Side, string> = {
  left: NO_CLIP,
  bottom: NO_CLIP,
  top: NO_CLIP,
  right: NO_CLIP,
};
const EXIT_CLIP: Record<Side, string> = {
  left: TOP_RIGHT_CLIP,
  bottom: TOP_RIGHT_CLIP,
  top: TOP_RIGHT_CLIP,
  right: BOTTOM_LEFT_CLIP,
};

function getNearestSide(e: React.MouseEvent, el: HTMLElement): Side {
  const box = el.getBoundingClientRect();
  const sides = [
    { side: "left" as Side, proximity: Math.abs(box.left - e.clientX) },
    { side: "right" as Side, proximity: Math.abs(box.right - e.clientX) },
    { side: "top" as Side, proximity: Math.abs(box.top - e.clientY) },
    { side: "bottom" as Side, proximity: Math.abs(box.bottom - e.clientY) },
  ];
  return sides.sort((a, b) => a.proximity - b.proximity)[0].side;
}

interface FeatureCardProps {
  number: string;
  title: string;
  body: string;
  brand: string;
  className?: string;
}

export default function FeatureCard({ number, title, body, brand, className }: FeatureCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const side = getNearestSide(e, containerRef.current!);
    gsap.to(overlayRef.current, { clipPath: ENTRANCE_CLIP[side], duration: 0.35, ease: EASE_RAW });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const side = getNearestSide(e, containerRef.current!);
    gsap.to(overlayRef.current, { clipPath: EXIT_CLIP[side], duration: 0.35, ease: EASE_RAW });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "g-feature relative bg-primary p-6 md:p-8 flex flex-col gap-4 overflow-hidden cursor-default",
        "h-64 md:h-72",
        className
      )}
    >
      {/* Base layer */}
      <span className="text-xs font-mono shrink-0" style={{ color: brand }}>{number}</span>
      <h3 className="text-foreground font-semibold text-base leading-snug line-clamp-2 shrink-0">{title}</h3>
      <p className="text-primary-foreground text-sm leading-relaxed line-clamp-4 flex-1">{body}</p>

      {/* Wipe overlay*/}
      <div
        ref={overlayRef}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 bg-foreground p-6 md:p-8 flex flex-col gap-4 pointer-events-none"
      >
        <span className="text-xs font-mono shrink-0" style={{ color: brand }}>{number}</span>
        <h3 className="text-primary font-semibold text-base leading-snug line-clamp-2 shrink-0">{title}</h3>
        <p className="text-primary/60 text-sm leading-relaxed line-clamp-4 flex-1">{body}</p>
      </div>
    </div>
  );
}