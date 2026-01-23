"use client";
import { useState, useEffect } from "react";
import Magnetic from "../magnetic";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

interface ServiceCardProps {
  index: number;
  title: string;
  animation: object;
  description: string;
}

export function ServiceCard({
  index,
  title,
  animation,
  description,
}: ServiceCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(media.matches);
    const handler = () => setIsMobile(media.matches);
    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const rotations = isMobile
    ? [
      "-rotate-[0deg]",
      "rotate-[0deg]",
      "-rotate-[0deg]",
      "rotate-[0deg]",
      "-rotate-[0deg]",
      "rotate-[0deg]",
    ]
    : [
      "-rotate-[10deg]",
      "rotate-[4deg]",
      "-rotate-[6deg]",
      "rotate-[8deg]",
      "-rotate-[11deg]",
      "rotate-[7deg]",
    ];

  const translate = isMobile
    ? [
      "translate-y-0",
      "translate-y-0",
      "translate-y-0",
      "translate-y-0",
      "translate-y-0",
      "translate-y-0",
    ]
    : [
      "translate-y-0",
      "-translate-y-15",
      "translate-y-0",
      "translate-y-0",
      "translate-y-15",
      "translate-y-0",
    ];

  return (
    <Magnetic>
      <div
        className={cn(
          "serviceCard group relative mb-5 md:mb-10 rounded-lg",
          "text-foreground",
          "px-8 pt-15 bg-background",
          "transition-transform duration-500 ease-custom",
          "h-95 shadow-lg hover:scale-[1.01]",
          "before:-z-1 before:rounded-lg before:border-[0.5px]",
          isScrolling && "pointer-events-none",
          translate[index % translate.length]
        )}
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 md:w-15 md:h-15">
            <Lottie
              animationData={animation}
              loop
              className={cn(
                "lottie-icon w-12 h-12 md:w-15 md:h-15",
                "[&_path]:stroke-foreground [&_path]:fill-background",
                "transition-all duration-300",
                !isScrolling &&
                "md:group-hover:[&_path]:stroke-background md:group-hover:[&_path]:fill-foreground"
              )}
            />
          </div>

          <span
            className={cn(
              "text-4xl md:text-7xl font-bold text-foreground",
              !isScrolling && "md:group-hover:text-background"
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h2
          className={cn(
            "mt-12 md:mt-4 text-sm font-medium text-foreground",
            !isScrolling && "md:group-hover:text-background"
          )}
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-primary-foreground">
          {description}
        </p>
      </div>
    </Magnetic>
  );
}