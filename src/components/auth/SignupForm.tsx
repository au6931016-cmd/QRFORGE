"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signupSchema } from "@/lib/auth/schemas";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!isSupabaseConfigured()) {
      setFormError("Accounts aren't set up on this site yet — please check back soon.");
      return;
    }

    const result = signupSchema.safeParse({ email, password, confirmPassword });
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
    const { data, error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    if (data.session) {
      // Email confirmation is off for this project — already logged in.
      router.replace(safeNextPath(searchParams.get("next")));
      router.refresh();
      return;
    }

    setNeedsEmailConfirmation(true);
  }

  if (needsEmailConfirmation) {
    return (
      <p role="status" className="max-w-sm text-sm leading-relaxed text-text-muted">
        Check your inbox at <span className="font-medium text-text">{email}</span> and click the
        confirmation link to finish creating your account.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-sm">
      <FormField label="Email" error={errors.email} required>
        {(a11y) => (
          <Input {...a11y} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        )}
      </FormField>
      <FormField label="Password" error={errors.password} hint="At least 8 characters" required>
        {(a11y) => (
          <Input
            {...a11y}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </FormField>
      <FormField label="Confirm password" error={errors.confirmPassword} required>
        {(a11y) => (
          <Input
            {...a11y}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
      </FormField>

      {formError && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
