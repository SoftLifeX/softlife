/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navlinks } from "@/lib/constants/nav-links";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useEffect, useState } from "react";

// Register GSAP ScrollTo plugin
gsap.registerPlugin(ScrollToPlugin);

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

  // Handle smooth scrolling with GSAP
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();

      gsap.to(window, {
        duration: 1.5,
        scrollTo: {
          y: href,
          offsetY: 0, // Adjust if you have a fixed header
        },
        ease: "power3.inOut",
      });

      window.history.pushState(null, '', href);
    }
    // External links will work normally
  };

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
      <div className="nav-grid grid grid-rows-3 grid-flow-col gap-y-3 gap-x-8 items-start">
        {navlinks.map((link) => {
          // Check both pathname and active section for anchor links
          const isActive = link.href.startsWith('#')
            ? activeSection === link.href
            : pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={cn(
                "navlink  relative text-sm font-normal group w-fit",
                "transition-all duration-500 ease-(--ease-custom)",
                //underline
                "before:absolute before:bottom-0 before:h-px before:w-full before:bg-foreground before:content-['']",
                "before:origin-right before:scale-x-0 before:transition-transform before:duration-500 before:ease-(--ease-custom) hover:before:origin-left hover:before:scale-x-100",
                isActive
                  ? " after:absolute after:top-1/2  after:rounded-full after:left-0 after:h-1.25 after:w-1.25 after:bg-invertforeground after:content-[''] after:origin-center after:scale-100 after:transition-transform after:duration-500 after:ease-(--ease-custom) hover:after:translate-x-0.5"
                  : "after:scale-0"
              )}
            >
              {/* Text container for stacked animation */}
              <span className="block h-[1.2em] overflow-hidden relative text-right">
                <span
                  className={cn(
                    "block transition-all duration-500 ease-(--ease-custom)",
                    "group-hover:-translate-y-8 "
                  )}
                >
                  {link.label}
                </span>
                <span
                  className={cn(
                    "block absolute top-full left-0 w-full transition-all duration-500 ease-(--ease-custom)",
                    "group-hover:-translate-y-full group-hover:opacity-100"
                  )}
                >
                  {link.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

    </nav>
  );
}