"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "@/components/ui/ToastContext";
import type { QRCodeType, QRCustomization } from "@/types/qr";

interface SaveToAccountButtonProps {
  type: QRCodeType;
  data: Record<string, unknown>;
  customization: QRCustomization;
  disabled: boolean;
}

export function SaveToAccountButton({
  type,
  data,
  customization,
  disabled,
}: SaveToAccountButtonProps) {
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  if (isLoading) return null;

  if (!user) {
    return (
      <p className="text-xs text-text-muted">
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>{" "}
        to save this QR code to your account.
      </p>
    );
  }

  if (savedId) {
    return (
      <p className="text-xs text-success">
        Saved.{" "}
        <Link href={`/dashboard/${savedId}`} className="font-medium hover:underline">
          View in dashboard
        </Link>
      </p>
    );
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const response = await fetch("/api/qr-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data, customization }),
      });
      if (!response.ok) throw new Error("Save failed");
      const { qrCode } = await response.json();
      setSavedId(qrCode.id);
      showToast("QR code saved to your account.");
    } catch {
      showToast("Couldn't save that QR code. Try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Button variant="outline" size="sm" disabled={disabled || isSaving} onClick={handleSave}>
      {isSaving ? "Saving…" : "Save to my account"}
    </Button>
  );
}
