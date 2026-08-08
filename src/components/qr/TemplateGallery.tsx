import Link from "next/link";
import { qrTemplates } from "@/data/templates";
import { qrTypeMeta } from "@/data/qr-types/meta";

interface TemplateGalleryProps {
  limit?: number;
}

export function TemplateGallery({ limit }: TemplateGalleryProps) {
  const templates = limit ? qrTemplates.slice(0, limit) : qrTemplates;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Link
          key={template.id}
          href={`/qr-code-generator/${template.type}?template=${template.id}`}
          className="group rounded-lg border border-border bg-bg p-5 transition-colors hover:border-primary"
        >
          <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-text-muted">
            {qrTypeMeta[template.type].shortLabel} QR
          </span>
          <h3 className="mt-3 font-semibold text-text group-hover:text-primary">
            {template.name}
          </h3>
          <p className="mt-1.5 text-sm text-text-muted">{template.description}</p>
        </Link>
      ))}
    </div>
  );
}
