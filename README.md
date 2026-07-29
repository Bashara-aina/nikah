# nikah

Monorepo for the **Bashara & Hanifah** wedding invitation (22 Aug 2026).

> **Reorg note (2026-07-18):** the live app folder was renamed `asset/` → `nikah-web/`
> to match its package name and remove ambiguity. If you deploy on Vercel, update the
> project **Root Directory** setting from `asset` to `nikah-web` (see _Human follow-ups_).

## Top-level layout

| Path | What it is |
|------|------------|
| `nikah-web/` | **The live Next.js app** (Next 16 App Router + React 19, TypeScript strict, Tailwind v4, Motion + GSAP + Lenis). Package name `nikah-web`. All app code, config, and its own `README.md` / `AGENTS.md` live here. Run every `npm` script from inside this folder. |
| `relevant/` | **Planning + curated asset-source hub.** Holds `plans/`, `INDEX.md`, `FABLE-5-ULTIMATE-BUILD-PROMPT.md`, `10-docs/` (historical docs), and the numbered slice folders `01-…`–`09-…` with per-slice `manifest.md` files. These curated source assets are the upstream of the app's asset pipeline. Keep at repo root. |
| `README.md` | This file. |

There is currently **no top-level clutter** (no `generated/`, `stitch/`, `Recovered/`,
`assets/`, `assets regenerate/`, `archieved/`, or loose `output*.mp4`) and therefore no
`_archive/` folder was created. If superseded material appears later, archive it under
`_archive/<original-name>/` (never deleted, never consumed by the app or `relevant/`).

## Asset pipeline

The app's assets flow one direction — never hand-edit a downstream copy:

```
relevant/01-…09-…  ──(promote via npm run remediate-assets)──▶  nikah-web/assets/
                                                                       │
                                                    (mirror via npm run copy-assets,
                                                     auto on predev / prebuild)
                                                                       ▼
                                                              nikah-web/public/assets/
```

- **Curated sources:** `relevant/01-…`–`09-…` (verified keepers + `manifest.md` per slice).
- **App source of truth:** `nikah-web/assets/` — promoted/compressed from `relevant/` by
  `nikah-web/scripts/remediate-assets.mjs`.
- **Generated mirror:** `nikah-web/public/assets/` — regenerated from `nikah-web/assets/`
  by `nikah-web/scripts/copy-assets.mjs` (runs on `predev` / `prebuild`). **Never edit by hand.**

> Note: the pipeline source of truth currently lives **inside the app** at
> `nikah-web/assets/`, not at a repo-root `assets/`. The `.cursor/rules/*.mdc`
> (`project-structure.mdc`, `sharp-asset-conventions.mdc`) describe an aspirational
> root-level `assets/` layout that does not match the current tree — treat the code
> (`scripts/copy-assets.mjs`, `remediate-assets.mjs`) as authoritative.

## Getting started

```bash
cd nikah-web
npm install
npm run dev          # http://localhost:3000
```

Quality gates (run from `nikah-web/`):

```bash
npm run type-check   # tsc --noEmit
npm run lint         # eslint . --ext .ts,.tsx
npm test             # Vitest pure-function suite
npm run build        # next build
```

See `nikah-web/README.md` and `nikah-web/AGENTS.md` for app-specific rules, and
`relevant/plans/HUMAN-HANDOFF.md` for the launch checklist.

## Human follow-ups

- **Vercel:** change the project **Root Directory** from `asset` to `nikah-web`.
- **Secrets:** `nikah-web/.env` (git-ignored) holds `FAL_KEY` for scripts plus `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `DASHBOARD_PASSPHRASE`, and `NEXT_PUBLIC_SITE_URL` for the app. Provision them per environment.
