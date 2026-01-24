"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const posRef = useRef({
        mouseX: 0,
        mouseY: 0,
        destX: 0,
        destY: 0,
        rafId: 0,
    });

    const scaleRef = useRef(1);
    const targetScaleRef = useRef(1);
    const lockRef = useRef(false);
    const baseSize = 30;

    // Check if mounted and desktop
    useEffect(() => {
        setMounted(true);
        setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    }, []);

    // Apply position & scale
    const applyTransform = (x: number, y: number, s: number) => {
        const el = cursorRef.current;
        if (!el) return;

        const w = baseSize * s;
        const h = baseSize * s;

        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)`;
    };

    // Track mouse
    useEffect(() => {
        if (!mounted || !isDesktop) return;

        const handleMove = (e: MouseEvent) => {
            posRef.current.mouseX = e.clientX;
            posRef.current.mouseY = e.clientY;

            if (lockRef.current) lockRef.current = false;
        };

        window.addEventListener("mousemove", handleMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMove);
    }, [mounted, isDesktop]);

    // Scroll lock
    useEffect(() => {
        if (!mounted || !isDesktop) return;

        let lastY = window.scrollY;

        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY !== lastY) {
                lockRef.current = true;
                targetScaleRef.current = 1;
            }

            lastY = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [mounted, isDesktop]);

    // Hover scaling
    useEffect(() => {
        if (!mounted || !isDesktop) return;

        const onEnter = (e: Event) => {
            if (lockRef.current) return;

            const target = e.target as HTMLElement | null;
            if (!target) return;

            if (target.closest(".link")) targetScaleRef.current = 0;
            else if (target.closest(".navlink")) targetScaleRef.current = 0;
            else if (target.closest(".large")) targetScaleRef.current = 13;
        };

        const onLeave = () => {
            targetScaleRef.current = 1;
        };

        document.addEventListener("pointerover", onEnter, { passive: true });
        document.addEventListener("pointerout", onLeave, { passive: true });

        return () => {
            document.removeEventListener("pointerover", onEnter);
            document.removeEventListener("pointerout", onLeave);
        };
    }, [mounted, isDesktop]);

    // Animation loop
    useEffect(() => {
        if (!mounted || !isDesktop) return;

        const tick = () => {
            const p = posRef.current;

            // Smooth position
            const posEase = 0.16;
            p.destX += (p.mouseX - p.destX) * posEase;
            p.destY += (p.mouseY - p.destY) * posEase;

            // Smooth scale
            scaleRef.current += (targetScaleRef.current - scaleRef.current) * 0.17;

            applyTransform(p.destX, p.destY, scaleRef.current);

            // Expose raw mouse position and eased cursor position
            window.dispatchEvent(
                new CustomEvent("custom-cursor-move", {
                    detail: {
                        mouseX: p.mouseX,
                        mouseY: p.mouseY,
                        x: p.destX,
                        y: p.destY,
                        scale: scaleRef.current,
                    },
                })
            );

            p.rafId = requestAnimationFrame(tick);
        };

        posRef.current.rafId = requestAnimationFrame(tick);
        return () => {
            if (posRef.current.rafId) {
                cancelAnimationFrame(posRef.current.rafId);
            }
        };
    }, [mounted, isDesktop]);

    // Init cursor styles
    useEffect(() => {
        if (!mounted || !isDesktop) return;

        const el = cursorRef.current;
        if (!el) return;

        el.style.width = `${baseSize}px`;
        el.style.height = `${baseSize}px`;
        el.style.borderRadius = "50%";
        el.style.pointerEvents = "none";
        el.style.position = "fixed";
        el.style.top = "0";
        el.style.left = "0";
        el.style.zIndex = "9999";
        el.style.transform = `translate3d(-9999px,-9999px,0)`;
        el.style.transition = "background 0.18s ease, opacity 0.18s ease";
        el.style.mixBlendMode = "difference";
        el.style.background = "white";
    }, [mounted, isDesktop]);

    // Don't render anything until mounted and on desktop
    if (!mounted || !isDesktop) return null;

    return <div ref={cursorRef} aria-hidden="true" className="hidden md:block" />;
}
