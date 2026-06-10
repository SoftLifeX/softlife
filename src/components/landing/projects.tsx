"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-init";
import Image from "next/image";
import { project, Project } from "@/lib/constants/project-data";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BentoCard {
  projectId: number;
  /** Tailwind col-span / row-span classes for the grid cell */
  cell: string;
  /** Height class */
  height: string;
  /** Float text shown in adjacent whitespace cell (null = text inside card) */
  floatText?: string;
  /** If this card has a float text cell, the cell classes for that text cell */
  floatCell?: string;
}



const BENTO: BentoCard[] = [
  // Givtro — large, col 1-7
  {
    projectId: 0,
    cell: "md:col-span-7",
    height: "h-[70svh]",
  },
  // SupaDupa — col 8-12
  {
    projectId: 1,
    cell: "md:col-span-5",
    height: "h-[70svh]",
  },
  // Ochi — col 1-5
  {
    projectId: 2,
    cell: "md:col-span-5",
    height: "h-[55svh]",
  },
  // Flow Party — col 6-12
  {
    projectId: 3,
    cell: "md:col-span-7",
    height: "h-[55svh]",
  },
  // Airbnb — col 1-4
  {
    projectId: 4,
    cell: "md:col-span-4",
    height: "h-[45svh]",
  },
  // Light — col 5-8
  {
    projectId: 5,
    cell: "md:col-span-4",
    height: "h-[45svh]",
  },
  // Skyline — col 9-12
  {
    projectId: 6,
    cell: "md:col-span-4",
    height: "h-[45svh]",
  },
  // SoftlifeX — full width
  {
    projectId: 7,
    cell: "md:col-span-12",
    height: "h-[35svh]",
  },
];

const INDEX_LABELS = ["01", "02", "03", "04", "05", "06", "07", "08"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Projects() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const splitInstancesRef = useRef<SplitText[]>([]);
  const headerBlockRef = useRef<HTMLDivElement>(null);
  const headerWidthRef = useRef<HTMLDivElement>(null);
  const headerTextRef = useRef<HTMLParagraphElement>(null);
  const ready = usePageReady();

  useGSAP(
    () => {
      if (!ready) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 768;

      if (prefersReducedMotion) {
        gsap.set([".project-intro", ".stack-pill", ".project-index", ".project-title", ".project-desc"],
          { opacity: 1, scale: 1 });
        if (headerTextRef.current) gsap.set(headerTextRef.current, { opacity: 1 });
        return;
      }

      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          registerWipe(
            { blockRef: headerBlockRef, widthRef: headerWidthRef, textRef: headerTextRef },
            {
              trigger: () => headerTextRef.current,
              direction: "left",
              startOffset: "top 90%",
              underlineStart: "top 80%",
              underlineEnd: "top 60%",
            }
          );

          const yAmt = isMobile ? 0 : 18;

          gsap.utils.toArray<HTMLElement>(".parallax-container").forEach((container) => {
            const img = container.querySelector<HTMLImageElement>("img");
            if (!img) return;
            gsap.fromTo(img,
              { yPercent: -yAmt },
              {
                yPercent: yAmt,
                ease: "none",
                scrollTrigger: {
                  trigger: container,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          });

          gsap.utils.toArray<HTMLElement>(".bento-card").forEach((card, i) => {
            gsap.fromTo(card, { y: 40, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
              },
              delay: (i % 3) * 0.08,
            });
          });

          document.fonts.ready.then(() => {
            const headingSplit = new SplitText(".projects-heading", {
              type: "lines, words",
              mask: "lines",
            });
            splitInstancesRef.current.push(headingSplit);

            gsap.fromTo(headingSplit.words,
              { yPercent: 100 },
              {
                yPercent: 0,
                ease: "power2.out",
                stagger: 0.03,
                scrollTrigger: {
                  trigger: ".projects-heading",
                  start: "top 85%",
                  end: "top 60%",
                  scrub: true,
                },
              }
            );

            gsap.utils.toArray<HTMLElement>(".float-text").forEach((el) => {
              const split = new SplitText(el, { type: "lines, words", mask: "lines" });
              splitInstancesRef.current.push(split);
              gsap.fromTo(split.words,
                { yPercent: 100 },
                {
                yPercent: 0,
                ease: "power2.out",
                stagger: 0.04,
                scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  end: "top 60%",
                  scrub: true,
                },
              });
            });

            ctx.add(() => () => {
              splitInstancesRef.current.forEach((s) => s.revert());
              splitInstancesRef.current = [];
            });
          });
        });
      }, projectsRef);

      return () => ctx.revert();
    },
    { scope: projectsRef, dependencies: [ready] }
  );

  const handleLockedClick = (e: React.MouseEvent, isDisabled?: boolean) => {
    if (!isDisabled) return;
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.add("shake-animation");
    setTimeout(() => target.classList.remove("shake-animation"), 500);
  };

  return (
    <div ref={projectsRef} id="craft" className="px py my-[8svh]">

      {/* ── Section label ──────────────────────────────────────────────── */}
      <div className="relative w-fit mb-4">
        <div className="relative w-fit group">
          <p
            ref={headerTextRef}
            className="opacity-0 relative text-sm text-foreground"
          >
            selected work
          </p>
          <div
            ref={headerWidthRef}
            className={cn(
              "absolute left-0 bottom-0 h-px w-full bg-foreground",
              "origin-left transition-transform duration-500 ease-(--ease-custom)",
              "group-hover:origin-right group-hover:scale-x-0"
            )}
          />
        </div>
        <div
          ref={headerBlockRef}
          className="absolute w-0 h-full top-0 left-0 pointer-events-none bg-foreground"
        />
      </div>

      {/* ── Section heading ─────────────────────────────────────────────── */}
      <h2 className="projects-heading text-4xl md:text-6xl font-bold leading-tight text-foreground mb-12 md:mb-16 w-full">
        things i built while everyone else was sleeping
      </h2>

      {/* ── Bento grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {BENTO.map(({ projectId, cell, height }, bentoIdx) => {
          const p = project[projectId];
          if (!p) return null;

          const isGivtro = projectId === 0;
          const isFullWidth = cell.includes("col-span-12");

          return (
            <div
              key={p.id}
              className={cn("col-span-1", cell)}
            >
              {/*
                For Givtro: grid inside the cell so the float text
                sits beside the card in the same row
              */}
              {isGivtro ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-full">
                  {/* Card — takes col 1-9 of the Givtro cell */}
                  <div className="md:col-span-9 h-full">
                    <ProjectCard
                      p={p}
                      height={height}
                      index={INDEX_LABELS[bentoIdx]}
                      isGivtro={isGivtro}
                      isFullWidth={isFullWidth}
                      onLockedClick={handleLockedClick}
                    />
                  </div>
                  {/* Float text — col 10-12 */}
                  <div className="hidden md:flex md:col-span-3 flex-col justify-end pb-8 pl-2">
                    <p className="float-text text-sm text-primary-foreground leading-relaxed">
                      the work speaks.<br />i'll be quiet.
                    </p>
                  </div>
                </div>
              ) : (
                <ProjectCard
                  p={p}
                  height={height}
                  index={INDEX_LABELS[bentoIdx]}
                  isGivtro={false}
                  isFullWidth={isFullWidth}
                  onLockedClick={handleLockedClick}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  p: Project;
  height: string;
  index: string;
  isGivtro: boolean;
  isFullWidth: boolean;
  onLockedClick: (e: React.MouseEvent, disabled?: boolean) => void;
}

function ProjectCard({ p, height, index, isGivtro, isFullWidth, onLockedClick }: CardProps) {
  return (
    <Link
      href={p.disabled ? "#" : p.href}
      onClick={(e) => onLockedClick(e, p.disabled)}
      className={cn(
        "parallax-container bento-card group",
        "relative flex w-full overflow-hidden rounded-xl",
        "opacity-0", // GSAP will reveal
        height,
        p.disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="relative h-[120%] w-full -top-[10%]">
          <Image
            src={p.img}
            alt={p.title}
            fill
            sizes={
              isFullWidth
                ? "100vw"
                : "(min-width: 768px) 58vw, 100vw"
            }
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              "group-hover:scale-[1.03]",
              p.disabled && "opacity-60"
            )}
          />
        </div>
      </div>

      {/* Givtro brand tint */}
      {isGivtro && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "rgba(36,102,242,0.10)" }}
        />
      )}

      {/* Bottom gradient */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 45%, transparent 100%)",
        }}
      />

      {/* Index — top right */}
      <span className="project-index absolute top-4 right-4 z-20 text-xs font-mono text-white/40">
        {index}
      </span>

      {/* Soon pill — top left, locked projects only */}
      {p.disabled && (
        <span className="absolute top-4 left-4 z-20 text-xs text-white/60 border border-white/20 rounded-full px-2.5 py-0.5">
          soon
        </span>
      )}

      {/* Bottom bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 p-5 md:p-6",
          "translate-y-0 transition-transform duration-500 ease-out",
          "group-hover:-translate-y-1"
        )}
      >
        {/* Title + category */}
        <div className="flex items-end justify-between mb-1.5">
          <h3
            className="project-title text-white font-semibold leading-tight"
            style={{
              fontSize: isFullWidth ? "clamp(1.1rem, 2vw, 1.5rem)" : "clamp(1rem, 1.8vw, 1.25rem)",
            }}
          >
            {p.title}
          </h3>
          <span
            className="text-xs rounded-full px-2.5 py-0.5 ml-3 shrink-0"
            style={{ color: p.color, backgroundColor: p.bg }}
          >
            {p.stack[0]}
          </span>
        </div>

        {/* One-line description */}
        <p className="project-desc text-white/60 text-xs leading-relaxed mb-3 line-clamp-1">
          {p.intro}
        </p>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-1.5">
          {p.stack.slice(0, isFullWidth ? 6 : 3).map((tech) => (
            <span
              key={tech}
              className="stack-pill text-xs text-white/70 border border-white/15 rounded-full px-2.5 py-0.5 backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
          {p.stack.length > (isFullWidth ? 6 : 3) && (
            <span className="text-xs text-white/40 px-1 py-0.5">
              +{p.stack.length - (isFullWidth ? 6 : 3)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}