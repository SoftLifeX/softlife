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
    elastic = "elastic.out(1, 0.35)",
    radius = Infinity,
    tiltStrength = 15,
    disabled = false,
}: MagneticProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const isMobile = useRef(false);
    const rafId = useRef<number | null>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const isActive = useRef(false);

    useEffect(() => {
        if (!wrapperRef.current || disabled) return;

        // Detect mobile and reduced motion preference
        isMobile.current = window.matchMedia("(max-width: 768px)").matches;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (isMobile.current || prefersReducedMotion) return;

        const wrapper = wrapperRef.current;
        let bounds: DOMRect;

        const xTo = gsap.quickTo(wrapper, "x", {
            duration: 1.15,
            ease: elastic,
            overwrite: false,
        });

        const yTo = gsap.quickTo(wrapper, "y", {
            duration: 1.15,
            ease: elastic,
            overwrite: false,
        });

        const rotateXTo = gsap.quickTo(wrapper, "rotationX", {
            duration: 1.15,
            ease: elastic,
            overwrite: false,
        });

        const rotateYTo = gsap.quickTo(wrapper, "rotationY", {
            duration: 1.15,
            ease: elastic,
            overwrite: false,
        });

        // Throttled update using RAF
        const update = () => {
            if (!isActive.current || !bounds) return;

            const { x, y } = mousePos.current;
            const distance = Math.sqrt(x * x + y * y);

            const effectiveRadius = radius === Infinity
                ? Infinity
                : Math.max(bounds.width, bounds.height) * radius;

            if (distance <= effectiveRadius) {
                const normalizedX = x / (bounds.width / 2);
                const normalizedY = y / (bounds.height / 2);

                xTo(x * strength);
                yTo(y * strength);
                rotateYTo(normalizedX * tiltStrength);
                rotateXTo(-normalizedY * tiltStrength);
            } else {
                xTo(0);
                yTo(0);
                rotateXTo(0);
                rotateYTo(0);
            }

            rafId.current = null;
        };

        const handleMouseEnter = () => {
            bounds = wrapper.getBoundingClientRect();
            isActive.current = true;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!bounds) return;

            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height / 2;

            mousePos.current = {
                x: e.clientX - centerX,
                y: e.clientY - centerY,
            };

            // Throttle updates with RAF
            if (rafId.current === null) {
                rafId.current = requestAnimationFrame(update);
            }
        };

        const handleMouseLeave = () => {
            isActive.current = false;

            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }

            xTo(0);
            yTo(0);
            rotateXTo(0);
            rotateYTo(0);
        };

        wrapper.addEventListener("mouseenter", handleMouseEnter, { passive: true });
        wrapper.addEventListener("mousemove", handleMouseMove, { passive: true });
        wrapper.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            wrapper.removeEventListener("mouseenter", handleMouseEnter);
            wrapper.removeEventListener("mousemove", handleMouseMove);
            wrapper.removeEventListener("mouseleave", handleMouseLeave);

            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [strength, elastic, radius, tiltStrength, disabled]);

    // If disabled, just return children without wrapper
    if (disabled) {
        return <>{children}</>;
    }

    return (
        <div
            style={{
                perspective: "1000px",
                display: "inline-block",
            }}
        >
            <div
                ref={wrapperRef}
                style={{
                    transformStyle: "preserve-3d",
                    display: "inline-block",
                    isolation: "isolate",
                    willChange: isActive ? "transform" : "auto",
                }}
            >
                {children}
            </div>
        </div>
    );
}