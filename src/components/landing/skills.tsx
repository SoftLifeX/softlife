"use client";
import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { Tag } from "../ui/tag";
import { techStack } from "@/lib/constants/techstack";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Skills() {
  const skillWidthRef = useRef<HTMLDivElement | null>(null);
  const skillWidthRef2 = useRef<HTMLDivElement | null>(null);
  const skillWidthRef3 = useRef<HTMLDivElement | null>(null);
  const skillSectionRef = useRef<HTMLDivElement | null>(null);
  const skillBlockRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollTriggersRef = useRef<any[]>([]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      // user prefers reduced motion, show everything immediately
      if (prefersReducedMotion) {
        gsap.set([".skillSubtitle", ".skillParagraph"], {
          opacity: 1,
          yPercent: 0,
        });
        gsap.set(skillWidthRef.current, {
          width: "100%",
        });

        gsap.set(skillWidthRef2.current, {
          width: "100%",
        });

        gsap.set(skillWidthRef3.current, {
          width: "100%",
        });
        return;
      }

      const ctx = gsap.context(() => {
        gsap.fromTo(
          skillBlockRef.current,
          {
            width: "0%",
            left: "0%",
          },
          {
            width: "100%",
            duration: 0.5,
            ease,
            scrollTrigger: {
              trigger: ".skillSubtitle",
              start: "top 90%",
              toggleActions: "play none none none",
              onEnter: (self) => scrollTriggersRef.current.push(self),
            },
            onComplete: () => {
              gsap.to(skillBlockRef.current, {
                width: 0,
                left: "100%",
                duration: 0.4,
                ease,
                onComplete: () => {
                  gsap.to(".skillSubtitle", {
                    opacity: 1,
                    duration: 0.1,
                    ease,
                  });
                },
              });
            },
          }
        );

        gsap.from(skillWidthRef.current, {
          width: 0,
          stagger: 1,
          ease,
          scrollTrigger: {
            trigger: ".skillSubtitle",
            start: "top 80%",
            end: "top 50%",
            scrub: true,
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });

        gsap.from(skillWidthRef2.current, {
          width: 0,
          stagger: 1,
          ease,
          scrollTrigger: {
            trigger: ".skillParagraph",
            start: "top 65%",
            end: "top 50%",
            scrub: true,
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });

        gsap.from(skillWidthRef3.current, {
          width: 0,
          stagger: 1,
          ease,
          scrollTrigger: {
            trigger: ".skillParagraph",
            start: "top 65%",
            end: "top 50%",
            scrub: true,
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });

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
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });

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
            onEnter: (self) => scrollTriggersRef.current.push(self),
          },
        });



        // Clean up ScrollTriggers and SplitText
        return () => {
          skillSplit.revert();

          scrollTriggersRef.current.forEach((st) => st?.kill());
          scrollTriggersRef.current = [];
        };

      }, skillSectionRef);

      return () => {
        ctx.revert();

        // Extra cleanup - kill any remaining ScrollTriggers
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger?.closest('.skills-section')) {
            st.kill();
          }
        });
      };
    },
    { scope: skillSectionRef }
  );

  return (
    <section ref={skillSectionRef} className="skills-section px py">
      <div className=" relative w-fit">
        <div className="relative w-fit group">
          <p
            className={cn(
              "skillSubtitle opacity-0 relative justify-start w-fit text-sm text-foreground origin-left"
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

      <div className="pt-4 w-full">
        <p
          className={cn(
            "skillParagraph text-start  w-full text-sm text-primary-foreground"
          )}
        >
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
        <p
          className={cn(
            "skillParagraph text-start md:text-center w-full text-sm text-primary-foreground"
          )}
        >
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