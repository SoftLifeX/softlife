"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-init";
import { reviewItems, type Review } from "@/lib/constants/reviewInfo";
import { cn } from "@/lib/utils";
import Magnetic from "../magnetic";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";

const SLOT = {
  center: { x: 0, y: 0, z: 0, ry: 0, rz: 0, scale: 1, opacity: 1, zIndex: 10 },
  back1: { x: 22, y: 12, z: -70, ry: 5, rz: 2, scale: 0.95, opacity: 0.65, zIndex: 5 },
  back2: { x: 42, y: 24, z: -140, ry: 10, rz: 4, scale: 0.90, opacity: 0.35, zIndex: 3 },
  hidden: { x: 0, y: 0, z: -220, ry: 0, rz: 0, scale: 0.88, opacity: 0, zIndex: 1 },
} as const;

type Slot = keyof typeof SLOT;

const getSlots = (centerIdx: number, total: number): Slot[] =>
  Array.from({ length: total }, (_, i) => {
    const dist = ((i - centerIdx) + total) % total;
    if (dist === 0) return "center";
    if (dist === 1) return "back1";
    if (dist === 2) return "back2";
    return "hidden";
  });

export default function Reviews() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Top wipe refs
  const topBlockRef = useRef<HTMLDivElement | null>(null);
  const topWidthRef = useRef<HTMLDivElement | null>(null);
  const topTextRef = useRef<HTMLParagraphElement | null>(null);

  // Bottom wipe refs
  const botBlockRef = useRef<HTMLDivElement | null>(null);
  const botWidthRef = useRef<HTMLDivElement | null>(null);
  const botTextRef = useRef<HTMLParagraphElement | null>(null);

  const ready = usePageReady();

  useGSAP(
    () => {
      if (!ready) return;

      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([topTextRef.current, botTextRef.current], { opacity: 1 });
        gsap.set([topWidthRef.current, botWidthRef.current], { width: "100%" });
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          gsap.set(card, {
            position: "absolute", top: 0, left: 0, width: "100%",
            opacity: i === 0 ? 1 : 0,
          });
        });
        return;
      }

      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          registerWipe(
            { blockRef: topBlockRef, widthRef: topWidthRef, textRef: topTextRef },
            { trigger: () => topTextRef.current, direction: "left", startOffset: "top 90%", underlineStart: "top 80%", underlineEnd: "top 50%", ease }
          );
          registerWipe(
            { blockRef: botBlockRef, widthRef: botWidthRef, textRef: botTextRef },
            { trigger: () => botTextRef.current, direction: "right", startOffset: "top 90%", underlineStart: "top 80%", underlineEnd: "top 50%", ease }
          );

          const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
          const total = cards.length;

          const initialSlots = getSlots(0, total);
          cards.forEach((card, i) => {
            const s = SLOT[initialSlots[i]];
            gsap.set(card, {
              position: "absolute", top: 0, left: 0, width: "100%",
              x: s.x, y: s.y, z: s.z,
              rotateY: s.ry, rotateZ: s.rz,
              scale: s.scale, opacity: s.opacity, zIndex: s.zIndex,
            });
          });

          const scrollPerCard = window.innerHeight * 0.85;
          let currentIndex = 0;
          let pendingIndex = 0;

          const goTo = (nextIndex: number, direction: "next" | "prev") => {
            if (nextIndex === pendingIndex) return;
            pendingIndex = nextIndex;

            const springEase = "cubic-bezier(0.23, 1, 0.32, 1)";
            const exitEase = "cubic-bezier(0.4, 0, 1, 1)";
            const exitX = direction === "next" ? -380 : 380;
            const exitRY = direction === "next" ? -28 : 28;
            const exitRZ = direction === "next" ? -14 : 14;
            const enterX = direction === "next" ? 380 : -380;
            const enterRY = direction === "next" ? 32 : -32;
            const enterRZ = direction === "next" ? 10 : -10;

            gsap.killTweensOf(cards[currentIndex]);
            gsap.killTweensOf(cards[nextIndex]);

            gsap.to(cards[currentIndex], {
              x: exitX, y: -30, z: 0,
              rotateY: exitRY, rotateZ: exitRZ,
              scale: 0.84, opacity: 0,
              duration: 0.52, ease: exitEase, zIndex: 20,
            });

            gsap.set(cards[nextIndex], {
              x: enterX, y: -18, z: 20,
              rotateY: enterRY, rotateZ: enterRZ,
              scale: 0.88, opacity: 0, zIndex: 15,
            });

            gsap.to(cards[nextIndex], {
              x: 0, y: 0, z: 0,
              rotateY: 0, rotateZ: 0,
              scale: 1, opacity: 1,
              duration: 0.62, ease: springEase, delay: 0.06, zIndex: 10,
            });

            const newSlots = getSlots(nextIndex, total);
            cards.forEach((card, i) => {
              if (i === currentIndex || i === nextIndex) return;
              const s = SLOT[newSlots[i]];
              gsap.to(card, {
                x: s.x, y: s.y, z: s.z,
                rotateY: s.ry, rotateZ: s.rz,
                scale: s.scale, opacity: s.opacity, zIndex: s.zIndex,
                duration: 0.55, ease: springEase,
              });
            });

            gsap.delayedCall(0.65, () => {
              const prevIndex = currentIndex;
              currentIndex = nextIndex;
              setActiveIndex(nextIndex);

              gsap.set(cards[prevIndex], {
                x: 0, y: 0, z: -220,
                rotateY: 0, rotateZ: 0,
                scale: 0.88, opacity: 0, zIndex: 1,
              });

              if (pendingIndex !== currentIndex) {
                goTo(pendingIndex, pendingIndex > currentIndex ? "next" : "prev");
              }
            });
          };

          ScrollTrigger.create({
            trigger: pinnedRef.current,
            start: "top top",
            end: `+=${scrollPerCard * (total - 1)}`,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              const rawIndex = self.progress * (total - 1);
              const direction = self.direction === 1 ? "next" : "prev";
              const nextIndex = self.direction === 1
                ? Math.min(Math.ceil(rawIndex), total - 1)
                : Math.max(Math.floor(rawIndex), 0);
              if (nextIndex !== pendingIndex) goTo(nextIndex, direction);
            },
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  return (
    <div ref={sectionRef} className="reviews-section bg-primary">

      {/* ── Top headline ─────────────────────────────────────────────────── */}
      <div className="px-4 pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="relative w-fit">
          <div className="relative w-fit group">
            <p
              ref={topTextRef}
              className="opacity-0 relative w-fit text-sm text-foreground origin-left"
            >
              But don&apos;t just take my word for it
            </p>
            <div
              ref={topWidthRef}
              className={cn(
                "absolute left-0 bottom-0 h-px w-full bg-foreground",
                "origin-left transition-transform duration-500 ease-(--ease-custom)",
                "group-hover:origin-right group-hover:scale-x-0"
              )}
            />
          </div>
          <div
            ref={topBlockRef}
            className="absolute w-0 h-full top-0 left-0 pointer-events-none bg-foreground"
          />
        </div>
      </div>

      {/* ── Pinned card stack ─────────────────────────────────────────────── */}
      <div
        ref={pinnedRef}
        className="relative w-full flex items-center justify-center"
        style={{ height: "100svh" }}
      >
        <div
          className="relative w-full max-w-xs sm:max-w-sm"
          style={{ height: 400, perspective: "1000px", perspectiveOrigin: "50% 40%" }}
        >
          {reviewItems.map((review: Review, index: number) => (
            <div
              key={review.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
            >
              <Magnetic>
                <div className="bg-background rounded-2xl p-8 w-full">
                  <span className="block text-4xl font-serif text-foreground/20 leading-none mb-3">
                    &ldquo;
                  </span>
                  <p className="text-foreground text-sm leading-relaxed mb-8">
                    {review.text}
                  </p>
                  <div className="border-t border-foreground/10 pt-5">
                    <h3 className="text-sm font-semibold text-foreground text-end">
                      {review.name}
                    </h3>
                    <p className="text-xs text-primary-foreground text-end mt-1">
                      {review.role} · {review.company}
                    </p>
                  </div>
                </div>
              </Magnetic>
            </div>
          ))}

          {/* Dot indicators */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2 items-center">
            {reviewItems.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "block h-1.5 rounded-full bg-foreground transition-all duration-300",
                  i === activeIndex ? "w-5 opacity-100" : "w-1.5 opacity-25"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom headline ───────────────────────────────────────────────── */}
      <div className="px-4 pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="relative w-fit ml-auto">
          <div className="relative w-fit group">
            <p
              ref={botTextRef}
              className="opacity-0 relative w-fit text-sm text-foreground origin-right"
            >
              Here&apos;s what they said
            </p>
            <div
              ref={botWidthRef}
              className={cn(
                "absolute left-0 bottom-0 h-px w-full bg-foreground",
                "origin-right transition-transform duration-500 ease-(--ease-custom)",
                "group-hover:origin-left group-hover:scale-x-0"
              )}
            />
          </div>
          <div
            ref={botBlockRef}
            className="absolute w-0 h-full top-0 right-0 pointer-events-none bg-foreground"
          />
        </div>
      </div>
    </div>
  );
}