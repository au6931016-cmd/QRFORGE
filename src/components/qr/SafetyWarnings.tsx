import { Alert } from "@/components/ui/Alert";
import type { SafetyWarning } from "@/lib/qr/safety";

interface SafetyWarningsProps {
  warnings: SafetyWarning[];
}

export function SafetyWarnings({ warnings }: SafetyWarningsProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-2" aria-live="polite">
      {warnings.map((warning) => (
        <Alert key={warning.id} tone={warning.severity === "warning" ? "warning" : "info"}>
          {warning.message}
        </Alert>
      ))}
    </div>
  );
}
