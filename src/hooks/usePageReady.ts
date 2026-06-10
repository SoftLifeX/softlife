"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

let preloaderHasCompleted = false;

export function usePageReady(): boolean {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setReady(false);

    if (preloaderHasCompleted) {
      const onDone = () => setReady(true);
      window.addEventListener("page-transition-complete", onDone, { once: true });
      return () => window.removeEventListener("page-transition-complete", onDone);
    }

    const onPreloader = () => {
      preloaderHasCompleted = true;
      setReady(true);
    };
    window.addEventListener("preloader-complete", onPreloader, { once: true });
    return () => window.removeEventListener("preloader-complete", onPreloader);

  }, [pathname]);

  return ready;
}