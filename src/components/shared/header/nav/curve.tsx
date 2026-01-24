/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Curve() {
  const [windowHeight, setWindowHeight] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const pathname = usePathname();

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWindowHeight(window.innerHeight);
    }
  }, []);

  if (!windowHeight) return null;

  const initialPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q-100 ${
    windowHeight / 2
  } 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q100 ${
    windowHeight / 2
  } 100 0`;

  type CurveVariants = {
    initial: { d: string; transition?: any };
    enter: { d: string; transition?: any };
    exit: { d: string; transition?: any };
  };

  const curve: CurveVariants = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <svg className={cn("absolute top-0 -left-24.75 w-25 h-full pointer-events-none",
      isIntersecting ? "fill-background" : "fill-foreground"
    )}>
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
}
