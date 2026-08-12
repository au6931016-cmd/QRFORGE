"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { qrTypeMeta } from "@/data/qr-types/meta";
import { downloadSavedQrCode } from "@/lib/qr/saved-qr";
import { useToast } from "@/components/ui/ToastContext";
import type { QRCodeRow } from "@/types/database";

const PAGE_SIZE = 15;

interface QRHistoryListProps {
  qrCodes: QRCodeRow[];
}

function groupByDate(qrCodes: QRCodeRow[]): [string, QRCodeRow[]][] {
  const groups = new Map<string, QRCodeRow[]>();
  for (const qr of qrCodes) {
    const key = new Date(qr.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const existing = groups.get(key);
    if (existing) existing.push(qr);
    else groups.set(key, [qr]);
  }
  return Array.from(groups.entries());
}

export function QRHistoryList({ qrCodes: initial }: QRHistoryListProps) {
  const { showToast } = useToast();
  const [qrCodes, setQrCodes] = useState(initial);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible = qrCodes.slice(0, visibleCount);
  const grouped = useMemo(() => groupByDate(visible), [visible]);

  async function handleDownload(qr: QRCodeRow) {
    setBusyId(qr.id);
    try {
      await downloadSavedQrCode(qr);
    } catch {
      showToast("Couldn't prepare that download. Try again.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleGenerateAgain(qr: QRCodeRow) {
    setBusyId(qr.id);
    try {
      const response = await fetch("/api/qr-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: qr.type,
          data: qr.form_data,
          customization: qr.customization,
          name: `${qr.name || qrTypeMeta[qr.type].label} (copy)`,
          isDynamic: false,
        }),
      });
      if (!response.ok) throw new Error("Generate again failed");
      const { qrCode: created } = await response.json();
      setQrCodes((prev) => [created as QRCodeRow, ...prev]);
      showToast("Generated a fresh copy of this QR code.");
    } catch {
      showToast("Couldn't generate that QR code again. Try again.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/qr-codes/${pendingDeleteId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setQrCodes((prev) => prev.filter((qr) => qr.id !== pendingDeleteId));
      showToast("Removed from history.");
    } catch {
      showToast("Couldn't remove that item. Try again.", "error");
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  }

  if (qrCodes.length === 0) {
    return (
      <Card>
        <CardContent className="px-6 py-10 text-center">
          <h2 className="text-lg font-semibold text-text">No QR history yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            Your QR generation history will appear here as soon as you save a QR code to your
            account.
          </p>
          <Link href="/qr-code-generator" className="mt-5 inline-block">
            <Button size="sm">Create a QR Code</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {grouped.map(([date, items]) => (
          <div key={date}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
              {date}
            </h2>
            <div className="space-y-2">
              {items.map((qr) => (
                <div
                  key={qr.id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-bg p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/${qr.id}`}
                        className="truncate font-medium text-text hover:text-primary hover:underline"
                      >
                        {qr.name || qrTypeMeta[qr.type].label}
                      </Link>
                      <Badge>{qrTypeMeta[qr.type].shortLabel}</Badge>
                      {qr.is_dynamic && <Badge tone="violet">Dynamic</Badge>}
                      {qr.is_favorite && <Badge tone="amber">Favorite</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-text-muted">
                      {new Date(qr.created_at).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/dashboard/${qr.id}`}>
                      <Button variant="outline" size="sm">
                        Open
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busyId === qr.id}
                      onClick={() => void handleDownload(qr)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busyId === qr.id}
                      onClick={() => void handleGenerateAgain(qr)}
                    >
                      {busyId === qr.id ? "Working…" : "Generate Again"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPendingDeleteId(qr.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {visibleCount < qrCodes.length && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Load more
          </Button>
        </div>
      )}

      <Modal
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        title="Remove this from your history?"
      >
        <p className="text-sm text-text-muted">
          This permanently deletes the QR code. This can&apos;t be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" disabled={isDeleting} onClick={handleConfirmDelete}>
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
