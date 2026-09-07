"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap-init";
import { EASE } from "@/lib/animations/tokens";

const NEW_SITE_URL = "https://danielcdaniel.vercel.app";
const STORAGE_KEY = "outdated-site-notice-dismissed";

export default function OutdatedSiteModal() {
  const [open, setOpen] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [ctaPos, setCtaPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setOpen(true);
      gsap.fromTo(
        ".outdated-modal-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: EASE }
      );
      gsap.fromTo(
        ".outdated-modal-panel",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE, delay: 0.1 }
      );
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    gsap.to(".outdated-modal-overlay", {
      opacity: 0,
      duration: 0.3,
      ease: EASE,
      onComplete: () => setOpen(false),
    });
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const handleCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCtaPos({ x, y });
  };

  if (!open) return null;

  return (
    <div
      className="outdated-modal-overlay fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="outdated-modal-title"
    >
      <div className="outdated-modal-panel relative w-full max-w-md bg-primary border border-primary-foreground/60 px-8 py-10 text-center">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-primary-foreground/60 hover:text-foreground transition-colors duration-300 text-sm tracking-wide"
        >
          ✕
        </button>

        <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-4">
          Heads up
        </p>

        <h2
          id="outdated-modal-title"
          className="text-foreground text-xl md:text-2xl leading-snug mb-3"
        >
          You&apos;re viewing an outdated version of this site
        </h2>

        <p className="text-sm text-primary-foreground/70 mb-8">
          I&apos;ve moved everything to a newer, better build. Head over there to see the latest work.
        </p>

        
          href={NEW_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={(e) => {
            handleCtaMove(e);
            setCtaHovered(true);
          }}
          onMouseMove={handleCtaMove}
          onMouseLeave={() => setCtaHovered(false)}
          className="group relative inline-flex items-center gap-3 px-8 py-4 border border-primary-foreground/60 text-primary-foreground text-sm tracking-wide hover:border-foreground transition-colors duration-500 overflow-hidden mb-4"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-foreground"
            style={{
              clipPath: `circle(${ctaHovered ? 150 : 0}% at ${ctaPos.x}% ${ctaPos.y}%)`,
              opacity: ctaHovered ? 1 : 0,
              transition: "clip-path 0.4s var(--ease-custom), opacity 0.4s var(--ease-custom)",
            }}
          />
          <span className="relative z-10 block h-[1.2em] overflow-hidden">
            <span className="block transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-full">
              Visit the new site
            </span>
            <span className="absolute left-0 top-full block w-full transition-transform duration-500 ease-(--ease-custom) group-hover:-translate-y-[80%] group-hover:text-background">
              danielcdaniel.vercel.app
            </span>
          </span>
          <span className="relative z-10 w-3.5 h-3.5 shrink-0 overflow-hidden rotate-135">
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="absolute inset-0 transition-transform duration-300 ease-(--ease-custom) group-hover:translate-x-4.5 group-hover:-translate-y-4.5 group-hover:text-foreground"
            >
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="absolute inset-0 -translate-x-4.5 translate-y-4.5 transition-transform duration-300 ease-(--ease-custom) group-hover:translate-x-0 group-hover:translate-y-0 group-hover:delay-150 group-hover:text-background"
            >
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>

        <button
          onClick={handleClose}
          className="block mx-auto text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-300"
        >
          Continue on the old site
        </button>
      </div>
    </div>
  );
}
