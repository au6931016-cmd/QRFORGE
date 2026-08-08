import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type AlertTone = "warning" | "info" | "danger" | "success";

const toneClasses: Record<AlertTone, string> = {
  warning: "bg-warning-bg border-warning-border text-warning",
  info: "bg-sky-50 border-sky-200 text-sky-800",
  danger: "bg-red-50 border-red-200 text-danger",
  success: "bg-green-50 border-green-200 text-success",
};

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
}

export function Alert({ className, tone = "info", role = "status", ...props }: AlertProps) {
  return (
    <div
      role={role}
      className={cn(
        "rounded-md border px-4 py-3 text-sm leading-relaxed",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
