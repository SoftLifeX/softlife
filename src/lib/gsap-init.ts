/**
 * gsap-init.ts
 *
 * Single source of truth for GSAP plugin registration.
 * Import this file ONCE — in layout.tsx or a top-level client boundary.
 * Never call gsap.registerPlugin() in individual components.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP, ScrollSmoother);

export { gsap, ScrollTrigger, SplitText, useGSAP, ScrollSmoother };