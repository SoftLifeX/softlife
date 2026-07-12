import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  useGSAP,
  ScrollSmoother,
  ScrollToPlugin,
  MorphSVGPlugin
);

export { gsap, ScrollTrigger, SplitText, useGSAP, ScrollSmoother, ScrollToPlugin, MorphSVGPlugin };