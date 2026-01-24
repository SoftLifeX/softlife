import Developer from "@/app/assets/json/Developer.json";
import Figma from "@/app/assets/json/Figma.json";
import Fast from "@/app/assets/json/Fast.json";
import Targeted from "@/app/assets/json/Targeted.json";
import Growth from "@/app/assets/json/Growth.json";
import Server from "@/app/assets/json/Server.json";

export interface Service {
  title: string;
  animation: object;
  description: string;
}

export const services: Service[] = [
  {
    title: "Definition",
    animation: Growth,
    description: `Whether we’re starting from scratch or evolving what’s already there, 
    this phase is all about laying the foundation with strategy, style and structure.
     From brand discovery to visual direction, everything starts here.`,
  },
  {
    title: "Design",
    animation: Figma,
    description: `I design high-fidelity and clear interfaces that reflect your brand personality, 
    speak to your audience, and are a pleasure to interact with. Brought to life straight from Figma.`,
  },
  {
    title: "Development",
    animation: Developer,
    description: `I build cross platform digital products,
    empowering founders and organisations to bring concepts to life quickly, build clean, modern system, test concepts, and measure results.`,
  },
  {
    title: "Optimization",
    animation: Fast,
    description: `Your digital product feeling slow? that must be tough. Why settle for laggy software or UX hiccups! I build fast, efficient digital products optimized for every user accross every screen `,
  },
  {
    title: "Integration",
    animation: Server,
    description: `Scaling your product will never be easier, I build to expand with smart integrations. Reducing manual effort and future-proofing connections.`,
  },
  {
    title: "The Full Package",
    animation: Targeted,
    description: `I consistently help brands exceed monthly estimated ROI, turning concepts and visions into digital product reality & converting visitors into loyal customers, all without "Breaking the bank"
    No hidden fees attached.`,
  },
];
