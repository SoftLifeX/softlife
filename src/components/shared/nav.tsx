/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navlinks } from "@/lib/constants/nav-links";
import { cn } from "@/lib/utils";
import { scrollToHash } from "@/lib/scroll-to-hash";
import { gsap } from "@/lib/gsap-init";
import { useEffect, useRef, useState } from "react";

const ANCHOR_LINK_COUNT = 3;

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  const isLanding = pathname === "/";

  const noteRef = useRef<HTMLSpanElement | null>(null);
  const noteUnderlineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!noteRef.current) return;

    const tl = gsap.timeline({ delay: 1.2 });

    tl.fromTo(
      noteRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );

    if (noteUnderlineRef.current) {
      tl.fromTo(
        noteUnderlineRef.current,
        { width: 0 },
        { width: "100%", duration: 0.5, ease: "power3.out" },
        "<0.1"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  // Clear active section and URL hash when pathname changes
  useEffect(() => {
    setActiveSection("");
    // Remove hash from URL
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [pathname]);

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = navlinks
        .filter(link => link.href.startsWith('#'))
        .map(link => link.href.substring(1));

      const scrollPosition = window.scrollY + 100; // Offset for when section becomes "active"

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(`#${sectionId}`);
            break;
          }
        }
      }
    };

    handleScroll(); 
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToHash(href);
  };

  const sharedLinkClassName = (isActive: boolean) =>
    cn(
      "navlink relative text-sm font-normal group w-fit",
      "transition-all duration-500 ease-(--ease-custom)",
      "before:absolute before:bottom-0 before:h-px before:w-full before:bg-foreground before:content-['']",
      "before:origin-right before:scale-x-0 before:transition-transform before:duration-500 before:ease-(--ease-custom) hover:before:origin-left hover:before:scale-x-100",
      isActive
        ? " after:absolute after:top-1/2  after:rounded-full after:left-0 after:h-1.25 after:w-1.25 after:bg-invertforeground after:content-[''] after:origin-center after:scale-100 after:transition-transform after:duration-500 after:ease-(--ease-custom) hover:after:translate-x-0.5"
        : "after:scale-0"
    );

  const linkLabel = (label: string) => (
    <span className="block h-[1.2em] overflow-hidden relative text-right">
      <span
        className={cn(
          "block transition-all duration-500 ease-(--ease-custom)",
          "group-hover:-translate-y-8 "
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "block absolute top-full left-0 w-full transition-all duration-500 ease-(--ease-custom)",
          "group-hover:-translate-y-full group-hover:opacity-100"
        )}
      >
        {label}
      </span>
    </span>
  );

  return (
    <nav
      className={cn(
        "hidden md:flex justify-between w-full gap-20 h-fit",
        "py-8",
        isLanding
          ? "text-foreground bg-transparent"
          : "text-contact-foreground bg-contact-background"
      )}
    >
      <div className="flex flex-col gap-3">
        <p className="link relative text-sm font-normal group w-fit">
          <span className="block h-[1.2em] overflow-hidden relative text-right">
            <span
              className={cn(
                "block transition-all duration-500 ease-(--ease-custom) mr-1",
                "group-hover:-translate-x-full "
              )}
            >
              code by softlifex
            </span>
            <span
              className={cn(
                "block absolute top-0 left-full w-full transition-all duration-500 ease-(--ease-custom)",
                "group-hover:-translate-x-full group-hover:opacity-100"
              )}
            >
              code by softlifex
            </span>
          </span>

          {/*<span
            ref={noteRef}
            className="pointer-events-none absolute left-0 top-full z-40 mt-3 flex items-center gap-2 whitespace-nowrap text-[0.7rem] tracking-wide text-foreground/60 opacity-0"
          >
            <span
              aria-hidden="true"
              className="relative flex h-1.5 w-1.5 shrink-0 items-center justify-center"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground/70" />
            </span>

            <span className="relative">
              This whole site reacts — that was the point.
              <span
                ref={noteUnderlineRef}
                aria-hidden="true"
                className="absolute left-0 -bottom-1 h-px bg-foreground/30"
                style={{ width: 0 }}
              />
            </span>
          </span>*/}
        </p>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-3">
        {navlinks.map((link, i) => {
          const isAnchor = i < ANCHOR_LINK_COUNT;
          const isActive = isAnchor
            ? activeSection === link.href
            : pathname === link.href;

          return (
            <span key={link.href} className="flex items-center gap-x-4">
              {isAnchor ? (
                <Link
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className={sharedLinkClassName(isActive)}
                >
                  {linkLabel(link.label)}
                </Link>
              ) : (
                <Link href={link.href} className={sharedLinkClassName(isActive)}>
                  {linkLabel(link.label)}
                </Link>
              )}

              {i === 2 && (
                <span aria-hidden="true" className="text-foreground/30 text-xl select-none">
                  |
                </span>
              )}
            </span>
          );
        })}
      </div>

    </nav>
  );
}