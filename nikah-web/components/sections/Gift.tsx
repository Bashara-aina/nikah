"use client";

/**
 * Gift — Tanda Kasih (docs/10 §11).
 * Bank Indonesia & Jepang + physical address (ID & JP) + FAQ.
 * Each card is collapsed by default with a "Ketuk untuk melihat" hint and
 * expands on tap. Copy-to-clipboard with aria-live toast confirmation.
 * Empty config state → "coming soon" copy, no copy button, no expand.
 */

import { useState } from "react";
import Image from "next/image";
import { copy } from "@/lib/copy";
import { config, warnTodo } from "@/lib/config";
import { useToast } from "@/lib/toastStore";
import Reveal from "@/components/primitives/Reveal";
import Stagger from "@/components/primitives/Stagger";
import Breathing from "@/components/primitives/Breathing";
import Accordion from "@/components/ui/Accordion";

interface BankProps {
  label: string;
  bank: string;
  number: string;
  holder: string;
  testId: string;
  branchCode?: string;
  branchName?: string;
}

function BankCard({ label, bank, number, holder, testId, branchCode, branchName }: BankProps) {
  const { push } = useToast();
  const [copied, setCopied] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const onCopy = async (): Promise<void> => {
    if (!number) {
      push("info", "Nomor rekening belum tersedia");
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(number);
      } else {
        const ta = document.createElement("textarea");
        ta.value = number;
        ta.setAttribute("aria-hidden", "true");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      push("success", copy.gift.copyDone);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      push("error", "Gagal menyalin");
    }
  };

  const hasAll = bank && number && holder;
  const hasBranch = branchCode || branchName;
  const isInteractive = hasAll;

  return (
    <article
      data-testid={testId}
      style={{
        background: "var(--cream)",
        borderRadius: 18,
        padding: 20,
        boxShadow: "var(--shadow-sm)",
        margin: "12px 0",
        textAlign: "left",
      }}
    >
      <button
        type="button"
        onClick={() => isInteractive && setOpen((o) => !o)}
        aria-expanded={isInteractive ? open : undefined}
        aria-controls={`${testId}-body`}
        aria-label={`${label} — ${
          isInteractive
            ? open
              ? copy.gift.hideHint
              : copy.gift.revealHint
            : "Segera hadir"
        }`}
        style={{
          width: "100%",
          background: "transparent",
          border: 0,
          padding: 0,
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          color: "var(--ink)",
          fontFamily: "var(--font-sans)",
          cursor: isInteractive ? "pointer" : "default",
        }}
      >
        <h3
          className="t-h2"
          style={{ margin: 0, color: "var(--ink)" }}
        >
          {label}
        </h3>
        {isInteractive ? (
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
              color: "var(--ink-soft)",
              fontSize: "0.9rem",
            }}
          >
            ▾
          </span>
        ) : null}
      </button>

      {!isInteractive ? (
        <p
          className="t-small"
          style={{
            color: "var(--ink-soft)",
            margin: "8px 0 0",
          }}
        >
          Segera hadir. Terima kasih sudah menantikan.
        </p>
      ) : (
        <div
          id={`${testId}-body`}
          role="region"
          aria-hidden={!open}
          style={{
            maxHeight: open ? 320 : 0,
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(-6px)",
            transition:
              "max-height 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease, transform 200ms ease",
            overflow: "hidden",
          }}
        >
          <dl
            style={{
              margin: "12px 0 0",
              display: "grid",
              gridTemplateColumns: "auto minmax(0, 1fr)",
              rowGap: 6,
              columnGap: 12,
              color: "var(--ink-soft)",
              fontFamily: "var(--font-sans)",
            }}
          >
            <dt style={{ color: "var(--ink-soft)" }}>Bank</dt>
            <dd style={{ margin: 0, color: "var(--ink)" }}>{bank}</dd>
            <dt style={{ color: "var(--ink-soft)" }}>No. Rekening</dt>
            <dd
              style={{
                margin: 0,
                color: "var(--ink)",
                fontFamily: "ui-monospace, monospace",
                fontVariantNumeric: "tabular-nums",
                wordBreak: "break-all",
              }}
            >
              {number}
            </dd>
            <dt style={{ color: "var(--ink-soft)" }}>a.n.</dt>
            <dd style={{ margin: 0, color: "var(--ink)" }}>{holder}</dd>
            {hasBranch ? (
              <>
                <dt style={{ color: "var(--ink-soft)" }}>Cabang</dt>
                <dd style={{ margin: 0, color: "var(--ink)" }}>
                  {branchName ? `${branchName} (${branchCode ?? "—"})` : branchCode}
                </dd>
              </>
            ) : null}
          </dl>
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                void onCopy();
              }}
              aria-label={`${copy.gift.copyBank} ${label}`}
            >
              {copied ? copy.gift.copyDone : copy.gift.copyBank}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

interface AddressBlockProps {
  regionLabel: string;
  address: string;
  testId: string;
}

function AddressBlock({ regionLabel, address, testId }: AddressBlockProps) {
  const { push } = useToast();
  const [copied, setCopied] = useState<boolean>(false);

  const onCopy = async (): Promise<void> => {
    if (!address) {
      push("info", "Alamat hadiah akan segera hadir");
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        const ta = document.createElement("textarea");
        ta.value = address;
        ta.setAttribute("aria-hidden", "true");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      push("success", copy.gift.copyDone);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      push("error", "Gagal menyalin");
    }
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <h4
        className="t-h2"
        style={{
          margin: "0 0 6px",
          color: "var(--ink)",
          fontFamily: "var(--font-serif)",
          fontSize: "1.05rem",
        }}
      >
        {regionLabel}
      </h4>
      <p
        style={{
          margin: 0,
          color: "var(--ink)",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {address}
      </p>
      <div style={{ marginTop: 8 }}>
        <button
          type="button"
          className="btn-primary"
          onClick={() => void onCopy()}
          aria-label={`${copy.gift.copyBank} ${regionLabel}`}
          data-testid={`${testId}-copy`}
        >
          {copied ? copy.gift.copyDone : copy.gift.copyBank}
        </button>
      </div>
    </div>
  );
}

export default function Gift() {
  warnTodo("config.gift.banks[0]", config.gift.banks[0].number);
  warnTodo("config.gift.banks[1]", config.gift.banks[1].number);
  warnTodo("config.gift.address.id", config.gift.address.id);
  warnTodo("config.gift.address.jp", config.gift.address.jp);

  const [addrOpen, setAddrOpen] = useState<boolean>(false);
  const hasAnyAddress =
    config.gift.address.id.trim().length > 0 ||
    config.gift.address.jp.trim().length > 0;
  const isAddressInteractive = hasAnyAddress;

  return (
    <section
      id="gift"
      className="section cv-auto"
      aria-label="Tanda kasih"
    >
      <div className="container-narrow" style={{ textAlign: "center" }}>
        <Reveal>
          <Breathing seed="gift-accent" as="div">
            <Image
              src="/assets/scene/gift-accent.png"
              alt="Aksen lembut untuk bagian tanda kasih"
              width={220}
              height={140}
              loading="lazy"
              style={{ width: "min(100%, 220px)", height: "auto", margin: "0 auto" }}
            />
          </Breathing>
        </Reveal>

        <Reveal
          as="h2"
          className="t-h1"
          seed="gift-title"
          style={{ color: "var(--ink)", marginTop: 16 }}
        >
          {copy.gift.title}
        </Reveal>

        <p
          className="t-body"
          style={{ color: "var(--ink-soft)", margin: "8px 0 24px" }}
        >
          {copy.gift.body}
        </p>

        <Stagger as="div" gap={0.08} seed="gift-cards">
          <BankCard
            label={copy.gift.section.bankId}
            bank={config.gift.banks[0].bank}
            number={config.gift.banks[0].number}
            holder={config.gift.banks[0].holder}
            testId="gift-bank-id"
          />
          <BankCard
            label={copy.gift.section.bankJp}
            bank={config.gift.banks[1].bank}
            number={config.gift.banks[1].number}
            holder={config.gift.banks[1].holder}
            testId="gift-bank-jp"
            branchCode={config.gift.banks[1].branchCode}
            branchName={config.gift.banks[1].branchName}
          />

          <article
            style={{
              background: "var(--cream)",
              borderRadius: 18,
              padding: 20,
              boxShadow: "var(--shadow-sm)",
              margin: "12px 0",
              textAlign: "left",
            }}
          >
            <button
              type="button"
              onClick={() =>
                isAddressInteractive && setAddrOpen((o) => !o)
              }
              aria-expanded={isAddressInteractive ? addrOpen : undefined}
              aria-controls="gift-address-body"
              aria-label={`${copy.gift.section.address} — ${
                isAddressInteractive
                  ? addrOpen
                    ? copy.gift.hideHint
                    : copy.gift.revealHint
                  : "Segera hadir"
              }`}
              style={{
                width: "100%",
                background: "transparent",
                border: 0,
                padding: 0,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
                cursor: isAddressInteractive ? "pointer" : "default",
              }}
            >
              <h3
                className="t-h2"
                style={{ margin: 0, color: "var(--ink)" }}
              >
                {copy.gift.section.address}
              </h3>
              {isAddressInteractive ? (
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    transform: addrOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition:
                      "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
                    color: "var(--ink-soft)",
                    fontSize: "0.9rem",
                  }}
                >
                  ▾
                </span>
              ) : null}
            </button>

            {!isAddressInteractive ? (
              <p
                className="t-small"
                style={{
                  color: "var(--ink-soft)",
                  margin: "8px 0 0",
                }}
              >
                Segera hadir. Terima kasih sudah menantikan.
              </p>
            ) : (
              <div
                id="gift-address-body"
                role="region"
                aria-hidden={!addrOpen}
                style={{
                  maxHeight: addrOpen ? 600 : 0,
                  opacity: addrOpen ? 1 : 0,
                  transform: addrOpen ? "translateY(0)" : "translateY(-6px)",
                  transition:
                    "max-height 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease, transform 200ms ease",
                  overflow: "hidden",
                }}
              >
                <div style={{ marginTop: 12 }}>
                  {config.gift.address.id.trim().length > 0 ? (
                    <AddressBlock
                      regionLabel={copy.gift.section.addressId}
                      address={config.gift.address.id}
                      testId="gift-address-id"
                    />
                  ) : null}
                  {config.gift.address.jp.trim().length > 0 ? (
                    <AddressBlock
                      regionLabel={copy.gift.section.addressJp}
                      address={config.gift.address.jp}
                      testId="gift-address-jp"
                    />
                  ) : null}
                </div>
              </div>
            )}
          </article>
        </Stagger>

        <div style={{ marginTop: 24, textAlign: "left" }}>
          <h3
            className="t-h2"
            style={{ margin: "0 0 12px", color: "var(--ink)", textAlign: "center" }}
          >
            {copy.gift.section.faq}
          </h3>
          <Accordion
            items={copy.gift.faq.map((f, i) => ({
              id: `faq-${i}`,
              q: f.q,
              a: f.a,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
