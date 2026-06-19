"use client";

/**
 * Lightweight toast store — one global subscription. Used by interactive
 * sections (RSVP/Wishes/Gift) to surface copy/success/error states.
 * aria-live="polite" so screen readers announce.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastKind = "success" | "info" | "error";

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastCtx {
  push: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastCtx>({ push: () => undefined });

export function useToast(): ToastCtx {
  return useContext(ToastContext);
}

const AUTO_HIDE_MS = 2500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = useCallback((kind: ToastKind, message: string) => {
    idRef.current += 1;
    const id = idRef.current;
    setToasts((prev) => [...prev, { id, kind, message }]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return undefined;
    const timers = toasts.map((t) =>
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, AUTO_HIDE_MS),
    );
    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, [toasts]);

  const value = useMemo<ToastCtx>(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          left: "50%",
          bottom: 24,
          transform: "translateX(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              background:
                t.kind === "error"
                  ? "color-mix(in srgb, var(--dusty) 95%, black)"
                  : "color-mix(in srgb, var(--ink) 90%, transparent)",
              color: "var(--ivory)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              boxShadow: "var(--shadow-md)",
              opacity: 0.96,
              maxWidth: "min(90vw, 360px)",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
