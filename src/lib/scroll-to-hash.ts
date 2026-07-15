import { gsap } from "@/lib/gsap-init";

interface ScrollToHashOptions {
  duration?: number;
  ease?: string;
  offsetY?: number;
}

let activeTween: gsap.core.Tween | null = null;

function clearHash() {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  activeTween = null;
}

export function scrollToHash(
  href: string,
  { duration = 1.5, ease = "power3.inOut", offsetY = 0 }: ScrollToHashOptions = {}
) {
  if (typeof window === "undefined") return;

  if (activeTween) {
    activeTween.kill();
  }

  window.history.pushState(null, "", href);

  activeTween = gsap.to(window, {
    duration,
    scrollTo: { y: href, offsetY },
    ease,
    onComplete: clearHash,
    onInterrupt: clearHash,
  });
}