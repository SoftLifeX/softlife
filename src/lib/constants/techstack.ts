import type { IconName } from "@/app/assets/svgs";

export type TechStackItem = {
  icon: IconName;
  name: string;
};

export type TechStackCategory = {
  category: string;
  items: TechStackItem[];
};

export const techStack: TechStackCategory[] = [
  {
    category: "Languages",
    items: [
      { icon: "Typescript", name: "TypeScript" },
      { icon: "Javascript", name: "JavaScript" },
      { icon: "Html", name: "HTML" },
      { icon: "Css", name: "CSS3" },
    ],
  },

  {
    category: "Frontend",
    items: [
      { icon: "Reacticon", name: "React" },
      { icon: "Nextjs", name: "Next.js" },
      { icon: "Tailwind", name: "Tailwind" },
      { icon: "Bootstrap", name: "Bootstrap" },
      { icon: "Sass", name: "Sass" },
      { icon: "Gsap", name: "Gsap" },
      { icon: "Redux", name: "Redux" },
      { icon: "Zustand", name: "Zustand" },
    ],
  },

  {
    category: "Mobile",
    items: [
      { icon: "Reacticon", name: "ReactNative" },
      { icon: "Expo", name: "Expo" },
      { icon: "Flutter", name: "Flutter" },
    ],
  },

  {
    category: "Backend",
    items: [
      { icon: "Nodejs", name: "Node.js" },
      { icon: "Express", name: "Express.js" },
      { icon: "tRPC", name: "tRPC" },
      { icon: "prisma", name: "Prisma" },
      { icon: "mongoDB", name: "mongoDB" },
      { icon: "PostgreSQL", name: "PostgreSQL" },
      { icon: "GraphQl", name: "GraphQL" },
      { icon: "Redis", name: "Redis" },
    ],
  },

  {
    category: "Tools & DevOps",
    items: [
      { icon: "Git", name: "Git" },
      { icon: "Gitlab", name: "Gitlab" },
      { icon: "Bitbucket", name: "Bitbucket" },
      { icon: "Docker", name: "Docker" },
      { icon: "Vercel", name: "Vercel" },
      { icon: "GithubIcon", name: "GitHub" },
    ],
  },
];