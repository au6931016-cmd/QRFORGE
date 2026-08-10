"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { QRTypeSelector } from "@/components/qr/QRTypeSelector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "@/components/ui/ToastContext";
import { buildCsvTemplate, coerceRowData, csvColumnsForType } from "@/lib/qr/bulk";
import { buildQRStylingOptions } from "@/lib/qr/build-options";
import { slugifyFilename } from "@/lib/qr/download";
import { buildQRPayload } from "@/lib/qr/encode";
import { validateQRData } from "@/lib/qr/schemas";
import { DEFAULT_CUSTOMIZATION } from "@/types/qr";
import type { QRCodeType } from "@/types/qr";

interface ParsedRow {
  index: number;
  name: string;
  data: Record<string, unknown>;
  errors: string[];
}

const MAX_ROWS = 200;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function BulkGenerator() {
  const { user, isPro, isLoading } = useAuth();
  const { showToast } = useToast();
  const [type, setType] = useState<QRCodeType>("url");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (isLoading) return null;

  if (!user) {
    return (
      <p className="text-sm text-text-muted">
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>{" "}
        for a Pro account to generate QR codes in bulk.
      </p>
    );
  }

  if (!isPro) {
    return <p className="text-sm text-text-muted">Bulk generation is a Pro feature — coming soon.</p>;
  }

  function handleTypeChange(nextType: QRCodeType) {
    setType(nextType);
    setRows([]);
    setFileName(null);
  }

  function handleDownloadTemplate() {
    const csv = buildCsvTemplate(type);
    downloadBlob(new Blob([csv], { type: "text/csv" }), `scangrid-${type}-template.csv`);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows: ParsedRow[] = results.data.slice(0, MAX_ROWS).map((raw, i) => {
          const data = coerceRowData(type, raw);
          const validation = validateQRData(type, data);
          const errors = validation.success
            ? []
            : validation.error.issues.map((issue) => `${String(issue.path[0] ?? "")}: ${issue.message}`);
          return {
            index: i,
            name: (raw.name ?? "").trim() || `${type}-${i + 1}`,
            data: validation.success ? validation.data : data,
            errors,
          };
        });
        setRows(parsedRows);
      },
    });
  }

  const validRows = rows.filter((row) => row.errors.length === 0);

  async function handleGenerateZip() {
    if (validRows.length === 0) return;
    setIsGenerating(true);
    try {
      const [{ default: QRCodeStyling }, { default: JSZip }] = await Promise.all([
        import("qr-code-styling"),
        import("jszip"),
      ]);
      const zip = new JSZip();

      for (const row of validRows) {
        const payload = buildQRPayload(type, row.data as never);
        const options = buildQRStylingOptions(payload, DEFAULT_CUSTOMIZATION, 600);
        const instance = new QRCodeStyling(options);
        const blob = (await instance.getRawData("png")) as Blob | null;
        if (!blob) continue;
        zip.file(`${slugifyFilename(row.name)}.png`, await blob.arrayBuffer());
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `scangrid-bulk-${type}.zip`);
      showToast(`Generated ${validRows.length} QR code${validRows.length === 1 ? "" : "s"}.`);
    } catch {
      showToast("Couldn't generate the ZIP. Try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5 pt-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-text">1. Choose a QR code type</h2>
            <QRTypeSelector value={type} onChange={handleTypeChange} />
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-text">2. Download the CSV template</h2>
            <p className="mb-3 text-xs text-text-muted">
              Columns: {csvColumnsForType(type).join(", ")}
            </p>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              Download CSV template
            </Button>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-text">3. Upload your filled-in CSV</h2>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="text-sm text-text-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-bg file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-text hover:file:bg-surface"
            />
            {fileName && <p className="mt-2 text-xs text-text-muted">{fileName}</p>}
          </div>
        </CardContent>
      </Card>

      {rows.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-text">
                <span className="font-medium text-success">{validRows.length} valid</span>
                {rows.length - validRows.length > 0 && (
                  <span className="ml-2 font-medium text-danger">
                    {rows.length - validRows.length} with errors
                  </span>
                )}{" "}
                out of {rows.length} rows
                {rows.length >= MAX_ROWS && ` (capped at ${MAX_ROWS})`}
              </p>
              <Button disabled={validRows.length === 0 || isGenerating} onClick={handleGenerateZip}>
                {isGenerating
                  ? "Generating…"
                  : `Generate ${validRows.length} QR code${validRows.length === 1 ? "" : "s"} (ZIP)`}
              </Button>
            </div>

            <div className="mt-4">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Row</TableHeaderCell>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.index}>
                      <TableCell>{row.index + 1}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        {row.errors.length === 0 ? (
                          <span className="text-success">Valid</span>
                        ) : (
                          <span className="text-danger">{row.errors.join("; ")}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
