import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { blogPosts, getBlogPostBySlug } from "@/data/blog/posts";
import { qrTypeMeta } from "@/data/qr-types/meta";
import { articleJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = (post.relatedSlugs ?? [])
    .map((s) => getBlogPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          author: post.author,
          publishedDate: post.publishedDate,
          updatedDate: post.updatedDate,
        })}
      />
      <Section className="pb-0 pt-8 sm:pt-10">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]}
          />
          <Badge className="mt-4">{post.category}</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <span>{post.author}</span>
            <span aria-hidden="true">&middot;</span>
            <time dateTime={post.publishedDate}>
              {new Date(post.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </Container>
      </Section>

      <Section className="pt-8">
        <Container className="max-w-3xl">
          <AdSlot placement="articleTop" className="mb-8" />
          <ArticleContent blocks={post.content} />
          <AdSlot placement="articleBottom" className="mt-10" />
        </Container>
      </Section>

      {(post.relatedTools?.length || relatedPosts.length) && (
        <Section className="border-t border-border bg-surface/50">
          <Container className="max-w-3xl">
            {post.relatedTools && post.relatedTools.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-text">Try the related tool</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.relatedTools.map((type) => (
                    <Link
                      key={type}
                      href={`/qr-code-generator/${type}`}
                      className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                      {qrTypeMeta[type as keyof typeof qrTypeMeta].label} QR Code
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-text">Related articles</h2>
                <ul className="mt-3 space-y-2">
                  {relatedPosts.map((related) => (
                    <li key={related.slug}>
                      <Link
                        href={`/blog/${related.slug}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {related.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Container>
        </Section>
      )}
    </>
  );
}
