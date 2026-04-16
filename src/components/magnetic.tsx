"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";

interface MagneticProps {
    children: ReactNode;
    strength?: number;
    elastic?: string;
    radius?: number;
    tiltStrength?: number;
    disabled?: boolean;
}

export default function Magnetic({
    children,
    strength = 0.35,
    elastic = "power3.out",
    radius = Infinity,
    tiltStrength = 15,
    disabled = false,
}: MagneticProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const boundsRef = useRef<DOMRect | null>(null);

    useEffect(() => {
        if (!wrapperRef.current || disabled) return;

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (isMobile || prefersReducedMotion) return;

        const wrapper = wrapperRef.current;

        // overwrite: "auto" lets GSAP merge/replace conflicting tweens cleanly
        const xTo       = gsap.quickTo(wrapper, "x",         { duration: 0.6, ease: elastic, overwrite: "auto" });
        const yTo       = gsap.quickTo(wrapper, "y",         { duration: 0.6, ease: elastic, overwrite: "auto" });
        const rotateXTo = gsap.quickTo(wrapper, "rotationX", { duration: 0.6, ease: "power2.out", overwrite: "auto" });
        const rotateYTo = gsap.quickTo(wrapper, "rotationY", { duration: 0.6, ease: "power2.out", overwrite: "auto" });

        const refreshBounds = () => {
            boundsRef.current = wrapper.getBoundingClientRect();
        };

        const handleMouseEnter = (e: MouseEvent) => {
            refreshBounds();
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!boundsRef.current) refreshBounds();
            const bounds = boundsRef.current!;

            const x = e.clientX - (bounds.left + bounds.width  / 2);
            const y = e.clientY - (bounds.top  + bounds.height / 2);
            const distance = Math.sqrt(x * x + y * y);

            const effectiveRadius =
                radius === Infinity
                    ? Infinity
                    : Math.max(bounds.width, bounds.height) * radius;

            if (distance <= effectiveRadius) {
                const normalizedX = x / (bounds.width  / 2);
                const normalizedY = y / (bounds.height / 2);

                xTo(x * strength);
                yTo(y * strength);
                rotateYTo( normalizedX * tiltStrength);
                rotateXTo(-normalizedY * tiltStrength);
            } else {
                xTo(0);
                yTo(0);
                rotateXTo(0);
                rotateYTo(0);
            }
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
            rotateXTo(0);
            rotateYTo(0);
        };

        window.addEventListener("scroll", refreshBounds, { passive: true });
        window.addEventListener("resize", refreshBounds, { passive: true });
        wrapper.addEventListener("mouseenter", handleMouseEnter);
        wrapper.addEventListener("mousemove",  handleMouseMove,  { passive: true });
        wrapper.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("scroll", refreshBounds);
            window.removeEventListener("resize", refreshBounds);
            wrapper.removeEventListener("mouseenter", handleMouseEnter);
            wrapper.removeEventListener("mousemove",  handleMouseMove);
            wrapper.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength, elastic, radius, tiltStrength, disabled]);

    if (disabled) return <>{children}</>;

    return (
        <div style={{ perspective: "1000px", display: "inline-block" }}>
            <div
                ref={wrapperRef}
                style={{
                    transformStyle: "preserve-3d",
                    display: "inline-block",
                    isolation: "isolate",
                    willChange: "transform",
                }}
            >
                {children}
            </div>
        </div>
    );
}