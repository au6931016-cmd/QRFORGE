"use client";

import { useEffect, useRef, useState } from "react";
import type { Options } from "qr-code-styling";
import type QRCodeStylingType from "qr-code-styling";

/**
 * Manages a live qr-code-styling preview instance mounted into a DOM
 * container. The library is dynamically imported so it never executes
 * during server rendering (it draws to a canvas/SVG, which requires a
 * browser).
 *
 * The instance is constructed once, with whatever `options` were current
 * at mount time; the moment it's ready, the options-sync effect below
 * immediately calls `update()` with the latest options, so a stale
 * first-render value never lingers on screen.
 */
export function useQRCodeStyling(options: Partial<Options>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<QRCodeStylingType | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled) return;
      const instance = new QRCodeStyling(options);
      instanceRef.current = instance;
      if (containerRef.current) {
        instance.append(containerRef.current);
      }
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
    // Intentionally runs once on mount; subsequent option changes are
    // applied via `update()` in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (instanceRef.current && ready) {
      instanceRef.current.update(options);
    }
  }, [options, ready]);

  return { containerRef, instanceRef, ready };
}
