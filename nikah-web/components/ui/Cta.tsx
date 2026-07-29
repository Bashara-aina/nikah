/**
 * Pill call-to-action shared by the venue and online invitations.
 *
 * `pending` renders the same pill as inert text — used for livestream channels
 * whose links do not exist yet, so the row keeps its shape instead of
 * collapsing when the couple fills the URLs in later.
 */
import type { ReactNode } from "react";

const BASE =
  "type-button inline-flex min-h-[44px] items-center justify-center rounded-full px-7 py-2.5 transition-transform";

const VARIANTS = {
  solid: "bg-dusty-deep text-paper shadow-petal hover:opacity-90",
  outline: "border border-dusty/40 bg-surface text-ink shadow-petal hover:bg-blush/25",
} as const;

export const Cta = ({
  href,
  children,
  variant = "outline",
  pending = false,
}: {
  href?: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  pending?: boolean;
}) => {
  if (pending || !href) {
    return (
      <button
        type="button"
        disabled
        className={`${BASE} border border-border bg-surface/60 text-ink-soft opacity-70`}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BASE} ${VARIANTS[variant]} active:scale-[0.97]`}
    >
      {children}
    </a>
  );
};
