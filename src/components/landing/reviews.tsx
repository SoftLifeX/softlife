"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap-init";
import { reviewItems } from "@/lib/constants/reviewInfo";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";
import { useGsapScope } from "@/hooks/useGsapScope";
import { WipeLabel, useWipeRefs } from "@/lib/animations/wipeLabel";
import FeatureCard from "@/components/ui/featureCard";
import { EASE } from "@/lib/animations/tokens";

const BRAND_PALETTE = ["#2466F2", "#F24E24", "#24C2A0", "#B024F2"];

export default function Reviews() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const topLabel = useWipeRefs();
  const botLabel = useWipeRefs();
  const ready = usePageReady();

  useGsapScope(sectionRef, {
    ready,

    reducedMotionFallback: () => {
      gsap.set(topLabel.textRef.current, { visibility: "visible", opacity: 1 });
      gsap.set(botLabel.textRef.current, { visibility: "visible", opacity: 1 });
      gsap.set([topLabel.widthRef.current, botLabel.widthRef.current], { width: "100%" });
      gsap.set(".review-card", { visibility: "visible", opacity: 1, y: 0, pointerEvents: "auto" });
    },

    animate: () => {
      gsap.set([topLabel.textRef.current, botLabel.textRef.current], { visibility: "visible" });

      registerWipe(topLabel, {
        trigger: () => topLabel.textRef.current,
        direction: "left",
        startOffset: "top 90%",
        underlineStart: "top 80%",
        underlineEnd: "top 50%",
        ease: EASE,
      });
      registerWipe(botLabel, {
        trigger: () => botLabel.textRef.current,
        direction: "right",
        startOffset: "top 90%",
        underlineStart: "top 80%",
        underlineEnd: "top 50%",
        ease: EASE,
      });

      const cards = gsap.utils.toArray<HTMLElement>(".review-card");
      gsap.set(cards, { visibility: "visible" });
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0, pointerEvents: "none" },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
            delay: (i % 3) * 0.08,
            onComplete: () => {
              gsap.set(card, { pointerEvents: "auto" });
            },
          }
        );
      });
    },
  });

  return (
    <div ref={sectionRef} className="reviews-section bg-primary py-16 md:py-24">
      <div className="px-4 pb-8 md:pb-12">
        <WipeLabel {...topLabel} label="But don't just take my word for it" />
      </div>

      <div className="px grid grid-cols-1 md:grid-cols-4 divide-x divide-y divide-foreground/10 border border-foreground/10">
        {reviewItems.map((review, i) => (
          <div key={review.id} className="review-card gsap-hide">
            <FeatureCard
              number={String(i + 1).padStart(2, "0")}
              title={`${review.name} — ${review.role}, ${review.company}`}
              body={review.text}
              brand={BRAND_PALETTE[i % BRAND_PALETTE.length]}
            />
          </div>
        ))}
      </div>

      <div className="px-4 pt-8 md:pt-12">
        <WipeLabel {...botLabel} label="Here's what they said" align="right" />
      </div>
    </div>
  );
}