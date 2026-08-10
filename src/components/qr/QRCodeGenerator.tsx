"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CustomizationPanel } from "@/components/qr/CustomizationPanel";
import { DownloadControls } from "@/components/qr/DownloadControls";
import { DynamicQRForm } from "@/components/qr/forms/DynamicQRForm";
import { PrintView } from "@/components/qr/PrintView";
import { QRPreview } from "@/components/qr/QRPreview";
import { QRTypeSelector } from "@/components/qr/QRTypeSelector";
import { SafetyWarnings } from "@/components/qr/SafetyWarnings";
import { SaveToAccountButton } from "@/components/qr/pro/SaveToAccountButton";
import { Card, CardContent } from "@/components/ui/Card";
import { qrFieldConfig } from "@/data/qr-types/fields";
import { qrTypeMeta } from "@/data/qr-types/meta";
import { siteConfig } from "@/config/site";
import { trackQRGenerated, trackTemplateSelected } from "@/lib/analytics";
import { qrTemplates } from "@/data/templates";
import { buildQRPayload } from "@/lib/qr/encode";
import { defaultQRData, validateQRData } from "@/lib/qr/schemas";
import { evaluateQRSafety } from "@/lib/qr/safety";
import { DEFAULT_CUSTOMIZATION } from "@/types/qr";
import type { QRCodeType, QRCustomization } from "@/types/qr";

interface QRCodeGeneratorProps {
  /** Locks the generator to a single QR type (used on dedicated type pages). */
  lockedType?: QRCodeType;
  className?: string;
}

function hasRequiredFieldsFilled(type: QRCodeType, data: Record<string, unknown>): boolean {
  const fields = qrFieldConfig[type];
  return fields
    .filter((field) => field.required)
    .every((field) => {
      const value = data[field.name];
      return typeof value === "string" && value.trim().length > 0;
    });
}

export function QRCodeGenerator({ lockedType, className }: QRCodeGeneratorProps) {
  const [type, setType] = useState<QRCodeType>(lockedType ?? "url");
  const [dataByType, setDataByType] = useState(defaultQRData);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [customization, setCustomization] = useState<QRCustomization>(DEFAULT_CUSTOMIZATION);

  const currentData = dataByType[type] as unknown as Record<string, unknown>;

  const validation = useMemo(() => validateQRData(type, currentData), [type, currentData]);

  const errors = useMemo(() => {
    if (validation.success) return {};
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (!key || !touched.has(key)) continue;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fieldErrors;
  }, [validation, touched]);

  const payload = useMemo(() => {
    if (!hasRequiredFieldsFilled(type, currentData)) return "";
    try {
      return buildQRPayload(type, currentData as never);
    } catch {
      return "";
    }
  }, [type, currentData]);

  const safetyWarnings = useMemo(
    () => (payload ? evaluateQRSafety(customization, 600) : []),
    [payload, customization],
  );

  const previousPayloadRef = useRef("");
  useEffect(() => {
    if (payload && !previousPayloadRef.current) {
      trackQRGenerated(type);
    }
    previousPayloadRef.current = payload;
  }, [payload, type]);

  // Apply a template preset (?template=id) on first mount, if present and
  // compatible with this page's QR type.
  useEffect(() => {
    const templateId = new URLSearchParams(window.location.search).get("template");
    if (!templateId) return;
    const template = qrTemplates.find((t) => t.id === templateId);
    if (!template) return;
    if (lockedType && template.type !== lockedType) return;
    // Reading the URL's query string is a one-time sync with browser state
    // on mount, not state derived from props/state available during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setType(template.type);
    setCustomization((prev) => ({
      ...prev,
      ...template.customizationPreset,
      label: template.suggestedLabel ?? prev.label,
    }));
    trackTemplateSelected(template.id);
    // Only ever runs once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFieldChange(field: string, value: string | boolean) {
    setTouched((prev) => new Set(prev).add(field));
    setDataByType((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  }

  function handleTypeChange(nextType: QRCodeType) {
    setType(nextType);
    setTouched(new Set());
  }

  function handleReset() {
    setDataByType(defaultQRData);
    setTouched(new Set());
    setCustomization(DEFAULT_CUSTOMIZATION);
  }

  function handlePrint() {
    window.print();
  }

  const meta = qrTypeMeta[type];
  const filenameBase = `${siteConfig.shortName}-${type}`;

  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {!lockedType && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-3 text-sm font-semibold text-text">QR code type</h2>
                <QRTypeSelector value={type} onChange={handleTypeChange} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-1 text-sm font-semibold text-text">{meta.label} details</h2>
              <p className="mb-5 text-xs text-text-muted">{meta.description}</p>
              <DynamicQRForm
                type={type}
                data={currentData}
                errors={errors}
                onChange={handleFieldChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-sm font-semibold text-text">Customize</h2>
              <CustomizationPanel value={customization} onChange={setCustomization} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="pt-6">
              <QRPreview data={payload} customization={customization} />
              <div className="mt-6">
                <SafetyWarnings warnings={safetyWarnings} />
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <DownloadControls
                  data={payload}
                  customization={customization}
                  type={type}
                  filenameBase={filenameBase}
                  onPrint={handlePrint}
                  onReset={handleReset}
                />
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <SaveToAccountButton
                  type={type}
                  data={currentData}
                  customization={customization}
                  disabled={!payload}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PrintView data={payload} customization={customization} title={meta.label} />
    </div>
  );
}
