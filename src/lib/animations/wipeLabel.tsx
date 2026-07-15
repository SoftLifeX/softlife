"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { WipeRevealRefs } from "@/hooks/useWipeReveal";
export function useWipeRefs(): WipeRevealRefs {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  return { blockRef, widthRef, textRef };
}

export interface WipeLabelProps extends WipeRevealRefs {
  label: string;
  align?: "left" | "right";
  className?: string;
}

export function WipeLabel({ blockRef, widthRef, textRef, label, align = "left", className }: WipeLabelProps) {
  const isLeft = align === "left";
  return (
    <div className={cn("relative w-fit", !isLeft && "ml-auto", className)}>
      <div className="relative w-fit group">
        <p
          ref={textRef}
          className={cn(
            "gsap-hide opacity-0 relative text-sm text-foreground",
            isLeft ? "origin-left" : "origin-right"
          )}
        >
          {label}
        </p>
        <div
          ref={widthRef}
          className={cn(
            "absolute bottom-0 h-px w-full bg-foreground",
            "transition-transform duration-500 ease-(--ease-custom)",
            isLeft
              ? "left-0 origin-left scale-x-100 group-hover:origin-right group-hover:scale-x-0"
              : "left-0 origin-right scale-x-100 group-hover:origin-left group-hover:scale-x-0"
          )}
        />
      </div>
      <div ref={blockRef} className={cn("absolute w-0 h-full top-0 pointer-events-none bg-foreground", isLeft ? "left-0" : "right-0")} />
    </div>
  );
}