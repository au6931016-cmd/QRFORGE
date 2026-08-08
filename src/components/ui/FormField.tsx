import { type ReactNode, useId } from "react";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils/cn";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (props: { id: string; "aria-describedby"?: string }) => ReactNode;
}

export function FormField({ label, error, hint, required, className, children }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("mb-4", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-danger"> *</span>}
      </Label>
      {children({ id, "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
