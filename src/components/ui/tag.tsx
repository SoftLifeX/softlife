"use client";

import { Icons, type IconName } from "@/app/assets/svgs";
import { cn } from "@/lib/utils";
import Magnetic from "../magnetic";

type TagProps = {
  icon: IconName;
  label: string;
  className?: string;
};

export function Tag({ icon, label, className }: TagProps) {
  const Icon = Icons[icon];

  return (
    <Magnetic strength={0.4}>
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
          "bg-tag-background backdrop-blur-sm",
          "transition-all duration-200 ease-(--ease-custom)",
          className
        )}
      >
        <Icon className="w-fit h-fit shrink-0" />
        <span className="whitespace-nowrap text-tag-foreground text-sm">
          {label}
        </span>
      </div>
    </Magnetic>
  );
}
