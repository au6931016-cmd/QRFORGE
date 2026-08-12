"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastContext";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail } from "@/lib/validation/rules";

interface AccountSettingsViewProps {
  email: string;
  fullName: string;
}

export function AccountSettingsView({ email, fullName: initialFullName }: AccountSettingsViewProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(initialFullName);
  const [savingName, setSavingName] = useState(false);

  const [newEmail, setNewEmail] = useState(email);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [savingEmail, setSavingEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSaveName(e: FormEvent) {
    e.preventDefault();
    setSavingName(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });
      if (error) throw error;
      showToast("Profile updated.");
      router.refresh();
    } catch {
      showToast("Couldn't update your name. Try again.", "error");
    } finally {
      setSavingName(false);
    }
  }

  async function handleSaveEmail(e: FormEvent) {
    e.preventDefault();
    setEmailError(null);
    if (!isValidEmail(newEmail)) {
      setEmailError("Enter a valid email address");
      return;
    }
    if (newEmail === email) return;
    setSavingEmail(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      showToast("Check your new email inbox to confirm the change.");
    } catch {
      showToast("Couldn't update your email. Try again.", "error");
    } finally {
      setSavingEmail(false);
    }
  }

  async function handleSavePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    setSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirmPassword("");
      showToast("Password updated.");
    } catch {
      showToast("Couldn't update your password. Try again.", "error");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/account/delete", { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      showToast("Couldn't delete your account. Try again.", "error");
      setIsDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">Settings</p>
        <h1 className="text-3xl font-semibold text-text">Account settings</h1>
        <Link href="/account" className="text-sm font-medium text-primary hover:underline">
          &larr; Back to profile
        </Link>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-text">Profile information</h2>
            <form onSubmit={handleSaveName} className="mt-4 max-w-sm">
              <FormField label="Full name" hint="Shown in your account menu and profile.">
                {(a11y) => (
                  <Input
                    {...a11y}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                )}
              </FormField>
              <Button type="submit" size="sm" disabled={savingName || fullName === initialFullName}>
                {savingName ? "Saving…" : "Save name"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-text">Email address</h2>
            <form onSubmit={handleSaveEmail} className="mt-4 max-w-sm">
              <FormField label="Email" error={emailError ?? undefined}>
                {(a11y) => (
                  <Input
                    {...a11y}
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                )}
              </FormField>
              <Button type="submit" size="sm" disabled={savingEmail || newEmail === email}>
                {savingEmail ? "Saving…" : "Update email"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-text">Change password</h2>
            <form onSubmit={handleSavePassword} className="mt-4 max-w-sm">
              <FormField label="New password" required>
                {(a11y) => (
                  <Input
                    {...a11y}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                )}
              </FormField>
              <FormField label="Confirm new password" error={passwordError ?? undefined} required>
                {(a11y) => (
                  <Input
                    {...a11y}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                )}
              </FormField>
              <Button type="submit" size="sm" disabled={savingPassword || !password}>
                {savingPassword ? "Saving…" : "Update password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-danger/30">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-text">Danger zone</h2>
            <p className="mt-2 text-sm text-text-muted">
              Deleting your account permanently removes your profile and all saved QR codes. This
              cannot be undone.
            </p>
            <Button variant="danger" size="sm" className="mt-4" onClick={() => setShowDeleteModal(true)}>
              Delete account
            </Button>
          </CardContent>
        </Card>
      </div>

      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmText("");
        }}
        title="Delete your account?"
      >
        <p className="text-sm text-text-muted">
          This permanently deletes your account, profile, and every saved QR code. Type{" "}
          <Badge tone="rose">DELETE</Badge> below to confirm.
        </p>
        <Input
          className="mt-4"
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          placeholder="Type DELETE to confirm"
          aria-label="Type DELETE to confirm account deletion"
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmText("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={deleteConfirmText !== "DELETE" || isDeleting}
            onClick={handleDeleteAccount}
          >
            {isDeleting ? "Deleting…" : "Delete my account"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
