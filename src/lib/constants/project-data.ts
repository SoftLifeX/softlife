import { projects } from "@/app/assets/projects";
import { StaticImageData } from "next/image";

// Define the type for each project
export interface Project {
  id: number;
  title: string;
  img: StaticImageData; 
  bg: string;
  color: string;
  href: string;
  intro: string;
  stack: string[];
  disabled?: boolean;
}

export const project: Project[] = [
  {
    id: 1,
    title: "SupaDupa",
    img: projects.supadupa,
    bg: "#163200",
    href: "https://supadupa-website-bysoft.vercel.app/",
    color: " #c2cabb",
    intro: "This site isn’t about me,\nit’s about YOU",
    stack: ["Typescript", "Tailwind", "gsap", "framer-motion", "Next.js"],
  },
  {
    id: 2,
    title: "Ochi",
    img: projects.ochi,
    bg: "#cdea68",
    href: "https://ochi-website-clone-bysoft.vercel.app/",
    color: "#0d0d0d",
    intro:
      "I’m not a vendor, \nI’m an extension of your team. \nAcross the web and your brand",
    stack: ["Typescript", "Tailwind", "gsap", "framer-motion", "Next.js"],
  },
  {
    id: 3,
    title: "Flow Party",
    img: projects.flow,
    bg: "#B3EB16",
    href: "https://flow-website-bysoft.vercel.app/",
    color: "#0d0d0d",
    intro: "I’m a founder too. I get it ",
    stack: ["Typescript", "Tailwind", "gsap", "framer-motion", "Next.js"],
  },
  {
    id: 4,
    title: "airbnb",
    img: projects.airbnb,
    bg: "#0d0d0d",
    href: "",
    color: "#f5f3ef",
    intro:
      "That’s why I never do the same work twice! \neach one is a unique challenge \n and I always deliver",
    stack: ["Typescript", "Tailwind", "Next.js", "Prisma"],
    disabled: true,
  },
  {
    id: 5,
    title: "Light",
    img: projects.light,
    bg: "#0D1EA2",
    href: "https://light-website-bysoft.vercel.app/",
    color: "#e8e7e3",
    intro:
      "Every project is custom. \nEvery approach is collaborative. \nEvery result moves people",
    stack: ["Typescript", "Tailwind", "gsap", "Next.js", "Motion design"],
  },
  {
    id: 6,
    title: "Skyline",
    img: projects.skyline,
    bg: "#79BADD",
    href: "",
    color: "#e8e7e3",
    intro: "Let us help you reach your dream clients today ",
    stack: ["Typescript","Tailwind", "gsap", "framer-motion", "Next.js"],
    disabled: true,
  },
  {
    id: 7,
    title: "SoftlifeX",
    img: projects.only,
    bg: "#1A232E",
    href: "https://softlifex.vercel.app/",
    color: "#e8e7e3",
    intro:
      "So why not say HI, after-all \nevery great projects starts with that first conversation",
      stack: ["Javascript","css3", "gsap",  "Next.js"]
  },
];
