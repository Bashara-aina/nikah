"use client";

/**
 * Overlay and feedback primitives for the dashboard.
 *
 * The dashboard is the one part of the site that is a tool rather than a story,
 * so it needs the plain affordances the invitation avoids: a dialog that traps
 * Escape and focus, a confirm step that names what it is about to delete, and a
 * toast that reaches the couple's eye even when the button they pressed sits at
 * guest number 150. Labels, chips, and `inputClass` live in `dashboardShared`.
 */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLenisControl } from "@/components/motion/Lenis";

/* ---------------------------------------------------------------- toasts -- */

export type Toast = { id: number; message: string; tone: "ok" | "bad" };

let toastSeq = 0;

/**
 * A banner pinned under the page header is invisible when the action that
 * raised it happened three screens down. Toasts sit above the fold of the
 * thumb instead, and errors linger twice as long as confirmations.
 */
export const useToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: Toast["tone"] = "ok") => {
      const id = ++toastSeq;
      setToasts((list) => [...list.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), tone === "bad" ? 6000 : 2800);
    },
    [dismiss],
  );

  return { toasts, push, dismiss };
};

export const ToastHost = ({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) => (
  <div
    aria-live="polite"
    className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4"
  >
    {toasts.map((toast) => (
      <button
        key={toast.id}
        type="button"
        onClick={() => onDismiss(toast.id)}
        className={`pointer-events-auto max-w-md rounded-2xl px-5 py-3 text-left font-sans text-sm shadow-float ${
          toast.tone === "bad" ? "bg-alert text-paper" : "bg-ink text-paper"
        }`}
      >
        {toast.message}
      </button>
    ))}
  </div>
);

/* ---------------------------------------------------------------- dialog -- */

/** Escape closes the topmost overlay — the behaviour every dialog is expected to have. */
export const useEscape = (active: boolean, onEscape: () => void) => {
  useEffect(() => {
    if (!active) return;
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [active, onEscape]);
};

/**
 * A sheet on phones, a centred panel above that. The couple fills this in from
 * a phone while looking at the list behind it, so the close control sits where
 * a thumb reaches and the save buttons stay pinned instead of scrolling away.
 */
export const Modal = ({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) => {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const { stop: stopLenis, start: startLenis } = useLenisControl();

  useEscape(true, onClose);

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null;
    panel.current
      ?.querySelector<HTMLElement>("input, select, textarea, button, a[href]")
      ?.focus();

    // Lenis owns wheel/touch even when body overflow is hidden — pause it so
    // the sheet's overflow-y-auto receives the gesture instead of the page.
    stopLenis();
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousHtml;
      startLenis();
      opener.current?.focus?.();
    };
  }, [stopLenis, startLenis]);

  // Without a trap, Tab walks the focus ring onto the guest list behind the
  // scrim, where every click is swallowed by the overlay.
  const trap = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab" || !panel.current) return;
    const items = [
      ...panel.current.querySelectorAll<HTMLElement>(
        'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((item) => !item.hasAttribute("disabled"));
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Tutup"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={trap}
        data-lenis-prevent
        className="relative flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-border bg-paper shadow-float sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h2 id={titleId} className="type-name">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="type-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>
        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overscroll-contain overflow-y-auto px-5 py-5"
        >
          {children}
        </div>
        {footer ? (
          <div className="border-t border-border bg-surface/80 px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Replaces `window.confirm`, which on a phone reads as a browser malfunction
 * and cannot show which guest is about to go.
 */
export const ConfirmDialog = ({
  title,
  body,
  confirmLabel,
  busyLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: ReactNode;
  confirmLabel: string;
  busyLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Modal
    title={title}
    onClose={onCancel}
    footer={
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="type-button min-h-[48px] flex-1 rounded-full border border-border px-6"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="type-button min-h-[48px] flex-1 rounded-full bg-alert px-6 text-paper disabled:opacity-70"
        >
          {busy ? busyLabel : confirmLabel}
        </button>
      </div>
    }
  >
    <p className="type-body">{body}</p>
  </Modal>
);

/* ------------------------------------------------------------------ menu -- */

/**
 * A dropdown that closes on outside click and on Escape — the two things a bare
 * `<details>` will not do, and whose absence leaves a panel hanging open over
 * the list until it is clicked a second time.
 */
export const Menu = ({
  label,
  children,
}: {
  label: ReactNode;
  children: (close: () => void) => ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEscape(open, close);

  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, close]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="type-button flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface px-4"
      >
        {label}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 flex min-w-48 flex-col gap-1 rounded-2xl border border-border bg-paper p-2 shadow-float"
        >
          {children(close)}
        </div>
      ) : null}
    </div>
  );
};

export const MenuItem = ({
  onClick,
  href,
  children,
}: {
  onClick?: () => void;
  href?: string;
  children: ReactNode;
}) => {
  const className =
    "type-button inline-flex min-h-[44px] w-full items-center rounded-xl px-3 text-left hover:bg-blush/25";
  return href ? (
    <a role="menuitem" href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <button role="menuitem" type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};
