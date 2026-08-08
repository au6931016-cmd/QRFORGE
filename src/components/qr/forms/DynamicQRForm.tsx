"use client";

import { qrFieldConfig } from "@/data/qr-types/fields";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { QRCodeType } from "@/types/qr";

interface DynamicQRFormProps {
  type: QRCodeType;
  data: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (field: string, value: string | boolean) => void;
}

export function DynamicQRForm({ type, data, errors, onChange }: DynamicQRFormProps) {
  const fields = qrFieldConfig[type];

  return (
    <div>
      {fields
        .filter((field) => !field.showIf || field.showIf(data))
        .map((field) => {
          const value = data[field.name];
          const error = errors[field.name];

          if (field.type === "checkbox") {
            return (
              <div key={field.name} className="mb-4 flex items-center gap-2">
                <Checkbox
                  id={field.name}
                  checked={Boolean(value)}
                  onChange={(e) => onChange(field.name, e.target.checked)}
                />
                <Label htmlFor={field.name} className="mb-0">
                  {field.label}
                </Label>
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <FormField key={field.name} label={field.label} error={error} required={field.required}>
                {(a11y) => (
                  <Select
                    {...a11y}
                    value={String(value ?? "")}
                    onChange={(e) => onChange(field.name, e.target.value)}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
            );
          }

          if (field.type === "textarea") {
            return (
              <FormField
                key={field.name}
                label={field.label}
                error={error}
                hint={field.hint}
                required={field.required}
              >
                {(a11y) => (
                  <Textarea
                    {...a11y}
                    value={String(value ?? "")}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    invalid={Boolean(error)}
                    onChange={(e) => onChange(field.name, e.target.value)}
                  />
                )}
              </FormField>
            );
          }

          return (
            <FormField
              key={field.name}
              label={field.label}
              error={error}
              hint={field.hint}
              required={field.required}
            >
              {(a11y) => (
                <Input
                  {...a11y}
                  type={field.type}
                  value={String(value ?? "")}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  invalid={Boolean(error)}
                  onChange={(e) => onChange(field.name, e.target.value)}
                />
              )}
            </FormField>
          );
        })}
    </div>
  );
}
