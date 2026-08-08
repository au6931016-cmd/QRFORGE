import { Alert } from "@/components/ui/Alert";
import type { ContentBlock } from "@/types/blog";

interface ArticleContentProps {
  blocks: ContentBlock[];
}

export function ArticleContent({ blocks }: ArticleContentProps) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        switch (block.kind) {
          case "heading":
            return (
              <h2 key={key} className="pt-2 text-xl font-semibold text-text">
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={key} className="text-base leading-relaxed text-text-muted">
                {block.text}
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol key={key} className="list-decimal space-y-2 pl-5 text-base leading-relaxed text-text-muted">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={key} className="list-disc space-y-2 pl-5 text-base leading-relaxed text-text-muted">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={key} className="border-l-4 border-primary/30 pl-4 italic text-text-muted">
                {block.text}
                {block.attribution && (
                  <footer className="mt-1 text-sm not-italic text-text-muted/80">
                    — {block.attribution}
                  </footer>
                )}
              </blockquote>
            );
          case "callout":
            return (
              <Alert key={key} tone={block.tone === "warning" ? "warning" : "info"}>
                {block.text}
              </Alert>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
