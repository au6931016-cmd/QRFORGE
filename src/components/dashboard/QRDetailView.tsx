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
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { useToast } from "@/components/ui/ToastContext";
import { DownloadControls } from "@/components/qr/DownloadControls";
import { QRPreview } from "@/components/qr/QRPreview";
import { qrTypeMeta } from "@/data/qr-types/meta";
import { isValidUrl } from "@/lib/validation/rules";
import { buildQRPayload } from "@/lib/qr/encode";
import type { ScanStats } from "@/lib/dynamic-qr/get-scan-stats";
import { siteConfig } from "@/config/site";
import type { QRCodeRow } from "@/types/database";

interface QRDetailViewProps {
  qrCode: QRCodeRow;
  scanStats: ScanStats | null;
}

export function QRDetailView({ qrCode: initial, scanStats }: QRDetailViewProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [qrCode, setQrCode] = useState(initial);
  const [name, setName] = useState(initial.name);
  const [destinationUrl, setDestinationUrl] = useState(initial.destination_url ?? "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingDestination, setIsSavingDestination] = useState(false);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const payload = qrCode.is_dynamic
    ? `${siteConfig.url}/r/${qrCode.short_code}`
    : buildQRPayload(qrCode.type, qrCode.form_data as never);

  async function patchQRCode(body: Record<string, unknown>) {
    const response = await fetch(`/api/qr-codes/${qrCode.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Update failed");
    const { qrCode: updated } = await response.json();
    return updated as QRCodeRow;
  }

  async function handleSaveName() {
    if (name === qrCode.name) return;
    setIsSavingName(true);
    try {
      const updated = await patchQRCode({ name });
      setQrCode(updated);
      showToast("Name updated.");
    } catch {
      showToast("Couldn't save the name. Try again.", "error");
    } finally {
      setIsSavingName(false);
    }
  }

  async function handleSaveDestination() {
    if (destinationUrl === qrCode.destination_url) return;
    const normalized = destinationUrl.startsWith("http") ? destinationUrl : `https://${destinationUrl}`;
    if (!isValidUrl(normalized)) {
      setDestinationError("Enter a valid URL, e.g. https://example.com");
      return;
    }
    setDestinationError(null);
    setIsSavingDestination(true);
    try {
      const updated = await patchQRCode({ destinationUrl: normalized });
      setQrCode(updated);
      setDestinationUrl(updated.destination_url ?? "");
      showToast("Destination updated — the printed QR code now points here.");
    } catch {
      showToast("Couldn't update the destination. Try again.", "error");
    } finally {
      setIsSavingDestination(false);
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

            {qrCode.is_dynamic && (
              <FormField
                label="Destination URL"
                error={destinationError ?? undefined}
                hint="Editing this updates where the printed QR code redirects to — no reprinting needed."
              >
                {(a11y) => (
                  <div className="flex gap-2">
                    <Input
                      {...a11y}
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                    />
                    <Button
                      variant="secondary"
                      disabled={isSavingDestination || destinationUrl === qrCode.destination_url}
                      onClick={handleSaveDestination}
                    >
                      {isSavingDestination ? "Saving…" : "Save"}
                    </Button>
                  </div>
                )}
              </FormField>
            )}

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

      {scanStats && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-text">Scan analytics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Total scans
                </p>
                <p className="mt-1 text-2xl font-semibold text-text">{scanStats.totalScans}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Last 7 days
                </p>
                <p className="mt-1 text-2xl font-semibold text-text">{scanStats.last7Days}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Last scan
                </p>
                <p className="mt-1 text-sm font-medium text-text">
                  {scanStats.lastScanAt ? new Date(scanStats.lastScanAt).toLocaleString() : "No scans yet"}
                </p>
              </CardContent>
            </Card>
          </div>

          {scanStats.dailyCounts.length > 0 && (
            <div className="mt-4">
              <Table>
                <TableBody>
                  {scanStats.dailyCounts.map(([day, count]) => (
                    <TableRow key={day}>
                      <TableCell>{day}</TableCell>
                      <TableCell className="text-right">{count} scan{count === 1 ? "" : "s"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

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
