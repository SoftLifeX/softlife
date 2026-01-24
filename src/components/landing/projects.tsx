"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { project } from "@/lib/constants/project-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef } from "react";
import SplitText from "gsap/SplitText";

export default function Projects() {
    const projectsRef = useRef<HTMLDivElement>(null);
    const splitInstancesRef = useRef<SplitText[]>([]);

    useGSAP(
        () => {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const isMobile = window.innerWidth < 768;

            if (prefersReducedMotion) {
                gsap.set([".project-intro","stack-pill"], { opacity: 1, scale: 1 });
                return;
            }

            const yPercentValue = isMobile ? 0 : 20;

            // Parallax image animation
            gsap.utils.toArray<HTMLElement>(".parallax-container").forEach(
                (container) => {
                    const img = container.querySelector<HTMLImageElement>("img");

                    if (img) {
                        gsap.fromTo(
                            img,
                            {
                                yPercent: -yPercentValue,
                                ease: "none",
                            },
                            {
                                yPercent: yPercentValue,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: container as HTMLElement,
                                    start: "top bottom",
                                    end: "bottom top",
                                    scrub: true,
                                },
                            }
                        );
                    }
                }
            );

            const cards = gsap.utils.toArray<HTMLElement>(".parallax-container");

            const scale = isMobile ? 1 : 0.85;
            const opacity = isMobile ? 1 : 0

            cards.forEach((card) => {
                const pills = card.querySelectorAll<HTMLElement>(".stack-pill");

                gsap.set(pills, {
                    scale: scale,
                    opacity: opacity,
                    transformOrigin: "50% 50%",
                });

                const tl = gsap.timeline({
                    paused: true,
                    defaults: { ease: "power3.out" },
                });

                tl.to(pills, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.25,
                    stagger: 0.06,
                });

                const onEnter = () => tl.play();
                const onLeave = () => tl.reverse();

                card.addEventListener("mouseenter", onEnter);
                card.addEventListener("mouseleave", onLeave);

                gsap.context(() => {
                    return () => {
                        card.removeEventListener("mouseenter", onEnter);
                        card.removeEventListener("mouseleave", onLeave);
                        tl.kill();
                    };
                });
            });



            // SplitText reveal for intro text
            const introTexts = gsap.utils.toArray<HTMLElement>(".project-intro");

            introTexts.forEach((intro) => {
                const split = new SplitText(intro, {
                    type: "lines,words",
                    mask: "lines"
                });

                splitInstancesRef.current.push(split);

                gsap.from(split.words, {
                    yPercent: 100,
                    duration: 0.8,
                    ease: "power2.out",
                    stagger: 0.02,
                    scrollTrigger: {
                        trigger: intro,
                        start: "top 85%",
                        end: "top 60%",
                        scrub: true,
                    },
                });
            });

            return () => {
                splitInstancesRef.current.forEach((split) => {
                    split.revert();
                });
                splitInstancesRef.current = [];
            };
        },
        { scope: projectsRef }
    );

    const handleLockedClick = (e: React.MouseEvent, isDisabled?: boolean) => {
        if (isDisabled) {
            e.preventDefault();
            const target = e.currentTarget as HTMLElement;
            target.classList.add('shake-animation');
            setTimeout(() => target.classList.remove('shake-animation'), 500);
        }
    };

    return (
        <div
            ref={projectsRef}
            id="craft"
            className="my-[10svh] flex w-full flex-col items-center justify-center gap-2 px py"
        >
            {project.map((p, index) => {
                const isEven = index % 2 === 0;

                return (
                    <div
                        key={p.id}
                        className={cn(
                            "w-full flex items-center",
                            isEven ? "md:justify-start" : "md:justify-end"
                        )}
                    >
                        {/* Text on left side (for odd indexes) */}
                        {!isEven && (
                            <div className="hidden md:flex md:w-3/5 flex-col justify-end">
                                <p className="project-intro w-full max-w-xs text-sm text-primary-foreground">
                                    {p.intro}
                                </p>
                            </div>
                        )}

                        {/* Image card with Magnetic wrapper */}
                        <Link
                            href={p.disabled ? "#" : p.href}
                            onClick={(e) => handleLockedClick(e, p.disabled)}
                            className={cn(
                                "parallax-container flex h-[80svh] w-full items-center overflow-hidden md:w-23/50 rounded-lg shadow-lg group mb-8 md:mb-0",
                                p.disabled && "cursor-not-allowed"
                            )}
                        >
                            <div className="parallax-image-wrapper relative h-[120%] w-full bg-background">
                                <Image
                                    src={p.img}
                                    alt={p.title}
                                    fill
                                    sizes="100vw"
                                    className={cn(
                                        "object-cover",
                                        p.disabled && "grayscale opacity-60"
                                    )}
                                />

                                {/* Lock icon overlay for disabled projects */}
                                {p.disabled && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="var(--destructive)"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                <p
                                    className="top-33/50 md:top-18/25 left-1/20 text-sm absolute rounded-4xl py-1.5 px-2 md:px-3 md:py-2 opacity-100 md:opacity-0 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 md:transition-all md:duration-300 ease-(--ease-custom) md:group-hover:opacity-100 z-20"
                                    style={{ color: p.color, backgroundColor: p.bg }}
                                >
                                    {p.title}
                                </p>

                                <div
                                    className="absolute top-37/50 md:top-41/50 left-1/20 flex flex-wrap gap-2 z-20"
                                >
                                    {p.stack.map((tech) => (
                                        <div
                                            key={tech}
                                            className="stack-pill inline-flex items-center gap-1.5 rounded-full py-1.5 px-2 md:px-3 md:py-2 text-sm bg-background backdrop-blur-sm will-change-transform"
                                        >
                                            <span className="whitespace-nowrap text-foreground text-sm">
                                                {tech}
                                            </span>
                                        </div>
                                    ))}
                                </div>


                            </div>
                        </Link>

                        {/* Text on right side (for even indexes) */}
                        {isEven && (
                            <div className="hidden md:flex md:w-3/5 flex-col justify-end items-end">
                                <p className="project-intro w-full max-w-md text-right text-sm text-primary-foreground">
                                    {p.intro}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

}
