"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastContext";
import { DownloadControls } from "@/components/qr/DownloadControls";
import { QRPreview } from "@/components/qr/QRPreview";
import { qrTypeMeta } from "@/data/qr-types/meta";
import { buildQRPayload } from "@/lib/qr/encode";
import { siteConfig } from "@/config/site";
import type { QRCodeRow } from "@/types/database";

interface QRDetailViewProps {
  qrCode: QRCodeRow;
}

export function QRDetailView({ qrCode: initial }: QRDetailViewProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [qrCode, setQrCode] = useState(initial);
  const [name, setName] = useState(initial.name);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const payload = qrCode.is_dynamic
    ? `${siteConfig.url}/r/${qrCode.short_code}`
    : buildQRPayload(qrCode.type, qrCode.form_data as never);

  async function handleSaveName() {
    if (name === qrCode.name) return;
    setIsSavingName(true);
    try {
      const response = await fetch(`/api/qr-codes/${qrCode.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Update failed");
      const { qrCode: updated } = await response.json();
      setQrCode(updated);
      showToast("Name updated.");
    } catch {
      showToast("Couldn't save the name. Try again.", "error");
    } finally {
      setIsSavingName(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/qr-codes/${qrCode.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      showToast("QR code deleted.");
      router.push("/dashboard");
    } catch {
      showToast("Couldn't delete that QR code. Try again.", "error");
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">
        &larr; Back to My QR Codes
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge>{qrTypeMeta[qrCode.type].label}</Badge>
        {qrCode.is_dynamic && <Badge tone="violet">Dynamic</Badge>}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <FormField label="Name">
              {(a11y) => (
                <div className="flex gap-2">
                  <Input {...a11y} value={name} onChange={(e) => setName(e.target.value)} />
                  <Button
                    variant="secondary"
                    disabled={isSavingName || name === qrCode.name}
                    onClick={handleSaveName}
                  >
                    {isSavingName ? "Saving…" : "Save"}
                  </Button>
                </div>
              )}
            </FormField>

            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
              Delete QR code
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <QRPreview data={payload} customization={qrCode.customization} />
            <div className="mt-6 border-t border-border pt-6">
              <DownloadControls
                data={payload}
                customization={qrCode.customization}
                type={qrCode.type}
                filenameBase={qrCode.name || qrCode.type}
                onPrint={() => window.print()}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete this QR code?"
      >
        <p className="text-sm text-text-muted">
          This can&apos;t be undone. If this is a dynamic QR code, any printed copies will stop
          working.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
