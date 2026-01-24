"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useState } from "react";
import { reviewItems, type Review } from "@/lib/constants/reviewInfo";
import { cn } from "@/lib/utils";
import Magnetic from "../magnetic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Reviews() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const reviewWidth = useRef<HTMLDivElement | null>(null);
    const reviewBlockRef = useRef<HTMLDivElement | null>(null);
    const reviewTextRef = useRef<HTMLParagraphElement | null>(null);

    const reviewWidth2 = useRef<HTMLDivElement | null>(null);
    const reviewBlockRef2 = useRef<HTMLDivElement | null>(null);
    const reviewTextRef2 = useRef<HTMLParagraphElement | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scrollTriggersRef = useRef<any[]>([]);

    useGSAP(
        () => {
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

            // user prefers reduced motion, show everything immediately
            if (prefersReducedMotion) {
                gsap.set(reviewTextRef.current, {
                    opacity: 1,
                    yPercent: 0,
                });
                gsap.set(reviewWidth.current, {
                    width: "100%",
                });

                gsap.set(reviewTextRef2.current, {
                    opacity: 1,
                    yPercent: 0,
                });
                gsap.set(reviewWidth2.current, {
                    width: "100%",
                });
                return;
            }

            const ctx = gsap.context(() => {
                // Wipe animation
                gsap.fromTo(
                    reviewBlockRef.current,
                    {
                        width: "0%",
                        left: "0%",
                    },
                    {
                        width: "100%",
                        duration: 0.5,
                        ease,
                        scrollTrigger: {
                            trigger: reviewTextRef.current,
                            start: "top 90%",
                            toggleActions: "play none none none",
                            onEnter: (self) => scrollTriggersRef.current.push(self),
                        },
                        onComplete: () => {
                            gsap.to(reviewBlockRef.current, {
                                width: 0,
                                left: "100%",
                                duration: 0.4,
                                ease,
                                onComplete: () => {
                                    // Use the ref directly instead of class selector
                                    gsap.to(reviewTextRef.current, {
                                        opacity: 1,
                                        duration: 0.1,
                                        ease,
                                    });
                                },
                            });
                        },
                    }
                );

                // Underline animation
                gsap.from(reviewWidth.current, {
                    width: 0,
                    stagger: 1,
                    ease,
                    scrollTrigger: {
                        trigger: reviewTextRef.current,
                        start: "top 80%",
                        end: "top 50%",
                        scrub: true,
                        onEnter: (self) => scrollTriggersRef.current.push(self),
                    },
                });

                gsap.fromTo(
                    reviewBlockRef2.current,
                    {
                        width: "0%",
                        right: "0%",
                    },
                    {
                        width: "100%",
                        duration: 0.5,
                        ease,
                        scrollTrigger: {
                            trigger: reviewTextRef2.current,
                            start: "top 90%",
                            toggleActions: "play none none none",
                            onEnter: (self) => scrollTriggersRef.current.push(self),
                        },
                        onComplete: () => {
                            gsap.to(reviewBlockRef2.current, {
                                width: 0,
                                right: "100%",
                                duration: 0.4,
                                ease,
                                onComplete: () => {
                                    // Use the ref directly instead of class selector
                                    gsap.to(reviewTextRef2.current, {
                                        opacity: 1,
                                        duration: 0.1,
                                        ease,
                                    });
                                },
                            });
                        },
                    }
                );

                // Underline animation
                gsap.from(reviewWidth2.current, {
                    width: 0,
                    stagger: 1,
                    ease,
                    scrollTrigger: {
                        trigger: reviewTextRef2.current,
                        start: "top 80%",
                        end: "top 50%",
                        scrub: true,
                        onEnter: (self) => scrollTriggersRef.current.push(self),
                    },
                });

                // Card scale animations
                gsap.utils.toArray<HTMLElement>(".card-container").forEach(
                    (container) => {
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: container,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 0.5,
                                onEnter: (self) => scrollTriggersRef.current.push(self),
                            },
                        });

                        tl.fromTo(
                            container,
                            { scale: 0.5 },
                            { scale: 1, ease: "none", duration: 0.6 }
                        ).to(container, {
                            scale: 0.5,
                            opacity: 0,
                            ease: "none",
                            duration: 0.3,
                        });
                    }
                );

                // Clean up ScrollTriggers
                return () => {
                    scrollTriggersRef.current.forEach(st => st.kill());
                    scrollTriggersRef.current = [];
                };
            }, containerRef);

            return () => {
                ctx.revert();

                // Extra cleanup - kill any remaining ScrollTriggers
                ScrollTrigger.getAll().forEach(st => {
                    if (st.trigger?.closest('.reviews-section')) {
                        st.kill();
                    }
                });
            };
        },
        { scope: containerRef }
    );

    useEffect(() => {
        const handleScroll = (): void => {
            const viewportCenter = window.innerHeight / 2;
            let closestIndex = 0;
            let minDistance = Infinity;

            itemRefs.current.forEach((ref, index) => {
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(viewportCenter - elementCenter);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                }
            });

            setActiveIndex(closestIndex);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="reviews-section min-h-screen py px bg-primary">
            <div className="relative w-fit">
                <div className="relative w-fit group">
                    <p
                        ref={reviewTextRef}
                        className={cn(
                            "review opacity-0 relative justify-start w-fit text-sm font text-foreground origin-left"
                        )}
                    >
                        But don&apos;t just take my word for it
                    </p>

                    <div
                        ref={reviewWidth}
                        className={cn(
                            "absolute left-0 bottom-0 h-px w-full bg-foreground",
                            "origin-left scale-x-100 transition-transform duration-500 ease-(--ease-custom)",
                            "group-hover:origin-right group-hover:scale-x-0"
                        )}
                    />
                </div>

                <div
                    ref={reviewBlockRef}
                    className="absolute w-0 h-full top-0 left-0 pointer-events-none bg-foreground"
                />
            </div>

            

            <div
                ref={containerRef}
                className="relative flex w-full flex-col items-center gap-[18.5svh]"
            >
                <div className="px-4">
                    {reviewItems.map((review: Review, index: number) => (
                        <div
                            key={review.id}
                            ref={(el) => {
                                itemRefs.current[index] = el;
                            }}
                            className="card-container flex justify-center items-center mb-[18.5svh]"
                        >
                            <Magnetic>
                                <div className="bg-background w-100 md:h-100 rounded-lg shadow-lg p-8">
                                <p className="mt-6 mb-6 pt-10 text-foreground text-sm leading-relaxed">
                                    &ldquo; {review.text}&ldquo;
                                </p>

                                <div className="">
                                    <h3 className="text-sm font-semibold text-foreground text-end mb-3">
                                        {review.name}
                                    </h3>
                                    <p className="text-sm text-primary-foreground text-end">
                                        {review.role} · {review.company}
                                    </p>
                                </div>
                            </div>
                            </Magnetic>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}