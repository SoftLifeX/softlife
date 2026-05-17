"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-init";
import { services } from "@/lib/constants/serviceInfo";
import { ServiceCard } from "../ui/serviceCard";
import { cn } from "@/lib/utils";
import { registerWipe } from "@/hooks/useWipeReveal";

export default function Services() {
  const serviceSectionRef = useRef<HTMLDivElement | null>(null);
  const serviceBlockRef   = useRef<HTMLDivElement | null>(null);
  const serviceWidthRef   = useRef<HTMLDivElement | null>(null);
  const subtitleRef       = useRef<HTMLParagraphElement | null>(null);
  const cardsRef          = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      const cards = cardsRef.current.filter(Boolean);
      if (!cards.length) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([subtitleRef.current, ".serviceline"], { opacity: 1, xPercent: 0 });
        gsap.set(serviceWidthRef.current, { width: "100%" });
        gsap.set(cards, { x: 0, y: 0, opacity: 1, scale: 1 });
        return;
      }

      const ctx = gsap.context(() => {
        // Subtitle wipe
        registerWipe(
          { blockRef: serviceBlockRef, widthRef: serviceWidthRef, textRef: subtitleRef },
          {
            trigger: () => subtitleRef.current,
            direction: "right",
            startOffset: "top 90%",
            underlineStart: "top bottom",
            underlineEnd: "top 80%",
            ease,
          }
        );

        // Card stack animation — desktop only
        const mm = gsap.matchMedia();

        mm.add(
          { desktop: "(min-width: 769px)", mobile: "(max-width: 768px)" },
          (context) => {
            const { desktop, mobile } = context.conditions!;

            if (desktop) {
              const positions = cards.map((card) => {
                const rect = card.getBoundingClientRect();
                return { x: rect.left, y: rect.top };
              });
              const base = positions[1]; // index 1 as origin

              cards.forEach((card, i) => {
                gsap.set(card, {
                  x: base.x - positions[i].x,
                  y: base.y - positions[i].y,
                  opacity: 0,
                  scale: 0,
                  willChange: "opacity, transform",
                });
              });

              gsap.to(cards, {
                x: 0, y: 0, opacity: 1, scale: 1,
                ease, stagger: 0.2,
                scrollTrigger: {
                  trigger: cards[0],
                  start: "top bottom",
                  end: "top 35%",
                  scrub: true,
                },
                onComplete: () => {
                  cards.forEach((card) => gsap.set(card, { willChange: "auto" }));
                },
              });
            }

            if (mobile) {
              gsap.set(cards, { clearProps: "all" });
            }
          }
        );

        // Decorative centre text reveal
        const servicelineSplit = new SplitText(".serviceline", {
          type: "chars, words",
          mask: "chars",
        });

        gsap.from(servicelineSplit.chars, {
          xPercent: 100,
          ease,
          stagger: 0.02,
          scrollTrigger: {
            trigger: ".serviceline",
            start: "top 80%",
            end: "top 65%",
            scrub: true,
          },
        });

        return () => {
          servicelineSplit.revert();
          mm.revert();
        };
      }, serviceSectionRef);

      return () => ctx.revert();
    },
    { scope: serviceSectionRef }
  );

  return (
    <section
      ref={serviceSectionRef}
      id="services"
      className="services-section min-h-screen py px bg-primary"
    >
      {/* Subtitle */}
      <div className="w-full flex justify-end mb-8">
        <div className="relative">
          <div className="relative group">
            <p
              ref={subtitleRef}
              className={cn("serviceSubtitle opacity-0 relative text-sm text-foreground")}
            >
              So what do I do, exactly?
            </p>
            <div
              ref={serviceWidthRef}
              className={cn(
                "absolute right-0 bottom-0 h-px w-full bg-foreground",
                "origin-right scale-x-100 transition-transform duration-500 ease-(--ease-custom)",
                "group-hover:origin-left group-hover:scale-x-0"
              )}
            />
          </div>
          <div
            ref={serviceBlockRef}
            className="absolute w-0 h-full top-0 right-0 pointer-events-none bg-foreground"
          />
        </div>
      </div>

      {/* Cards + centre text */}
      <div className="relative flex justify-center items-center">
        <div className="container relative mx-auto grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => { if (el) cardsRef.current[index] = el; }}
            >
              <ServiceCard
                index={index}
                title={service.title}
                animation={service.animation}
                description={service.description}
              />
            </div>
          ))}
        </div>

        <div className="absolute hidden md:block">
          <p className="serviceline text-sm">
            who says you can&apos;t impress your clients, <br />
            while making your competition jealous :)
          </p>
        </div>
      </div>
    </section>
  );
}