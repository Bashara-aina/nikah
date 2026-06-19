"use client";

/**
 * Field — underline-style text input/textarea with floating label
 * (SPEC 09 §5). On focus, the underline grows from the middle; label
 * floats up. Error state shakes once and shows a small message.
 */

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  name: string;
  multiline?: boolean;
}

export type FieldProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "name"> &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange" | "name"
  >;

export default function Field({
  label,
  error,
  hint,
  value,
  onChange,
  required,
  name,
  multiline = false,
  ...rest
}: FieldProps) {
  const id = useId();
  const errorId = `${id}-err`;
  const hintId = `${id}-hint`;
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const float = focused || filled;
  const hasError = Boolean(error);

  const describedBy =
    [hasError ? errorId : null, hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const sharedStyle: React.CSSProperties = {
    width: "100%",
    padding: "24px 0 8px",
    fontFamily: "var(--font-sans)",
    fontSize: "1rem",
    color: "var(--ink)",
    background: "transparent",
    border: 0,
    borderBottom: `1px solid ${
      hasError
        ? "var(--dusty)"
        : focused
          ? "var(--sage)"
          : "color-mix(in srgb, var(--sage) 50%, transparent)"
    }`,
    borderRadius: 0,
    outline: "none",
    transition:
      "border-color 200ms ease, padding 200ms ease, background 200ms ease",
    minHeight: 44,
  };

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: float ? 4 : 22,
    fontFamily: "var(--font-sans)",
    fontSize: float ? "0.78rem" : "1rem",
    color: hasError
      ? "var(--dusty)"
      : focused
        ? "var(--ink)"
        : "var(--ink-soft)",
    letterSpacing: float ? "0.06em" : "normal",
    pointerEvents: "none",
    transition:
      "top 200ms cubic-bezier(0.22, 1, 0.36, 1), font-size 200ms ease, color 200ms ease",
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    marginBlock: 12,
  };

  const inputProps = {
    id,
    name,
    value,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    "aria-invalid": hasError || undefined,
    "aria-describedby": describedBy,
    "aria-required": required || undefined,
    style: sharedStyle,
  } as const;

  return (
    <div style={containerStyle}>
      {multiline ? (
        <textarea {...(inputProps as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input {...(inputProps as InputHTMLAttributes<HTMLInputElement>)} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      <label htmlFor={id} style={labelStyle}>
        {label}
        {required ? (
          <span aria-hidden="true" style={{ color: "var(--dusty)" }}>
            {" "}
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p
          id={hintId}
          className="t-small"
          style={{ color: "var(--ink-soft)", margin: "4px 0 0" }}
        >
          {hint}
        </p>
      ) : null}
      {hasError ? (
        <p
          id={errorId}
          role="alert"
          className="t-small"
          style={{
            color: "var(--dusty)",
            margin: "4px 0 0",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export type { FieldProps as FieldComponentProps };
// Avoid unused warning when consumers don't import ReactNode
export type { ReactNode };
