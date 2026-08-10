import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { Container, Section } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Sign up",
  description: "Create a free account to save QR codes and unlock Pro features.",
  path: "/signup",
  noIndex: true,
});

export default function SignupPage() {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
        <div className="mt-8">
          <Suspense>
            <SignupForm />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}
