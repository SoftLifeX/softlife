"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "@/lib/gsap-init";
import { cn } from "@/lib/utils";
import { Tag } from "../ui/tag";
import Magnetic from "../magnetic";
import { techStack, type TechStackCategory } from "@/lib/constants/techstack";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";
import { useGsapScope } from "@/hooks/useGsapScope";
import { WipeLabel, useWipeRefs } from "@/lib/animations/wipeLabel";
import { EASE, EASE_RAW } from "@/lib/animations/tokens";

const leftCategories = techStack
  .slice(0, 3)
  .map((cat, i) => ({ ...cat, originalIndex: i }));
const rightCategories = techStack
  .slice(3)
  .map((cat, i) => ({ ...cat, originalIndex: i + 3 }));

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";

type Side = "top" | "left" | "bottom" | "right";

const ENTRANCE_CLIP: Record<Side, string> = {
  left: NO_CLIP,
  bottom: NO_CLIP,
  top: NO_CLIP,
  right: NO_CLIP,
};
const EXIT_CLIP: Record<Side, string> = {
  left: TOP_RIGHT_CLIP,
  bottom: TOP_RIGHT_CLIP,
  top: TOP_RIGHT_CLIP,
  right: BOTTOM_LEFT_CLIP,
};

function getNearestSide(e: React.MouseEvent, el: HTMLElement): Side {
  const box = el.getBoundingClientRect();
  const sides = [
    { side: "left" as Side, proximity: Math.abs(box.left - e.clientX) },
    { side: "right" as Side, proximity: Math.abs(box.right - e.clientX) },
    { side: "top" as Side, proximity: Math.abs(box.top - e.clientY) },
    { side: "bottom" as Side, proximity: Math.abs(box.bottom - e.clientY) },
  ];
  return sides.sort((a, b) => a.proximity - b.proximity)[0].side;
}

function CategoryCard({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const side = getNearestSide(e, containerRef.current);
    gsap.to(overlayRef.current, { clipPath: ENTRANCE_CLIP[side], duration: 0.45, ease: EASE_RAW });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const side = getNearestSide(e, containerRef.current);
    gsap.to(overlayRef.current, { clipPath: EXIT_CLIP[side], duration: 0.45, ease: EASE_RAW });
  };

  return (
    <Magnetic strength={0} tiltStrength={7} fullWidth>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="skill-card gsap-hide relative flex h-full flex-col overflow-hidden rounded-xs bg-primary/60 p-6 md:p-8"
      >
        <div
          ref={overlayRef}
          style={{ clipPath: BOTTOM_RIGHT_CLIP }}
          className="absolute inset-0 bg-tag-foreground/10 pointer-events-none"
        />
        <div className="relative z-10 flex flex-1 flex-col justify-center gap-8">
          {children}
        </div>
      </div>
    </Magnetic>
  );
}

export default function Skills() {
  const skillSectionRef = useRef<HTMLDivElement | null>(null);
  const skillLabel = useWipeRefs();
  const skillWidthRef2 = useRef<HTMLDivElement | null>(null);
  const skillWidthRef3 = useRef<HTMLDivElement | null>(null);
  const categoriesContainerRef = useRef<HTMLDivElement | null>(null);
  const leftGridRef = useRef<HTMLDivElement | null>(null);
  const rightCardWrapperRef = useRef<HTMLDivElement | null>(null);
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
      gsap.set(".skill-card", { visibility: "visible", opacity: 1, x: 0, y: 0 });
      gsap.set(
        [
          skillLabel.widthRef.current,
          skillWidthRef2.current,
          skillWidthRef3.current,
          ...categoryUnderlineRefs.current,
        ],
        { width: "100%" }
      );
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

      const leftCards = leftGridRef.current
        ? Array.from(leftGridRef.current.querySelectorAll<HTMLElement>(".skill-card"))
        : [];
      const rightCards = rightCardWrapperRef.current
        ? Array.from(rightCardWrapperRef.current.querySelectorAll<HTMLElement>(".skill-card"))
        : [];

      gsap.set([...leftCards, ...rightCards], { visibility: "visible" });

      gsap.fromTo(
        leftCards,
        { opacity: 0, x: -48 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.15,
          ease: EASE,
          scrollTrigger: {
            trigger: categoriesContainerRef.current,
            start: "top 80%",
            end: "top top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        rightCards,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          ease: EASE,
          scrollTrigger: {
            trigger: categoriesContainerRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: true,
          },
        }
      );
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
        <span className="skill-category-heading gsap-hide block text-sm tracking-wide text-tag-foreground">
          {category}
        </span>
        <span
          ref={setCategoryUnderlineRef(originalIndex)}
          className={cn(
            "absolute left-0 bottom-0 h-px w-full bg-tag-foreground",
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
        className="pt-10 grid md:grid-cols-2 gap-2 items-stretch"
      >
        <div ref={leftGridRef} className="grid grid-rows-3 gap-2 h-full">
          {leftCategories.map((cat) => (
            <CategoryCard key={cat.category}>{renderCategory(cat)}</CategoryCard>
          ))}
        </div>

        <div ref={rightCardWrapperRef} className="h-full">
          <CategoryCard>{rightCategories.map(renderCategory)}</CategoryCard>
        </div>
      </div>
    </section>
  );
}