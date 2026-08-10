"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Menu } from "@/components/ui/Menu";
import { Modal } from "@/components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { useToast } from "@/components/ui/ToastContext";
import { qrTypeMeta } from "@/data/qr-types/meta";
import type { QRCodeRow } from "@/types/database";

interface DashboardQRTableProps {
  qrCodes: QRCodeRow[];
  scanCounts: Record<string, number>;
}

export function DashboardQRTable({ qrCodes: initialQrCodes, scanCounts }: DashboardQRTableProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [qrCodes, setQrCodes] = useState(initialQrCodes);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/qr-codes/${pendingDeleteId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setQrCodes((prev) => prev.filter((qr) => qr.id !== pendingDeleteId));
      showToast("QR code deleted.");
    } catch {
      showToast("Couldn't delete that QR code. Try again.", "error");
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Scans</TableHeaderCell>
            <TableHeaderCell>Created</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qrCodes.map((qr) => (
            <TableRow key={qr.id}>
              <TableCell>
                <Link
                  href={`/dashboard/${qr.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {qr.name || qrTypeMeta[qr.type].label}
                </Link>
              </TableCell>
              <TableCell>
                <Badge>{qrTypeMeta[qr.type].shortLabel}</Badge>
                {qr.is_dynamic && (
                  <Badge tone="violet" className="ml-1.5">
                    Dynamic
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-text-muted">
                {qr.is_dynamic ? (scanCounts[qr.id] ?? 0) : "—"}
              </TableCell>
              <TableCell className="text-text-muted">
                {new Date(qr.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Menu
                  items={[
                    { label: "View / Edit", onClick: () => router.push(`/dashboard/${qr.id}`) },
                    { label: "Delete", tone: "danger", onClick: () => setPendingDeleteId(qr.id) },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        title="Delete this QR code?"
      >
        <p className="text-sm text-text-muted">
          This can&apos;t be undone. If this is a dynamic QR code, any printed copies will stop
          working.
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
