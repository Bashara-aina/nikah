"use client";

/**
 * Form primitives — float-label input/textarea (plan 05 A.3) and a pill radio
 * group. Tailwind-only styling, ≥44px targets, visible focus (globals.css).
 */
import { useId, type ChangeEvent } from "react";

const fieldBase =
  "peer w-full rounded-2xl border border-border bg-surface px-4 pb-2.5 pt-6 font-sans text-base text-ink shadow-petal outline-none transition-colors focus:border-dusty/60";

const labelBase =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-sans text-base text-muted transition-all " +
  "peer-focus:top-3.5 peer-focus:text-[0.68rem] peer-focus:uppercase peer-focus:tracking-[0.18em] " +
  "peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[0.68rem] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em]";

export const FloatInput = ({
  label,
  value,
  onChange,
  required,
  maxLength,
  name,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  maxLength?: number;
  name: string;
}) => {
  const id = useId();
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={required}
        maxLength={maxLength}
        placeholder=" "
        className={`${fieldBase} min-h-[56px]`}
        autoComplete="name"
      />
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
    </div>
  );
};

export const FloatTextarea = ({
  label,
  value,
  onChange,
  maxLength,
  name,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  name: string;
  rows?: number;
}) => {
  const id = useId();
  return (
    <div className="relative">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder=" "
        rows={rows}
        className={`${fieldBase} resize-none pt-7`}
      />
      <label
        htmlFor={id}
        className={`${labelBase} top-7 peer-focus:top-3.5 peer-[:not(:placeholder-shown)]:top-3.5`}
      >
        {label}
      </label>
    </div>
  );
};

export const PillRadioGroup = <T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: readonly T[];
  value: T | null;
  onChange: (v: T) => void;
  name: string;
}) => (
  <fieldset>
    <legend className="mb-3 font-sans text-[0.68rem] uppercase tracking-[0.18em] text-muted">
      {legend}
    </legend>
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <label
            key={opt}
            className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-5 py-2.5 font-sans text-sm transition-colors ${
              active
                ? "border-dusty bg-blush/35 font-medium text-ink"
                : "border-border bg-surface text-ink/75 hover:bg-cream"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={active}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            {active ? (
              <span aria-hidden className="mr-2 text-dusty">
                ✿
              </span>
            ) : null}
            {opt}
          </label>
        );
      })}
    </div>
  </fieldset>
);

/** Light petal burst on submit success (plan 05 A.4 — no confetti chaos). */
export const PetalBurst = ({ fire }: { fire: boolean }) => {
  if (!fire) return null;
  const petals = Array.from({ length: 8 }, (_, i) => ({
    dx: `${Math.round(Math.cos((i / 8) * Math.PI * 2) * (44 + (i % 3) * 18))}px`,
    dy: `${Math.round(Math.sin((i / 8) * Math.PI * 2) * (34 + (i % 4) * 14)) - 30}px`,
    rot: `${(i % 2 === 0 ? 1 : -1) * (60 + i * 20)}deg`,
    delay: `${i * 30}ms`,
  }));
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute h-2.5 w-2 rounded-full bg-blush"
          style={{
            ["--dx" as string]: p.dx,
            ["--dy" as string]: p.dy,
            ["--rot" as string]: p.rot,
            animation: `petal-burst 900ms ${p.delay} cubic-bezier(0.22, 1, 0.36, 1) forwards`,
          }}
        />
      ))}
    </span>
  );
};
