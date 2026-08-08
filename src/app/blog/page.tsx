import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/ui/Container";
import { blogPosts } from "@/data/blog/posts";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Guides and explainers on creating, printing, and using QR codes — from Wi-Fi codes to marketing best practices.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );

  return (
    <Section className="pt-8 sm:pt-10">
      <Container>
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">Blog</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
          Practical guides on creating, printing, and using QR codes well.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
