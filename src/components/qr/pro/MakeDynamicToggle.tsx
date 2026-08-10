"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "@/components/ui/ToastContext";
import type { QRCustomization } from "@/types/qr";

interface MakeDynamicToggleProps {
  data: Record<string, unknown>;
  customization: QRCustomization;
  disabled: boolean;
  onDynamicCreated: (shortCode: string) => void;
}

/**
 * Pro-only, url-type-only: swaps the encoded payload from the raw URL to
 * a short /r/[shortCode] redirect whose destination can be edited later
 * from the dashboard without reprinting the QR code.
 */
export function MakeDynamicToggle({
  data,
  customization,
  disabled,
  onDynamicCreated,
}: MakeDynamicToggleProps) {
  const { user, isPro, isLoading } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) return null;

  if (!user) {
    return (
      <p className="text-xs text-text-muted">
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>{" "}
        for a Pro account to make this QR code dynamic (editable after printing).
      </p>
    );
  }

  if (!isPro) {
    return (
      <p className="text-xs text-text-muted">
        Dynamic QR codes (editable after printing) are a Pro feature — coming soon.
      </p>
    );
  }

  async function handleMakeDynamic() {
    setIsSaving(true);
    try {
      const response = await fetch("/api/qr-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "url", data, customization, isDynamic: true }),
      });
      if (!response.ok) throw new Error("Failed");
      const { qrCode } = await response.json();
      onDynamicCreated(qrCode.short_code);
      showToast("Dynamic QR code created — saved to your dashboard.");
    } catch {
      showToast("Couldn't create a dynamic QR code. Try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Button variant="outline" size="sm" disabled={disabled || isSaving} onClick={handleMakeDynamic}>
      {isSaving ? "Creating…" : "Make dynamic (Pro)"}
    </Button>
  );
}
