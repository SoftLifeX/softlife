"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/constants/project-data";

interface ProjectCardProps {
  p: Project;
  index: string;
  offsetClass?: string;
  onLockedClick: (e: React.MouseEvent, disabled?: boolean) => void;
}

export function ProjectCard({ p, index, offsetClass, onLockedClick }: ProjectCardProps) {
  return (
    <div
      className={cn(
        "project-card-inner group1 relative flex flex-col w-full h-95 overflow-hidden rounded-xl",
        offsetClass,
      )}
    >
      {/* Parallax image */}
      <div className="parallax-container absolute inset-0 overflow-hidden rounded-xl">
        <div className="relative h-[120%] w-full -top-[10%]">
          <Image
            src={p.img}
            alt={p.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              "group1-hover:scale-[1.03]",
              p.disabled && "opacity-60"
            )}
          />
        </div>
      </div>

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)" }}
      />

      <span className="absolute top-4 right-4 z-20 text-xs font-mono text-white/40">{index}</span>

      {p.disabled && (
        <span className="absolute top-4 left-4 z-20 text-xs text-white/60 border border-white/20 rounded-full px-2.5 py-0.5">
          soon
        </span>
      )}

      <div className="relative z-20 mt-auto p-6 flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <h3 className="text-white font-semibold text-lg leading-tight">{p.title}</h3>
          <span className="text-xs rounded-full px-2.5 py-0.5 ml-3 shrink-0" style={{ color: p.color, backgroundColor: p.bg }}>
            {p.stack[0]}
          </span>
        </div>

        <p className="text-white/60 text-xs leading-relaxed line-clamp-1">{p.intro}</p>

        <div className="flex flex-wrap gap-1.5">
          {p.stack.slice(0, 3).map((tech) => (
            <span key={tech} className="text-xs text-white/70 border border-white/15 rounded-full px-2.5 py-0.5 backdrop-blur-sm">
              {tech}
            </span>
          ))}
          {p.stack.length > 3 && <span className="text-xs text-white/40 px-1 py-0.5">+{p.stack.length - 3}</span>}
        </div>

        <Link
          href={p.disabled ? "#" : p.href}
          onClick={(e) => onLockedClick(e, p.disabled)}
          className={cn("link group relative inline-flex items-center gap-2 w-fit text-sm text-white mt-1",
            p.disabled ? "cursor-not-allowed" : "cursor-pointer")}>
          <span className="relative block h-[1.2em] overflow-hidden">
            <span className="block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
              View Project
            </span>
            <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
              View Project
            </span>
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className={cn(
              "absolute left-0 -bottom-0.5 h-px w-[80%] bg-white/60",
              "origin-left scale-x-100 transition-transform duration-500 ease-(--ease-custom)",
              "group-hover:origin-right group-hover:scale-x-0"
            )}
          />
        </Link>
      </div>
    </div>
  );
}