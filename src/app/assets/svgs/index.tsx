// components/icons/index.ts
import { ComponentType, memo as reactMemo } from "react";

import Html from "./html";
import Bootstrap from "./bootstrap";
import Css from "./css";
import Tailwind from "./tailwind";
import Sass from "./sass";
import Gsap from "./gsap";
import Express from "./express";
import Javascript from "./javascript";
import Nodejs from "./nodejs";
import Reacticon from "./react";
import Gitlab from "./gitlab";
import Nextjs from "./nextjs";
import Git from "./git";
import Bitbucket from "./bitbucket";
import Flutter from "./flutter";
import Typescript from "./typescript";
import GithubIcon from "./githubIcon";
import tRPC from "./tRPC";
import prisma from "./prisma";
import mongoDB from "./mongoDB";

/**
 * Memo wrapper for SVG components
 */
const memo = <P,>(Comp: ComponentType<P>) =>
  reactMemo(Comp) as ComponentType<P>;

export const Icons = {
  Html: memo(Html),
  Bootstrap: memo(Bootstrap),
  Css: memo(Css),
  Tailwind: memo(Tailwind),
  Sass: memo(Sass),
  Express: memo(Express),
  Javascript: memo(Javascript),
  Nodejs: memo(Nodejs),
  Reacticon: memo(Reacticon),
  Gitlab: memo(Gitlab),
  Nextjs: memo(Nextjs),
  Git: memo(Git),
  tRPC: memo(tRPC),
  mongoDB: memo(mongoDB),
  prisma: memo(prisma),
  Gsap: memo(Gsap),
  Bitbucket: memo(Bitbucket),
  Flutter: memo(Flutter),
  Typescript: memo(Typescript),
  GithubIcon: memo(GithubIcon),
} as const;

export type IconName = keyof typeof Icons;
