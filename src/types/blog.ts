export type ContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "quote"; text: string; attribution?: string }
  | { kind: "callout"; text: string; tone?: "info" | "warning" };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: ContentBlock[];
  author: string;
  publishedDate: string;
  updatedDate: string;
  category: string;
  tags: string[];
  relatedTools?: string[];
  relatedSlugs?: string[];
}
