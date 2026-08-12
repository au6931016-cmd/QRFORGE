"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Menu } from "@/components/ui/Menu";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { SearchIcon, StarIcon } from "@/components/icons";
import { useRealtimeQrCodes } from "@/hooks/useRealtimeQrCodes";
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
import { downloadSavedQrCode } from "@/lib/qr/saved-qr";
import { cn } from "@/lib/utils/cn";
import type { QRCodeRow } from "@/types/database";
import type { QRCodeType } from "@/types/qr";

interface DashboardQRTableProps {
  qrCodes: QRCodeRow[];
  scanCounts: Record<string, number>;
  userId: string;
}

export function DashboardQRTable({ qrCodes: initialQrCodes, scanCounts, userId }: DashboardQRTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [qrCodes, setQrCodes] = useState(initialQrCodes);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingFavoriteId, setPendingFavoriteId] = useState<string | null>(null);
  const [pendingDuplicateId, setPendingDuplicateId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<QRCodeType | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(searchParams.get("filter") === "favorites");

  const realtimeQrCodes = useRealtimeQrCodes(initialQrCodes, userId);
  const displayedQrCodes = realtimeQrCodes.length > 0 ? realtimeQrCodes : qrCodes;

  const filteredQrCodes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return displayedQrCodes.filter((qr) => {
      if (favoritesOnly && !qr.is_favorite) return false;
      if (typeFilter !== "all" && qr.type !== typeFilter) return false;
      if (!query) return true;
      const label = (qr.name || qrTypeMeta[qr.type].label).toLowerCase();
      return label.includes(query) || qrTypeMeta[qr.type].shortLabel.toLowerCase().includes(query);
    });
  }, [displayedQrCodes, search, typeFilter, favoritesOnly]);

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

  async function handleToggleFavorite(qr: QRCodeRow) {
    setPendingFavoriteId(qr.id);
    try {
      const response = await fetch(`/api/qr-codes/${qr.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !qr.is_favorite }),
      });
      if (!response.ok) throw new Error("Update failed");
      const { qrCode: updated } = await response.json();
      setQrCodes((prev) => prev.map((row) => (row.id === qr.id ? (updated as QRCodeRow) : row)));
      showToast(updated.is_favorite ? "Added to favorites." : "Removed from favorites.");
    } catch {
      showToast("Couldn't update favorites. Try again.", "error");
    } finally {
      setPendingFavoriteId(null);
    }
  }

  async function handleDuplicate(qr: QRCodeRow) {
    setPendingDuplicateId(qr.id);
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
      if (!response.ok) throw new Error("Duplicate failed");
      const { qrCode: created } = await response.json();
      setQrCodes((prev) => [created as QRCodeRow, ...prev]);
      showToast("QR code duplicated.");
    } catch {
      showToast("Couldn't duplicate that QR code. Try again.", "error");
    } finally {
      setPendingDuplicateId(null);
    }
  }

  async function handleDownload(qr: QRCodeRow) {
    try {
      await downloadSavedQrCode(qr);
    } catch {
      showToast("Couldn't prepare that download. Try again.", "error");
    }
  }

  const typeOptions = useMemo(() => {
    const present = new Set(displayedQrCodes.map((qr) => qr.type));
    return Array.from(present);
  }, [displayedQrCodes]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or type…"
            className="pl-9"
            aria-label="Search saved QR codes"
          />
        </div>
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as QRCodeType | "all")}
          className="sm:w-48"
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {qrTypeMeta[type].label}
            </option>
          ))}
        </Select>
        <button
          type="button"
          onClick={() => setFavoritesOnly((v) => !v)}
          aria-pressed={favoritesOnly}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-1.5 rounded-md border px-3.5 text-sm font-medium transition-colors",
            favoritesOnly
              ? "border-accent-amber bg-accent-amber/10 text-accent-amber"
              : "border-border text-text-muted hover:bg-surface",
          )}
        >
          <StarIcon className="h-4 w-4" />
          Favorites
        </button>
      </div>

      {filteredQrCodes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center text-sm text-text-muted">
          {favoritesOnly
            ? "No favorites yet — star a QR code to pin it here."
            : "No QR codes match your search."}
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-10" aria-label="Favorite" />
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Scans</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQrCodes.map((qr) => (
              <TableRow key={qr.id}>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(qr)}
                    disabled={pendingFavoriteId === qr.id}
                    aria-pressed={qr.is_favorite}
                    aria-label={qr.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface disabled:opacity-50"
                  >
                    <StarIcon
                      className={cn(
                        "h-4 w-4",
                        qr.is_favorite && "fill-accent-amber text-accent-amber",
                      )}
                    />
                  </button>
                </TableCell>
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
                      { label: "Download", onClick: () => void handleDownload(qr) },
                      {
                        label: pendingDuplicateId === qr.id ? "Duplicating…" : "Duplicate",
                        onClick: () => void handleDuplicate(qr),
                      },
                      { label: "Delete", tone: "danger", onClick: () => setPendingDeleteId(qr.id) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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
