"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidEmail } from "@/lib/validation/rules";

const NEWSLETTER_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

type Status = "idle" | "submitting" | "success" | "error" | "not-configured";

/**
 * Newsletter capture is intentionally inert until NEXT_PUBLIC_NEWSLETTER_ENDPOINT
 * is set to a real provider endpoint (e.g. Mailchimp, ConvertKit, Buttondown).
 * We never fake a "subscribed" confirmation for an integration that doesn't
 * exist yet — see .env.example for how to wire one in.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    if (!NEWSLETTER_ENDPOINT) {
      setStatus("not-configured");
      return;
    }
    setStatus("submitting");
    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="text-sm font-medium text-success">You&apos;re subscribed — thanks!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        invalid={status === "error"}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
      />
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Subscribing…" : "Subscribe"}
      </Button>
      {status === "error" && (
        <p role="alert" className="text-xs text-danger sm:hidden">
          Enter a valid email address.
        </p>
      )}
      {status === "not-configured" && (
        <p role="status" className="text-xs text-text-muted">
          Newsletter signup isn&apos;t connected yet.
        </p>
      )}
    </form>
  );
}
