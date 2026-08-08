"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { isNonEmpty, isValidEmail, isWithinLength } from "@/lib/validation/rules";

const CONTACT_FORM_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

type Status = "idle" | "submitting" | "success" | "error" | "not-configured";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!isNonEmpty(name)) next.name = "Enter your name.";
    if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (!isWithinLength(message, 2000, 1)) next.message = "Enter a message (up to 2000 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (!CONTACT_FORM_ENDPOINT) {
      setStatus("not-configured");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-medium text-success">
        Thanks — your message has been sent. We&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-lg">
      <FormField label="Name" error={errors.name} required>
        {(a11y) => <Input {...a11y} value={name} onChange={(e) => setName(e.target.value)} />}
      </FormField>
      <FormField label="Email" error={errors.email} required>
        {(a11y) => (
          <Input {...a11y} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        )}
      </FormField>
      <FormField label="Message" error={errors.message} required>
        {(a11y) => (
          <Textarea
            {...a11y}
            value={message}
            maxLength={2000}
            onChange={(e) => setMessage(e.target.value)}
          />
        )}
      </FormField>

      {status === "not-configured" && (
        <p role="status" className="mb-4 text-sm text-text-muted">
          The contact form isn&apos;t connected yet — please email us directly instead.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mb-4 text-sm text-danger">
          Something went wrong sending your message. Please try emailing us directly.
        </p>
      )}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
