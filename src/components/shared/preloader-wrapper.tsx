"use client";

import { useState, createContext, useContext } from "react";
import Preloader from "@/components/shared/preloader";

export const PreloaderContext = createContext(false);
export const usePreloaderDone = () => useContext(PreloaderContext);

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  return (
    <PreloaderContext.Provider value={done}>
      {!done && <Preloader onComplete={() => setDone(true)} />}
      <div style={{
        opacity: done ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: done ? "auto" : "none",
      }}>
        {children}
      </div>
    </PreloaderContext.Provider>
  );
}