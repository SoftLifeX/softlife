"use client";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap-init";
import { RefObject } from "react";

type Ctx = ReturnType<typeof gsap.context>;

export interface UseGsapScopeOptions {
  /** Gate from usePageReady() — animations won't run until this is true */
  ready: boolean;
  /** Called synchronously (no RAF/fonts wait) when prefers-reduced-motion is on */
  reducedMotionFallback?: () => void;
  /** Runs immediately inside the gsap.context scope — wipes, fades, non-SplitText work */
  animate?: (ctx: Ctx) => void;
  /** Runs after fonts.ready + one rAF frame — for anything using `new SplitText(...)` */
  animateWithSplitText?: (ctx: Ctx) => void;
  /** Extra dependencies to re-run the effect on, beyond `ready` */
  dependencies?: unknown[];
}

export function useGsapScope(
  scopeRef: RefObject<Element | null>,
  {
    ready,
    reducedMotionFallback,
    animate,
    animateWithSplitText,
    dependencies = [],
  }: UseGsapScopeOptions
) {
  useGSAP(
    () => {
      if (!ready) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        reducedMotionFallback?.();
        return;
      }

      const ctx = gsap.context((self) => {
        // `self` is the context itself, available immediately — no TDZ issue
        animate?.(self);

        if (animateWithSplitText) {
          requestAnimationFrame(() => {
            document.fonts.ready.then(() => {
              animateWithSplitText(self);
              ScrollTrigger.refresh();
            });
          });
        }
      }, scopeRef as RefObject<Element>);

      return () => ctx.revert();
    },
    { scope: scopeRef as RefObject<Element>, dependencies: [ready, ...dependencies] }
  );
}