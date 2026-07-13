"use client";

import { useRef } from "react";
import { Icons, type IconName } from "@/app/assets/svgs";
import { cn } from "@/lib/utils";
import Magnetic from "../magnetic";
import { gsap } from "@/lib/gsap-init";
import { EASE_RAW } from "@/lib/animations/tokens";

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

type TagProps = {
  icon: IconName;
  label: string;
  className?: string;
};

export function Tag({ icon, label, className }: TagProps) {
  const Icon = Icons[icon];
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const side = getNearestSide(e, containerRef.current);
    gsap.to(overlayRef.current, { clipPath: ENTRANCE_CLIP[side], duration: 0.35, ease: EASE_RAW });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const side = getNearestSide(e, containerRef.current);
    gsap.to(overlayRef.current, { clipPath: EXIT_CLIP[side], duration: 0.35, ease: EASE_RAW });
  };

  return (
    <Magnetic strength={0.2}>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm overflow-hidden cursor-default",
          "bg-tag-background backdrop-blur-sm",
          "transition-all duration-200 ease-(--ease-custom)",
          className
        )}
      >
        {/* Base layer */}
        <Icon className="w-fit h-fit shrink-0" />
        <span className="whitespace-nowrap text-tag-foreground text-sm">{label}</span>

        {/* Wipe overlay — same content, inverted tag tokens */}
        <div
          ref={overlayRef}
          style={{ clipPath: BOTTOM_RIGHT_CLIP }}
          className="absolute inset-0 rounded-lg bg-tag-foreground px-3 py-2 flex items-center gap-2 pointer-events-none"
        >
          <Icon className="w-fit h-fit shrink-0 text-tag-background" />
          <span className="whitespace-nowrap text-tag-background text-sm">{label}</span>
        </div>
      </div>
    </Magnetic>
  );
}