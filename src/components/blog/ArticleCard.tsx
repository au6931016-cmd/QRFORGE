import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { BlogPost } from "@/types/blog";

interface ArticleCardProps {
  post: BlogPost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-bg p-6 transition-colors hover:border-primary"
    >
      <Badge>{post.category}</Badge>
      <h3 className="mt-3 text-lg font-semibold text-text group-hover:text-primary">
        {post.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{post.description}</p>
      <time dateTime={post.publishedDate} className="mt-4 text-xs text-text-muted">
        {new Date(post.publishedDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    </Link>
  );
}
