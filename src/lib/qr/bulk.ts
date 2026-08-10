import { qrFieldConfig } from "@/data/qr-types/fields";
import type { QRCodeType } from "@/types/qr";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Column order for a type's CSV template/upload: "name" plus every form field. */
export function csvColumnsForType(type: QRCodeType): string[] {
  return ["name", ...qrFieldConfig[type].map((field) => field.name)];
}

/** A downloadable CSV template with headers and one example row for the given type. */
export function buildCsvTemplate(type: QRCodeType): string {
  const fields = qrFieldConfig[type];
  const columns = csvColumnsForType(type);
  const exampleRow = columns.map((column) => {
    if (column === "name") return "My QR Code";
    const field = fields.find((f) => f.name === column);
    if (!field) return "";
    if (field.type === "checkbox") return "false";
    return field.placeholder ?? "";
  });
  return [columns, exampleRow].map((row) => row.map(csvEscape).join(",")).join("\n");
}

/** Converts a parsed CSV row's raw strings into the shape a QR schema expects. */
export function coerceRowData(type: QRCodeType, raw: Record<string, string>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of qrFieldConfig[type]) {
    const value = (raw[field.name] ?? "").trim();
    data[field.name] = field.type === "checkbox" ? ["true", "1", "yes"].includes(value.toLowerCase()) : value;
  }
  return data;
}
