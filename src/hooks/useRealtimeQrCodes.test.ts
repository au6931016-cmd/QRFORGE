import { describe, expect, it } from "vitest";
import { applyRealtimeQrCodeChange } from "./useRealtimeQrCodes";
import type { QRCodeRow } from "@/types/database";

function makeRow(overrides: Partial<QRCodeRow>): QRCodeRow {
  return {
    id: "a",
    user_id: "u1",
    name: "Row",
    type: "url",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    form_data: {},
    customization: {} as QRCodeRow["customization"],
    is_dynamic: false,
    is_favorite: false,
    short_code: null,
    destination_url: null,
    enabled: true,
    ...overrides,
  };
}

describe("applyRealtimeQrCodeChange", () => {
  it("adds a new row and updates an existing row in place", () => {
    const rows = [
      makeRow({ id: "a", name: "Old", created_at: "2024-01-01T00:00:00.000Z" }),
      makeRow({ id: "b", name: "Keep", created_at: "2024-01-02T00:00:00.000Z" }),
    ];

    const nextRows = applyRealtimeQrCodeChange(rows, {
      eventType: "INSERT",
      new: makeRow({ id: "c", name: "New", created_at: "2024-01-03T00:00:00.000Z" }),
    });

    expect(nextRows.map((row) => row.id)).toEqual(["a", "b", "c"]);

    const updatedRows = applyRealtimeQrCodeChange(nextRows, {
      eventType: "UPDATE",
      new: makeRow({ id: "a", name: "Updated", updated_at: "2024-01-04T00:00:00.000Z" }),
    });

    expect(updatedRows.find((row) => row.id === "a")?.name).toBe("Updated");
  });

  it("removes a row when the event is delete", () => {
    const rows = [
      makeRow({ id: "a", name: "Alpha" }),
      makeRow({ id: "b", name: "Bravo", created_at: "2024-01-02T00:00:00.000Z" }),
    ];

    const nextRows = applyRealtimeQrCodeChange(rows, {
      eventType: "DELETE",
      old: makeRow({ id: "a", name: "Alpha" }),
    });

    expect(nextRows.map((row) => row.id)).toEqual(["b"]);
  });
});
