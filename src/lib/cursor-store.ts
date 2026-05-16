/**
 * cursor-store.ts
 *
 * A module-level singleton that holds the live cursor position.
 * Components read from this instead of subscribing to CustomEvents.
 *
 * Why: CustomCursor was dispatching a CustomEvent on every single RAF
 * frame (60/s). Every subscriber (Hero, Intro) added its own listener,
 * meaning 60 × N event objects were being constructed, dispatched, and
 * garbage-collected per second. A plain ref shared via module scope is
 * zero-cost to read.
 */

export const cursorStore = {
  mouseX: 0,
  mouseY: 0,
  /** Eased cursor position (what the visual cursor dot is at) */
  x: 0,
  y: 0,
  scale: 1,
};