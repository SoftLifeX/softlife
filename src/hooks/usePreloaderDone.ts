import { useState, useEffect } from "react";

export function usePreloaderDone(): boolean {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const handler = () => setDone(true);
    window.addEventListener("preloader-complete", handler, { once: true });
    return () => window.removeEventListener("preloader-complete", handler);
  }, []);

  return done;
}