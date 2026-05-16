"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-init";
import { cn } from "@/lib/utils";
import { Tag } from "../ui/tag";
import { techStack } from "@/lib/constants/techstack";
import { registerWipe } from "@/hooks/useWipeReveal";

export default function Skills() {
  const skillSectionRef = useRef<HTMLDivElement | null>(null);
  const skillBlockRef   = useRef<HTMLDivElement | null>(null);
  const skillWidthRef   = useRef<HTMLDivElement | null>(null);
  const skillWidthRef2  = useRef<HTMLDivElement | null>(null);
  const skillWidthRef3  = useRef<HTMLDivElement | null>(null);
  const subtitleRef     = useRef<HTMLParagraphElement | null>(null);

  useGSAP(
    () => {
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([subtitleRef.current, ".skillParagraph"], { opacity: 1, yPercent: 0 });
        gsap.set([skillWidthRef.current, skillWidthRef2.current, skillWidthRef3.current], { width: "100%" });
        return;
      }

      const ctx = gsap.context(() => {
        // Subtitle wipe — was ~25 lines, now 8
        registerWipe(
          { blockRef: skillBlockRef, widthRef: skillWidthRef, textRef: subtitleRef },
          {
            trigger: () => subtitleRef.current,
            direction: "left",
            startOffset: "top 90%",
            underlineStart: "top 80%",
            underlineEnd: "top 50%",
            ease,
          }
        );

        // Inline underlines inside the paragraph text
        gsap.from(skillWidthRef2.current, {
          width: 0,
          ease,
          scrollTrigger: {
            trigger: ".skillParagraph",
            start: "top 65%",
            end: "top 50%",
            scrub: true,
          },
        });

        gsap.from(skillWidthRef3.current, {
          width: 0,
          ease,
          scrollTrigger: {
            trigger: ".skillParagraph",
            start: "top 65%",
            end: "top 50%",
            scrub: true,
          },
        });

        // Paragraph text reveal
        const skillSplit = new SplitText(".skillParagraph", {
          type: "chars, words, lines",
          mask: "lines",
        });

        gsap.from(skillSplit.words, {
          yPercent: 100,
          ease,
          stagger: 0.02,
          scrollTrigger: {
            trigger: ".skillParagraph",
            start: "top 70%",
            end: "top 55%",
            scrub: true,
          },
        });

        // Tech pill entrance
        const techPills = gsap.utils.toArray<HTMLElement>(".tech-pill");

        gsap.set(techPills, {
          scale: 0.88,
          opacity: 0,
          transformOrigin: "50% 50%",
          willChange: "transform, opacity",
        });

        gsap.to(techPills, {
          scale: 1,
          opacity: 1,
          duration: 0.28,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: techPills[0]?.parentElement,
            start: "top 75%",
            end: "top 55%",
            scrub: true,
          },
          onComplete: () => {
            // Remove willChange after animation — frees compositor layers
            gsap.set(techPills, { willChange: "auto" });
          },
        });

        return () => skillSplit.revert();
      }, skillSectionRef);

      return () => ctx.revert();
    },
    { scope: skillSectionRef }
  );

  return (
    <section ref={skillSectionRef} className="skills-section px py">
      {/* Subtitle */}
      <div className="relative w-fit">
        <div className="relative w-fit group">
          <p
            ref={subtitleRef}
            className={cn(
              "opacity-0 skillSubtitle relative justify-start w-fit text-sm text-foreground origin-left"
            )}
          >
            What do I build with?
          </p>
          <div
            ref={skillWidthRef}
            className={cn(
              "absolute left-0 bottom-0 h-px w-full bg-foreground",
              "origin-left scale-x-100 transition-transform duration-500 ease-(--ease-custom)",
              "group-hover:origin-right group-hover:scale-x-0"
            )}
          />
        </div>
        <div
          ref={skillBlockRef}
          className="absolute w-0 h-full top-0 left-0 pointer-events-none bg-foreground"
        />
      </div>

      {/* Paragraph 1 */}
      <div className="pt-4 w-full">
        <p className={cn("skillParagraph text-start w-full text-sm text-primary-foreground")}>
          - I build with a hybrid of the{" "}
          <span className="relative inline-block group">
            T3 and MERN stacks
            <span
              ref={skillWidthRef2}
              className={cn(
                "absolute left-0 bottom-0.5 h-px w-full bg-primary-foreground",
                "origin-left scale-x-100 transition-transform duration-500 ease-(--ease-custom)",
                "group-hover:origin-right group-hover:scale-x-0"
              )}
            />
          </span>{" "}
          for web-application builds
          <br /> and ReactNative and Flutter for Mobile Development
        </p>
      </div>

      {/* Paragraph 2 */}
      <div className="w-full flex pt-4 justify-end">
        <p className={cn("skillParagraph text-start md:text-center w-full text-sm text-primary-foreground")}>
          My{" "}
          <span className="relative inline-block group">
            not so vanity
            <span
              ref={skillWidthRef3}
              className={cn(
                "absolute left-0 bottom-0.5 h-px w-full bg-primary-foreground",
                "origin-left scale-x-100 transition-transform duration-500 ease-(--ease-custom)",
                "group-hover:origin-right group-hover:scale-x-0"
              )}
            />
          </span>{" "}
          stack is down below.
        </p>
      </div>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-3 pt-4">
        {techStack.map(({ icon, name }) => (
          <div key={name} className="tech-pill">
            <Tag icon={icon} label={name} />
          </div>
        ))}
      </div>
    </section>
  );
}