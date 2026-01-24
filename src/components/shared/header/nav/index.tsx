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

export default function Nav() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

    const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    if (pathname !== '/') return;

    const contrastSections = document.getElementById('contrast'); 
    if (!contrastSections) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        root: null, 
        threshold: 0, 
        rootMargin: '0px 0px -100% 0px',
} 
    );

    observer.observe(contrastSections);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={cn("fixed top-0 right-0 w-full h-screen md:w-1/3  z-40",
        isIntersecting ? "bg-background text-foreground" : "bg-foreground text-background"
      )}

    >
      <div className="flex flex-col justify-between h-full p-24">
        <div
          className="flex flex-col gap-3 mt-0 md:mt-20 text-3xl"
          onMouseLeave={() => setSelectedIndicator(pathname)}
        >
          <div className="text-primary-foreground uppercase text-sm border-b border-primary-foreground md:mb-10 md:pb-2">
            Navigation
          </div>

          {navlinks.map((item, index) => (
            <LinkItem
              key={index}
              data={{ ...item, index }}
              isActive={selectedIndicator === item.href}
              setSelectedIndicator={setSelectedIndicator}
            />
          ))}

          <ThemeToggle />
        </div>
      </div>

      <Curve />
    </motion.div>
  );
}
