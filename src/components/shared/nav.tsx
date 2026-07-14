/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navlinks } from "@/lib/constants/nav-links";
import { cn } from "@/lib/utils";
import { scrollToHash } from "@/lib/scroll-to-hash";
import { useEffect, useState } from "react";

// First 3 nav entries are in-page hash links (smooth-scrolled to, hash
// pushed then cleared). The remaining entries are normal page routes and
// get a plain Link with no scroll/hash handling at all.
const ANCHOR_LINK_COUNT = 3;

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  const isLanding = pathname === "/";

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

    handleScroll(); // Run on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth-scroll (never a native snap) to the target section, then let
  // scrollToHash reliably clear the hash once the scroll lands.
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToHash(href);
  };

  const sharedLinkClassName = (isActive: boolean) =>
    cn(
      "navlink relative text-sm font-normal group w-fit",
      "transition-all duration-500 ease-(--ease-custom)",
      //underline
      "before:absolute before:bottom-0 before:h-px before:w-full before:bg-foreground before:content-['']",
      "before:origin-right before:scale-x-0 before:transition-transform before:duration-500 before:ease-(--ease-custom) hover:before:origin-left hover:before:scale-x-100",
      isActive
        ? " after:absolute after:top-1/2  after:rounded-full after:left-0 after:h-1.25 after:w-1.25 after:bg-invertforeground after:content-[''] after:origin-center after:scale-100 after:transition-transform after:duration-500 after:ease-(--ease-custom) hover:after:translate-x-0.5"
        : "after:scale-0"
    );

  const linkLabel = (label: string) => (
    // Text container for stacked animation
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