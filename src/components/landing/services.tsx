/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { services } from "@/lib/constants/serviceInfo";
import { ServiceCard } from "../ui/serviceCard";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Services() {
  const serviceWidthRef = useRef<HTMLDivElement | null>(null);
  const serviceSectionRef = useRef<HTMLDivElement | null>(null);
  const serviceBlockRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const scrollTriggersRef = useRef<any[]>([]);
  const matchMediaRef = useRef<any>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      const cards = cardsRef.current;
      if (!cards.length) return;

      if (prefersReducedMotion) {
        gsap.set([".serviceSubtitle", ".serviceline"], {
          opacity: 1,
          xPercent: 0,
        });
        gsap.set(serviceWidthRef.current, { width: "100%" });
        gsap.set(cards, { x: 0, y: 0, opacity: 1, scale: 1 });
        return;
      }

      const ctx = gsap.context(() => {
        // Subtitle block wipe
        gsap.fromTo(
          serviceBlockRef.current,
          { width: "0%", right: "0%" },
          {
            width: "100%",
            duration: 0.5,
            ease,
            scrollTrigger: {
              trigger: ".serviceSubtitle",
              start: "top 90%",
              toggleActions: "play none none none",
              onEnter: (self) => scrollTriggersRef.current.push(self),
            },
            onComplete: () => {
              gsap.to(serviceBlockRef.current, {
                width: 0,
                right: "100%",
                duration: 0.4,
                ease,
                onComplete: () => {
                  gsap.to(".serviceSubtitle", {
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
        gsap.from(serviceWidthRef.current, {
          width: 0,
          ease,
          scrollTrigger: {
            trigger: ".serviceSubtitle",
            start: "top bottom",
            end: "top 80%",
            scrub: true,
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });

        const mm = gsap.matchMedia();
        matchMediaRef.current = mm;

        mm.add(
          {
            desktop: "(min-width: 769px)",
            mobile: "(max-width: 768px)",
          },
          (context) => {
            const { desktop, mobile } = context.conditions!;

            if (desktop) {
              // Only stack/animate on desktop — never touch cards on mobile
              const positions = cards.map((card) => {
                const rect = card.getBoundingClientRect();
                return { x: rect.left, y: rect.top };
              });

              const baseIndex = 1;
              const base = positions[baseIndex];

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
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                ease,
                stagger: 0.2,
                scrollTrigger: {
                  trigger: cards[0],
                  start: "top 85%",
                  end: "top 15%",
                  scrub: true,
                  onEnter: (self) => scrollTriggersRef.current.push(self),
                },
                onComplete: () => {
                  cards.forEach((card) => {
                    gsap.set(card, { willChange: "auto" });
                  });
                },
              });
            }

            if (mobile) {
              // Ensure cards are fully visible and unstyled on mobile
              gsap.set(cards, {
                clearProps: "all",
              });
            }
          }
        );

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
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });

        return () => {
          servicelineSplit.revert();
          mm.revert();
          scrollTriggersRef.current.forEach((st) => st.kill());
          scrollTriggersRef.current = [];
          cards.forEach((card) => {
            gsap.set(card, { willChange: "auto" });
          });
        };
      }, serviceSectionRef);

      return () => {
        ctx.revert();
        if (matchMediaRef.current) {
          matchMediaRef.current.revert();
          matchMediaRef.current = null;
        }
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger?.closest(".services-section")) {
            st.kill();
          }
        });
      };
    },
    { scope: serviceSectionRef }
  );

  return (
    <section
      ref={serviceSectionRef}
      id="services"
      className="services-section min-h-screen py px bg-primary"
    >
      <div className="w-full flex justify-end mb-8">
        <div className="relative">
          <div className="relative group">
            <p
              className={cn(
                "serviceSubtitle opacity-0 relative text-sm text-foreground"
              )}
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

      <div className="relative flex justify-center items-center">
        <div className="container relative mx-auto grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
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