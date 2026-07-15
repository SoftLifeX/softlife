"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "@/lib/gsap-init";
import { cn } from "@/lib/utils";
import { Tag } from "../ui/tag";
import { techStack, type TechStackCategory } from "@/lib/constants/techstack";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";
import { useGsapScope } from "@/hooks/useGsapScope";
import { WipeLabel, useWipeRefs } from "@/lib/animations/wipeLabel";
import { EASE } from "@/lib/animations/tokens";

const leftCategories = techStack
  .slice(0, 3)
  .map((cat, i) => ({ ...cat, originalIndex: i }));
const rightCategories = techStack
  .slice(3)
  .map((cat, i) => ({ ...cat, originalIndex: i + 3 }));

export default function Skills() {
  const skillSectionRef = useRef<HTMLDivElement | null>(null);
  const skillLabel = useWipeRefs();
  const skillWidthRef2 = useRef<HTMLDivElement | null>(null);
  const skillWidthRef3 = useRef<HTMLDivElement | null>(null);
  const categoriesContainerRef = useRef<HTMLDivElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const ready = usePageReady();

  const categoryUnderlineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const setCategoryUnderlineRef = (index: number) => (el: HTMLSpanElement | null) => {
    categoryUnderlineRefs.current[index] = el;
  };

  useGsapScope(skillSectionRef, {
    ready,

    reducedMotionFallback: () => {
      gsap.set(skillLabel.textRef.current, { visibility: "visible", opacity: 1, yPercent: 0 });
      gsap.set(".skillParagraph", { visibility: "visible", opacity: 1, yPercent: 0 });
      gsap.set(".skill-category-heading", { visibility: "visible", opacity: 1, yPercent: 0 });
      gsap.set(
        [
          skillLabel.widthRef.current,
          skillWidthRef2.current,
          skillWidthRef3.current,
          ...categoryUnderlineRefs.current,
        ],
        { width: "100%" }
      );
      gsap.set(dividerRef.current, { height: "100%" });
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

      const categoryEls = gsap.utils.toArray<HTMLElement>(".skill-category");

      categoryUnderlineRefs.current.forEach((el) => {
        if (!el) return;
        const categoryEl = el.closest(".skill-category");
        if (!categoryEl) return;

        gsap.from(el, {
          width: 0,
          ease: EASE,
          scrollTrigger: { trigger: categoryEl, start: "top 65%", end: "top 50%", scrub: true },
        });
      });

      gsap.from(dividerRef.current, {
        height: 0,
        ease: EASE,
        scrollTrigger: {
          trigger: categoriesContainerRef.current,
          start: "top 75%",
          end: "bottom 70%",
          scrub: true,
        },
      });
      
      categoryEls.forEach((categoryEl) => {
        const pills = gsap.utils.toArray<HTMLElement>(".tech-pill", categoryEl);
        if (!pills.length) return;

        gsap.set(pills, { scale: 0.88, opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" });
        gsap.to(pills, {
          scale: 1,
          opacity: 1,
          duration: 0.28,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: categoryEl, start: "top 75%", end: "top 55%", scrub: true },
          onComplete: () => {
            gsap.set(pills, { willChange: "auto" });
          },
        });
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

      gsap.set(".skill-category-heading", { visibility: "visible" });
      const headingSplit = new SplitText(".skill-category-heading", {
        type: "words, lines",
        mask: "lines",
      });

      gsap.set(headingSplit.words, { yPercent: 100 });

      gsap.utils.toArray<HTMLElement>(".skill-category").forEach((categoryEl) => {
        const words = headingSplit.words.filter((word) => categoryEl.contains(word));
        if (!words.length) return;

        gsap.to(words, {
          yPercent: 0,
          ease: EASE,
          stagger: 0.02,
          scrollTrigger: { trigger: categoryEl, start: "top 70%", end: "top 55%", scrub: true },
        });
      });

      ctx.add(() => () => {
        skillSplit.revert();
        headingSplit.revert();
      });
    },
  });

  const renderCategory = ({
    category,
    items,
    originalIndex,
  }: TechStackCategory & { originalIndex: number }) => (
    <div key={category} className="skill-category">
      <h3 className="relative inline-block group">
        <span className="skill-category-heading gsap-hide block text-sm tracking-wide text-primary-foreground">
          {category}
        </span>
        <span
          ref={setCategoryUnderlineRef(originalIndex)}
          className={cn(
            "absolute left-0 bottom-0 h-px w-full bg-primary-foreground",
            "origin-left scale-x-100 transition-transform duration-500 ease-(--ease-custom)",
            "group-hover:origin-right group-hover:scale-x-0"
          )}
        />
      </h3>

      <div className="flex flex-wrap gap-3 pt-3">
        {items.map(({ icon, name }) => (
          <div key={name} className="tech-pill">
            <Tag icon={icon} label={name} />
          </div>
        ))}
      </div>
    </div>
  );

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
          My{" "}"
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
          </span>"{" "}
          stack is down below.
        </p>
      </div>

      <div
        ref={categoriesContainerRef}
        className="pt-10 relative flex flex-col md:flex-row gap-8 md:gap-0"
      >
        <div className="flex flex-col gap-8 md:w-1/2 md:pr-10">
          {leftCategories.map(renderCategory)}
        </div>

        <div
          ref={dividerRef}
          aria-hidden="true"
          className="hidden md:block absolute left-1/2 top-11 h-[90%] w-[0.5px] -translate-x-1/2 bg-primary-foreground"
        />

        <div className="flex flex-col gap-8 md:w-1/2 md:pl-10">
          {rightCategories.map(renderCategory)}
        </div>
      </div>
    </section>
  );
}