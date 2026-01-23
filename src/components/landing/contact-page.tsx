"use client";
import { useEffect, useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, SplitText);

// Extend CSSStyleDeclaration for WebKit properties
interface ExtendedCSSProperties extends CSSStyleDeclaration {
    WebkitClipPath?: string;
}

export default function Contact() {
    const contactRevealRef = useRef<HTMLDivElement | null>(null);
    const cursorPosRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);
    const contactSectionRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const contactBlock = useRef<HTMLDivElement | null>(null);
    const contactBlock2 = useRef<HTMLDivElement | null>(null);
    const contactBlock3 = useRef<HTMLDivElement | null>(null);
    const contactWidthRef = useRef<HTMLDivElement | null>(null);

    const easedRadiusRef = useRef(0);
    const mouseMoveRef = useRef(false);
    const [hovered, setHovered] = useState(false);
    const maskActiveRef = useRef(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scrollTriggersRef = useRef<any[]>([]);

    // Listen to CustomCursor position
    useEffect(() => {
        const handler = (e: Event) => {
            const { x, y } = (e as CustomEvent).detail;
            cursorPosRef.current.x = x;
            cursorPosRef.current.y = y;
        };

        window.addEventListener("custom-cursor-move", handler);
        return () => window.removeEventListener("custom-cursor-move", handler);
    }, []);

    // Mouse move tracker for conditional mask
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleMove = (e: MouseEvent) => {
            if (Math.abs(e.movementX) > 0 || Math.abs(e.movementY) > 0) {
                mouseMoveRef.current = true;
            }

            // Throttle: only process every 16ms (~60fps)
            if (timeoutId) return;

            timeoutId = setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                timeoutId = null as any;
            }, 16);
        };

        window.addEventListener("mousemove", handleMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleMove);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Conditional hover
    const handleMouseEnter = () => {
        if (!mouseMoveRef.current) return;
        maskActiveRef.current = true;
        setHovered(true);

        // Restart RAF if it was stopped
        if (!rafRef.current) {
            const el = contactRevealRef.current;
            if (!el) return;

            const tick = () => {
                const { x, y } = cursorPosRef.current;
                const rect = el.getBoundingClientRect();
                const localX = x - rect.left;
                const localY = y - rect.top;
                const targetRadius = maskActiveRef.current ? 195 : 0;

                const ease = maskActiveRef.current ? 0.19 : 0.35;
                easedRadiusRef.current +=
                    (targetRadius - easedRadiusRef.current) * ease;

                if (Math.abs(easedRadiusRef.current - targetRadius) < 0.01) {
                    easedRadiusRef.current = targetRadius;
                }

                const clipPath = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
                el.style.clipPath = clipPath;
                (el.style as ExtendedCSSProperties).WebkitClipPath = clipPath;

                if (
                    Math.abs(easedRadiusRef.current - targetRadius) > 0.01 ||
                    maskActiveRef.current
                ) {
                    rafRef.current = requestAnimationFrame(tick);
                } else {
                    rafRef.current = null;
                }
            };
            tick();
        }
    };

    const handleMouseLeave = () => {
        maskActiveRef.current = false;
        setHovered(false);

        // Restart RAF if it was stopped (to animate back to 0)
        if (!rafRef.current) {
            const el = contactRevealRef.current;
            if (!el) return;

            const tick = () => {
                const { x, y } = cursorPosRef.current;
                const rect = el.getBoundingClientRect();
                const localX = x - rect.left;
                const localY = y - rect.top;
                const targetRadius = maskActiveRef.current ? 195 : 0;

                const ease = maskActiveRef.current ? 0.19 : 0.35;
                easedRadiusRef.current +=
                    (targetRadius - easedRadiusRef.current) * ease;

                if (Math.abs(easedRadiusRef.current - targetRadius) < 0.01) {
                    easedRadiusRef.current = targetRadius;
                }

                const clipPath = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
                el.style.clipPath = clipPath;
                (el.style as ExtendedCSSProperties).WebkitClipPath = clipPath;

                if (
                    Math.abs(easedRadiusRef.current - targetRadius) > 0.01 ||
                    maskActiveRef.current
                ) {
                    rafRef.current = requestAnimationFrame(tick);
                } else {
                    rafRef.current = null;
                }
            };
            tick();
        }
    };

    // Clip-path loop (reads from CustomCursor)
    useEffect(() => {
        const el = contactRevealRef.current;
        if (!el) return;

        const tick = () => {
            const { x, y } = cursorPosRef.current;

            const rect = el.getBoundingClientRect();
            const localX = x - rect.left;
            const localY = y - rect.top;

            // Ease radius only
            const targetRadius = maskActiveRef.current ? 195 : 0;

            // different easing for enter vs exit
            const ease = maskActiveRef.current ? 0.19 : 0.35;

            easedRadiusRef.current += (targetRadius - easedRadiusRef.current) * ease;

            if (Math.abs(easedRadiusRef.current - targetRadius) < 0.01) {
                easedRadiusRef.current = targetRadius;
            }

            const clipPath = `circle(${easedRadiusRef.current}px at ${localX}px ${localY}px)`;
            el.style.clipPath = clipPath;
            (el.style as ExtendedCSSProperties).WebkitClipPath = clipPath;

            rafRef.current = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY !== lastY) {
                        maskActiveRef.current = false;
                        mouseMoveRef.current = false;
                        setHovered(false);
                    }
                    lastY = window.scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // GSAP Animations
    useGSAP(
        () => {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

            // Reveal elements (remove GSAP hiding)
            gsap.set(
                [
                    ".contact-heading",
                    ".description",
                    ".link-container",
                    contactBlock3.current,
                    contactBlock.current,
                    contactBlock2.current,
                ],
                { visibility: "visible" }
            );

            // If user prefers reduced motion, show everything immediately
            if (prefersReducedMotion) {
                gsap.set(
                    [".contact-heading", ".description", ".link-container"],
                    {
                        opacity: 1,
                        yPercent: 0,
                        xPercent: 0,
                    }
                );
                gsap.set([contactBlock.current, contactBlock2.current, contactBlock3.current], {
                    width: 0,
                });
                return;
            }

            const ctx = gsap.context(() => {

                // Heading text animation
                const contactSplit = new SplitText(".contact-heading", {
                    type: "chars, words",
                    mask: "chars",
                });

                gsap.set(contactSplit.chars, { xPercent: 100, opacity: 0 });

                gsap.to(contactSplit.chars, {
                    xPercent: 0,
                    opacity: 1,
                    stagger: 0.05,
                    duration: 1,
                    ease,
                    scrollTrigger: {
                        trigger: contactSectionRef.current,
                        start: "top 60%",
                        end: "top 40%",
                        scrub: true,
                        onEnter: (self) => scrollTriggersRef.current.push(self),
                    },
                });

                // Description text animation
                const descSplit = new SplitText(".description", {
                    type: "words, lines",
                    wordsClass: "des++",
                    mask: "lines",
                });

                gsap.set(descSplit.words, {
                    yPercent: 100,
                    opacity: 0,
                });

                gsap.to(descSplit.words, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.05,
                    ease,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 50%",
                        end: "top 30%",
                        scrub: true,
                        onEnter: (self) => scrollTriggersRef.current.push(self),
                    },
                });

                // Link text animation
                const linkSplit = new SplitText(".Contactlink", {
                    type: "words, lines",
                    mask: "lines",
                });

                gsap.set(linkSplit.words, { yPercent: 100, opacity: 0 });

                gsap.to(linkSplit.words, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.05,
                    ease,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 50%",
                        end: "top 30%",
                        scrub: true,
                        onEnter: (self) => scrollTriggersRef.current.push(self),
                    },
                });

                // Underline animation
                gsap.set(contactWidthRef.current, { width: 0 });

                gsap.to(contactWidthRef.current, {
                    width: "100%",
                    ease,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 50%",
                        end: "top 30%",
                        scrub: true,
                        onEnter: (self) => scrollTriggersRef.current.push(self),
                    },
                });

                return () => {
                    contactSplit.revert();
                    descSplit.revert();
                    linkSplit.revert();

                    // Kill all ScrollTriggers
                    scrollTriggersRef.current.forEach((st) => st.kill());
                    scrollTriggersRef.current = [];
                };
            }, contactSectionRef);

            return () => {
                ctx.revert();
                // Extra cleanup - kill any remaining ScrollTriggers
                ScrollTrigger.getAll().forEach((st) => {
                    if (
                        st.trigger === contactSectionRef.current ||
                        st.trigger === containerRef.current
                    ) {
                        st.kill();
                    }
                });
            };
        },
        { scope: contactSectionRef }
    );

    return (
        <section
            ref={contactSectionRef}
            id="contact"
            className="px py relative min-h-svh bg-foreground font-light"
        >
            <div ref={containerRef} className="contact justify-center items-center">
                <div
                    data-speed="1.1"
                    className="relative w-full flex pt-10 pb-6 md:pb-12"
                >
                    <div className="relative w-full">
                        <h1
                            className="contact-heading gsap-hide large text-4xl md:text-8xl text-center leading-tight text-background"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            aria-level={1}
                        >
                            IT ALL STARTS WITH A CONVERSATION
                            <br />
                        </h1>

                        {/* Mask text - reveal on hover */}
                        <div
                            ref={contactRevealRef}
                            className="w-full contact-reveal hidden md:block pointer-events-none absolute inset-0 leading-tight text-4xl md:text-8xl z-10 bg-foreground text-center text-background"
                            style={{
                                opacity: hovered ? 1 : 0,
                                transition: "opacity 0s ease",
                                willChange: "clip-path",
                            }}
                            aria-hidden="true"
                        >
                            JUST SAY HELLO  <br /> IT&apos;S NOT THAT DEEP
                        </div>
                    </div>

                </div>

                <div className="pb-6">
                    <div className="w-full flex text-center items-center justify-center">
                        <div className="relative w-fit">
                            <p className="description relative gsap-hide text-sm text-background">
                                No matter what stage of the process you&apos;re in, we recommend getting in touch.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col md:flex-row w-full items-start md:justify-center md:items-center">
                    <div className="link-container gsap-hide relative flex flex-col md:flex-row items-start md:justify-center md:items-center w-full gap-4">
                        <Link
                            href="mailto:daniel.c.daniel.dev@gmail.com"
                            className="link relative inline-block text-sm text-primary-foreground group"
                        >

                            <span className="relative block h-[1.2em] overflow-hidden z-10">
                                <span className="Contactlink block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-8">
                                    daniel.c.daniel.dev@gmail.com
                                </span>
                                <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
                                    daniel.c.daniel.dev@gmail.com
                                </span>
                            </span>

                            <span
                                ref={contactWidthRef}
                                className="absolute left-0 right-0 -bottom-px h-px bg-current z-0 origin-left scale-x-100 transition-transform duration-500 ease-(--ease-custom) group-hover:origin-right group-hover:scale-x-0"
                            />
                        </Link>

                        <Link
                            href="tel:+2348139331585"
                            target="_blank"
                            className="link relative inline-block text-sm text-primary-foreground group"
                        >

                            <span className="relative block h-[1.2em] overflow-hidden z-10">
                                <span className="Contactlink block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-8">
                                    +2348139331585
                                </span>
                                <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
                                    +2348139331585
                                </span>
                            </span>

                            <span
                                className="absolute left-0 right-0 -bottom-px h-px bg-current z-0 origin-right scale-x-0 transition-transform duration-500 ease-(--ease-custom) group-hover:origin-left group-hover:scale-x-100"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}