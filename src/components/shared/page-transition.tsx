"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap-init";

let isFirstLoad = true;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname   = usePathname();
  const prevPath   = useRef<string | null>(null);
  const [pageKey, setPageKey] = useState(pathname);

  useEffect(() => {
    if (isFirstLoad) {
      isFirstLoad = false;
      prevPath.current = pathname;
      return;
    }

    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    const overlay = overlayRef.current;
    if (!overlay) return;

    gsap.killTweensOf(overlay);

    const tl = gsap.timeline();

    tl.to(overlay, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        overlay.style.pointerEvents = "all";
      },
    });

    tl.add(() => {
      ScrollTrigger.killAll();

      window.scrollTo(0, 0);
      const smoother = (window as any).__smoother;
      if (smoother) smoother.scrollTo(0, false);

      setPageKey(pathname);
    });

    tl.to({}, { duration: 0.06 });

    tl.to(overlay, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        overlay.style.pointerEvents = "none";
        
        window.dispatchEvent(new CustomEvent("page-transition-complete"));
      },
    });

  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "var(--background, #06060a)",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <div key={pageKey} style={{ display: "contents" }}>
        {children}
      </div>
    </>
  );
}