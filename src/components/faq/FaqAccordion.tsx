export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

/**
 * Uses native <details>/<summary> — accessible and keyboard-operable by
 * default, no client-side JS or ARIA plumbing required.
 */
export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-bg">
      {items.map((item) => (
        <details key={item.question} className="group p-5 open:bg-surface/50">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-text marker:content-none">
            {item.question}
            <span
              aria-hidden="true"
              className="shrink-0 text-text-muted transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
