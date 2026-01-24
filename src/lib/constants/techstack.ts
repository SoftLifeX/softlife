// data/techStack.ts
import type { IconName } from "@/app/assets/svgs";

export type TechStackItem = {
  icon: IconName;
  name: string;
};

export const techStack: TechStackItem[] = [
  { icon: "Typescript", name: "TypeScript" },
  { icon: "Javascript", name: "JavaScript" },
  { icon: "Nextjs", name: "Next.js" },
  { icon: "Tailwind", name: "Tailwind" },
  { icon: "prisma", name: "Prisma" },
  { icon: "tRPC", name: "tRPC" },
  { icon: "Reacticon", name: "React" },
  { icon: "Reacticon", name: "ReactNative" },
  { icon: "Html", name: "HTML" },
  { icon: "Css", name: "CSS3" },
  { icon: "Bootstrap", name: "Bootstrap" },
  { icon: "Sass", name: "Sass" },
  { icon: "Express", name: "Express.js" },
  { icon: "Nodejs", name: "Node.js" },
  { icon: "mongoDB", name: "mongoDB" },
  { icon: "Gitlab", name: "Gitlab" },
  { icon: "Git", name: "Git" },
  { icon: "Bitbucket", name: "Bitbucket" },
  { icon: "Flutter", name: "Flutter" },
  { icon: "Gsap", name: "Gsap" },
];
