import { Icons, type IconName } from "@/app/assets/svgs";
import { cn } from "@/lib/utils";

type TagProps = {
  icon: IconName;
  label: string;
  className?: string;
};

export function Tag({ icon, label, className }: TagProps) {
  const Icon = Icons[icon];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm",
        "border-primary-foreground/50 text-foreground border",
        className
      )}
    >
      <Icon className="w-fit h-fit shrink-0" />
      <span className="whitespace-nowrap text-sm">{label}</span>
    </div>
  );
}