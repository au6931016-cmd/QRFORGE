import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Container, Section } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Log in",
  description: "Log in to your account.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Log in</h1>
        <p className="mt-3 text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
        <div className="mt-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}
