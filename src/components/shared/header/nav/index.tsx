// app/components/header/nav/index.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import LinkItem from "./link";
import Curve from "./curve";
import { menuSlide } from "../anim";
import ThemeToggle from "@/components/shared/themeToggle";
import { cn } from "@/lib/utils";
import { navlinks } from "@/lib/constants/nav-links";

const PRIMARY_LINK_COUNT = 3;

export default function Nav() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const contrastSections = document.getElementById("contrast");
    if (!contrastSections) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px -100% 0px",
      }
    );

    observer.observe(contrastSections);
    return () => observer.disconnect();
  }, [pathname]);

  const primaryLinks = navlinks.slice(0, PRIMARY_LINK_COUNT);
  const socialLinks = navlinks.slice(PRIMARY_LINK_COUNT);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={cn(
        "fixed top-0 right-0 w-full h-screen md:w-1/3 z-40",
        isIntersecting
          ? "bg-background text-foreground"
          : "bg-foreground text-background"
      )}
    >
      <div className="flex flex-col justify-between h-full p-12 md:p-24">
        {/* Primary navigation */}
        <div
          className="flex flex-col gap-3 mt-0 md:mt-20 text-3xl"
          onMouseLeave={() => setSelectedIndicator(pathname)}
        >
          <div className="text-primary-foreground uppercase text-sm border-b border-primary-foreground/40 pb-2 mb-4">
            Navigation
          </div>

          {primaryLinks.map((item, index) => (
            <LinkItem
              key={index}
              data={{ ...item, index }}
              isActive={selectedIndicator === item.href}
              setSelectedIndicator={setSelectedIndicator}
            />
          ))}
        </div>

        {/* Social links + theme toggle, grouped at the bottom */}
        <div className="flex flex-col gap-8">
          {socialLinks.length > 0 && (
            <div
              className="flex flex-col gap-2 text-base"
              onMouseLeave={() => setSelectedIndicator(pathname)}
            >
              <div className="text-primary-foreground/70 uppercase text-xs border-b border-primary-foreground/20 pb-2 mb-1">
                Links
              </div>

              <div className="flex flex-row flex-wrap items-center gap-y-2">
                {socialLinks.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <LinkItem
                      data={{ ...item, index: index + PRIMARY_LINK_COUNT }}
                      isActive={selectedIndicator === item.href}
                      setSelectedIndicator={setSelectedIndicator}
                    />
                    {index < socialLinks.length - 1 && (
                      <span className="text-primary-foreground/30 mx-3 select-none">
                        |
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-primary-foreground/20 pt-4">
            <span className="text-primary-foreground/70 uppercase text-xs">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <Curve />
    </motion.div>
  );
}