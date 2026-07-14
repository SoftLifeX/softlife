import { gsap } from "@/lib/gsap-init";

interface ScrollToHashOptions {
  duration?: number;
  ease?: string;
  offsetY?: number;
}

// Tracks the in-flight scroll tween so a second click (on the same or a
// different anchor link) before the first scroll finishes doesn't leave
// two tweens fighting over window.scrollY, and doesn't leave the *first*
// tween's target hash stuck in the URL when it gets killed.
let activeTween: gsap.core.Tween | null = null;

function clearHash() {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  activeTween = null;
}

/**
 * Smoothly scrolls (never a native instant jump) to the element matching
 * `href` (e.g. "#contact"), pushing the hash onto the URL for the
 * duration of the scroll, then reliably removing it again — whether the
 * scroll completes normally or gets interrupted (new click, unmount,
 * killed tween, etc).
 */
export function scrollToHash(
  href: string,
  { duration = 1.5, ease = "power3.inOut", offsetY = 0 }: ScrollToHashOptions = {}
) {
  if (typeof window === "undefined") return;

  if (activeTween) {
    // onInterrupt below fires as part of kill(), which also clears the
    // hash from the tween we're abandoning.
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