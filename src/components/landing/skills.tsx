"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "@/lib/gsap-init";
import { cn } from "@/lib/utils";
import { Tag } from "../ui/tag";
import { techStack } from "@/lib/constants/techstack";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";
import { useGsapScope } from "@/hooks/useGsapScope";
import { WipeLabel, useWipeRefs } from "@/lib/animations/wipeLabel";
import { EASE } from "@/lib/animations/tokens";

export default function Skills() {
  const skillSectionRef = useRef<HTMLDivElement | null>(null);
  const skillLabel = useWipeRefs();
  const skillWidthRef2 = useRef<HTMLDivElement | null>(null);
  const skillWidthRef3 = useRef<HTMLDivElement | null>(null);
  const ready = usePageReady();

  useGsapScope(skillSectionRef, {
    ready,

    reducedMotionFallback: () => {
      gsap.set(skillLabel.textRef.current, { visibility: "visible", opacity: 1, yPercent: 0 });
      gsap.set(".skillParagraph", { visibility: "visible", opacity: 1, yPercent: 0 });
      gsap.set([skillLabel.widthRef.current, skillWidthRef2.current, skillWidthRef3.current], { width: "100%" });
      gsap.set(".tech-pill", { scale: 1, opacity: 1 });
    },

    animate: () => {
      gsap.set(skillLabel.textRef.current, { visibility: "visible" });
      registerWipe(skillLabel, {
        trigger: () => skillLabel.textRef.current,
        direction: "left",
        startOffset: "top 90%",
        underlineStart: "top 80%",
        underlineEnd: "top 50%",
        ease: EASE,
      });

      gsap.from(skillWidthRef2.current, {
        width: 0,
        ease: EASE,
        scrollTrigger: { trigger: ".skillParagraph", start: "top 65%", end: "top 50%", scrub: true },
      });
      gsap.from(skillWidthRef3.current, {
        width: 0,
        ease: EASE,
        scrollTrigger: { trigger: ".skillParagraph", start: "top 65%", end: "top 50%", scrub: true },
      });

      const techPills = gsap.utils.toArray<HTMLElement>(".tech-pill");
      gsap.set(techPills, { scale: 0.88, opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" });
      gsap.to(techPills, {
        scale: 1,
        opacity: 1,
        duration: 0.28,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: techPills[0]?.parentElement, start: "top 75%", end: "top 55%", scrub: true },
        onComplete: () => {
          gsap.set(techPills, { willChange: "auto" });
        },
      });
    },

    animateWithSplitText: (ctx) => {
      gsap.set(".skillParagraph", { visibility: "visible" });
      const skillSplit = new SplitText(".skillParagraph", { type: "chars, words, lines", mask: "lines" });

      gsap.fromTo(
        skillSplit.words,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: EASE,
          stagger: 0.02,
          scrollTrigger: { trigger: ".skillParagraph", start: "top 70%", end: "top 55%", scrub: true },
        }
      );

      ctx.add(() => () => skillSplit.revert());
    },
  });

  return (
    <section ref={skillSectionRef} className="skills-section px py">
      <WipeLabel {...skillLabel} label="What do I build with?" />

      <div className="pt-4 w-full">
        <p className="skillParagraph gsap-hide text-start w-full text-sm text-primary-foreground">
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

      <div className="w-full flex pt-4 justify-end">
        <p className="skillParagraph gsap-hide text-start md:text-center w-full text-sm text-primary-foreground">
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