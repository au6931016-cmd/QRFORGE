"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { QRCodeRow } from "@/types/database";

export type RealtimeQrCodeEvent =
  | { eventType: "INSERT"; new: QRCodeRow }
  | { eventType: "UPDATE"; new: QRCodeRow; old?: QRCodeRow }
  | { eventType: "DELETE"; old: QRCodeRow };

export function applyRealtimeQrCodeChange(
  rows: QRCodeRow[],
  event: RealtimeQrCodeEvent,
): QRCodeRow[] {
  if (event.eventType === "INSERT") {
    return rows.some((row) => row.id === event.new.id)
      ? rows.map((row) => (row.id === event.new.id ? event.new : row))
      : [...rows, event.new];
  }

  if (event.eventType === "UPDATE") {
    return rows.map((row) => (row.id === event.new.id ? event.new : row));
  }

  return rows.filter((row) => row.id !== event.old.id);
}

export function useRealtimeQrCodes(initialQrCodes: QRCodeRow[], userId?: string) {
  const [qrCodes, setQrCodes] = useState(initialQrCodes);
  // Resets local state when the server hands us a fresh `initialQrCodes`
  // array (e.g. client-side navigation to the same route). Adjusting state
  // during render — rather than in an effect — avoids an extra commit.
  const [syncedInitial, setSyncedInitial] = useState(initialQrCodes);
  if (initialQrCodes !== syncedInitial) {
    setSyncedInitial(initialQrCodes);
    setQrCodes(initialQrCodes);
  }

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`qr-codes-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "qr_codes",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const typedPayload = payload as unknown as {
            eventType: "INSERT" | "UPDATE" | "DELETE";
            new?: QRCodeRow;
            old?: QRCodeRow;
          };

          if (typedPayload.eventType === "INSERT" && typedPayload.new) {
            setQrCodes((prev) => applyRealtimeQrCodeChange(prev, { eventType: "INSERT", new: typedPayload.new! }));
            return;
          }

          if (typedPayload.eventType === "UPDATE" && typedPayload.new) {
            setQrCodes((prev) =>
              applyRealtimeQrCodeChange(prev, {
                eventType: "UPDATE",
                new: typedPayload.new!,
                old: typedPayload.old,
              }),
            );
            return;
          }

          if (typedPayload.eventType === "DELETE" && typedPayload.old) {
            setQrCodes((prev) => applyRealtimeQrCodeChange(prev, { eventType: "DELETE", old: typedPayload.old! }));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return qrCodes;
}
