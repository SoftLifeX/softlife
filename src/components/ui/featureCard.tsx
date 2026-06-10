"use client";
import { useRef } from "react";
import { useAnimate } from "framer-motion";

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";

type Side = "top" | "left" | "bottom" | "right";

const ENTRANCE_KEYFRAMES: Record<Side, string[]> = {
    left:   [BOTTOM_RIGHT_CLIP, NO_CLIP],
    bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
    top:    [BOTTOM_RIGHT_CLIP, NO_CLIP],
    right:  [TOP_LEFT_CLIP,     NO_CLIP],
};
const EXIT_KEYFRAMES: Record<Side, string[]> = {
    left:   [NO_CLIP, TOP_RIGHT_CLIP],
    bottom: [NO_CLIP, TOP_RIGHT_CLIP],
    top:    [NO_CLIP, TOP_RIGHT_CLIP],
    right:  [NO_CLIP, BOTTOM_LEFT_CLIP],
};

function getNearestSide(e: React.MouseEvent, el: HTMLElement): Side {
    const box = el.getBoundingClientRect();
    const sides = [
        { side: "left"   as Side, proximity: Math.abs(box.left   - e.clientX) },
        { side: "right"  as Side, proximity: Math.abs(box.right  - e.clientX) },
        { side: "top"    as Side, proximity: Math.abs(box.top    - e.clientY) },
        { side: "bottom" as Side, proximity: Math.abs(box.bottom - e.clientY) },
    ];
    return sides.sort((a, b) => a.proximity - b.proximity)[0].side;
}

interface FeatureCardProps {
    number: string;
    title: string;
    body: string;
    brand: string;
}

export default function FeatureCard({ number, title, body, brand }: FeatureCardProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scope, animate] = useAnimate();

    const handleMouseEnter = (e: React.MouseEvent) => {
        const side = getNearestSide(e, containerRef.current!);
        animate(scope.current, { clipPath: ENTRANCE_KEYFRAMES[side] }, { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] });
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        const side = getNearestSide(e, containerRef.current!);
        animate(scope.current, { clipPath: EXIT_KEYFRAMES[side] }, { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] });
    };

    return (
        <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="g-feature relative bg-primary p-6 md:p-8 flex flex-col gap-4 overflow-hidden cursor-default"
        >
            {/* Base layer */}
            <span className="text-xs font-mono" style={{ color: brand }}>{number}</span>
            <h3 className="text-foreground font-semibold text-base leading-snug">{title}</h3>
            <p className="text-primary-foreground text-sm leading-relaxed flex-1">{body}</p>

            {/* Wipe overlay — same content, inverted colors */}
            <div
                ref={scope}
                style={{ clipPath: BOTTOM_RIGHT_CLIP }}
                className="absolute inset-0 bg-foreground p-6 md:p-8 flex flex-col gap-4 pointer-events-none"
            >
                <span className="text-xs font-mono" style={{ color: brand }}>{number}</span>
                <h3 className="text-primary font-semibold text-base leading-snug">{title}</h3>
                <p className="text-primary/60 text-sm leading-relaxed flex-1">{body}</p>
            </div>
        </div>
    );
}