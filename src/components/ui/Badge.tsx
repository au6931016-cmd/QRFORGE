import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeTone = "neutral" | "primary" | "violet" | "rose" | "amber" | "teal";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface text-text-muted",
  primary: "border-primary/20 bg-primary/10 text-primary",
  violet: "border-accent-violet/20 bg-accent-violet/10 text-accent-violet",
  rose: "border-accent-rose/20 bg-accent-rose/10 text-accent-rose",
  amber: "border-accent-amber/20 bg-accent-amber/10 text-accent-amber",
  teal: "border-accent-teal/20 bg-accent-teal/10 text-accent-teal",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
