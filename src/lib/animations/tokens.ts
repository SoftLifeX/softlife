export const EASE_RAW = "cubic-bezier(0.25, 0.46, 0.45, 0.94)" as const;

// Snappier ease used for wipe/block-reveal transitions (Preloader "split")
export const EASE_SNAP = "cubic-bezier(0.76, 0, 0.24, 1)" as const;

/** Default ease for scroll-scrubbed reveals (text splits, underlines, fades) */
export const EASE = EASE_RAW;

/** Standard durations, named by intent rather than magic numbers */
export const DURATION = {
  fast: 0.3,
  base: 0.5,
  slow: 0.8,
  wipe: 0.5,
  wipeExit: 0.4,
} as const;

/** Standard ScrollTrigger start/end pairs used across reveal animations */
export const SCRUB_RANGE = {
  standard: { start: "top 80%", end: "top 55%" },
  tight: { start: "top 85%", end: "top 60%" },
  wide: { start: "top 90%", end: "top 50%" },
} as const;