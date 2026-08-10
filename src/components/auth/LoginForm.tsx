"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loginSchema } from "@/lib/auth/schemas";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!isSupabaseConfigured()) {
      setFormError("Accounts aren't set up on this site yet — please check back soon.");
      return;
    }

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(result.data);
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    router.replace(safeNextPath(searchParams.get("next")));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-sm">
      <FormField label="Email" error={errors.email} required>
        {(a11y) => (
          <Input {...a11y} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        )}
      </FormField>
      <FormField label="Password" error={errors.password} required>
        {(a11y) => (
          <Input
            {...a11y}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </FormField>

      {formError && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
