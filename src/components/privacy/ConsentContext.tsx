"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface ConsentState {
  analytics: boolean;
  advertising: boolean;
  decided: boolean;
}

interface ConsentContextValue extends ConsentState {
  acceptAll: () => void;
  rejectAll: () => void;
  setConsent: (next: Partial<Omit<ConsentState, "decided">>) => void;
}

const STORAGE_KEY = "qrforge-consent";

const defaultState: ConsentState = {
  analytics: false,
  advertising: false,
  decided: false,
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readStoredConsent(): ConsentState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
      decided: Boolean(parsed.decided),
    };
  } catch {
    return defaultState;
  }
}

/**
 * Consent-management abstraction. This does not itself load any
 * tracking/advertising technology — it only tracks user choice so the
 * (currently inert) analytics and ads layers can check it before loading
 * anything. Swap in a compliant CMP later by replacing this provider's
 * internals; consumers of `useConsent()` shouldn't need to change.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConsentState>(defaultState);

  useEffect(() => {
    // Must run post-hydration: localStorage is only readable on the
    // client, and reading it during render would produce a value that
    // mismatches the server-rendered HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(readStoredConsent());
  }, []);

  const persist = useCallback((next: ConsentState) => {
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures (e.g. private browsing) — consent still
      // applies for the current session via React state.
    }
  }, []);

  const acceptAll = useCallback(() => {
    persist({ analytics: true, advertising: true, decided: true });
  }, [persist]);

  const rejectAll = useCallback(() => {
    persist({ analytics: false, advertising: false, decided: true });
  }, [persist]);

  const setConsent = useCallback(
    (next: Partial<Omit<ConsentState, "decided">>) => {
      persist({ ...state, ...next, decided: true });
    },
    [persist, state],
  );

  const value = useMemo(
    () => ({ ...state, acceptAll, rejectAll, setConsent }),
    [state, acceptAll, rejectAll, setConsent],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within a ConsentProvider");
  return ctx;
}
