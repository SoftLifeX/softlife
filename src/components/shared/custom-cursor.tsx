"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement | null>(null);

    const posRef = useRef({
        mouseX: 0,
        mouseY: 0,
        destX: 0,
        destY: 0,
        rafId: 0,
    });

    const scaleRef = useRef(1); // eased visual scale
    const targetScaleRef = useRef(1); // intent scale
    const lockRef = useRef(false); // prevents hover scaling after scroll
    const baseSize = 30;

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
        const handleMove = (e: MouseEvent) => {
            posRef.current.mouseX = e.clientX;
            posRef.current.mouseY = e.clientY;

            // Unlock hover scaling on first real mouse move after scroll
            if (lockRef.current) lockRef.current = false;
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    // Scroll lock
    useEffect(() => {
        let lastY = window.scrollY;

        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY !== lastY) {
                // Scroll started → lock hover scaling
                lockRef.current = true;

                // Optional: shrink cursor immediately
                targetScaleRef.current = 1;
            }

            lastY = currentY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Hover scaling
    useEffect(() => {
        const onEnter = (e: Event) => {
            if (lockRef.current) return; // skip scaling if locked

            const target = e.target as HTMLElement | null;
            if (!target) return;

            if (target.closest(".link")) targetScaleRef.current = 0;
            else if (target.closest(".navlink")) targetScaleRef.current = 0;
            else if (target.closest(".large")) targetScaleRef.current = 13;
        };

        const onLeave = () => {
            targetScaleRef.current = 1; // reset scale
        };

        document.addEventListener("pointerover", onEnter);
        document.addEventListener("pointerout", onLeave);

        return () => {
            document.removeEventListener("pointerover", onEnter);
            document.removeEventListener("pointerout", onLeave);
        };
    }, []);

    // Animation loop
    useEffect(() => {
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
                        // Raw mouse position (for clip-path to ease itself)
                        mouseX: p.mouseX,
                        mouseY: p.mouseY,
                        // Eased cursor position (for reference)
                        x: p.destX,
                        y: p.destY,
                        scale: scaleRef.current,
                    },
                })
            );

            p.rafId = requestAnimationFrame(tick);
        };

        posRef.current.rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(posRef.current.rafId);
    }, []);

    // Init cursor styles
    useEffect(() => {
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
    }, []);

    return <div ref={cursorRef} aria-hidden className="hidden md:block" />;
}
