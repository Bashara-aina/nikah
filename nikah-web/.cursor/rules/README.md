# Cursor Rules — nikah-web

App-scoped Cursor rules, adapted from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) and tuned for this project's stack (Next.js 16, React 19, TypeScript, Tailwind v4, GSAP, Zod 4).

> **Note on upstream.** `awesome-cursorrules` is a curated list of `.mdc` files for many stacks. We do **not** install it wholesale — most rules target older Next.js (13–15), Pages Router, or unrelated stacks (Solidity, Vue, Flutter, etc.). Each rule below cites the upstream source it was adapted from.

## How this directory is organized

- **Monorepo-wide rules** live at [`../../.cursor/rules/`](../../.cursor/rules/) (`agent-docs.mdc`, `project-structure.mdc`, `clean-code.mdc`) and apply across all packages.
- **App-scoped rules** (this directory) override or specialize for `nikah-web/`.
- **Hard project rules** live in [`AGENTS.md`](../../AGENTS.md) (e.g., "This is NOT the Next.js you know — read `node_modules/next/dist/docs/`").
- Per `agent-docs.mdc`: never duplicate content from `AGENTS.md` / `CLAUDE.md` into `.mdc` files — link to them instead.

## Installed rules

| File | alwaysApply | Globs | Adapted from | Purpose |
|------|:---:|------|---------------|---------|
| `nextjs-stack.mdc` | ✅ | `**/*.ts(x)`, `**/*.mts` | `typescript-zod-tailwind-nextjs` + `nextjs15-react19-vercelai-tailwind` + `nextjs` | Next.js 16 + React 19 + TS style, async runtime APIs, `useActionState`, RSC, naming, forms, file order, data fetching, routing, URL state |
| `stack.mdc` | ✅ | `**/*.ts(x)` | project-specific | Pinned versions, Zod 4 / Tailwind 4 / Next 16 / React 19 gotchas, `@/*` path alias |
| `typescript-quality.mdc` | ✅ | `**/*.ts(x)` | upstream TS quality rules | No `any`, no `var`, explicit returns, interfaces for shapes, Zod 4 runtime validation, error handling, naming, minimal-change discipline |
| `styling-and-ui.mdc` | – | `**/*.tsx`, `**/*.css`, `**/*.ts` | `typescript-zod-tailwind-nextjs` | Tailwind v4 + shadcn/ui, mobile-first, `cn()`, no inline styles, a11y |
| `api-and-server.mdc` | – | `**/api/**/*.ts`, `**/route.ts(x)`, `**/actions.ts` | `typescript-zod-tailwind-nextjs` + `nextjs-typescript` + `javascript-typescript-code-quality` | API response shape, status codes, Zod validation, layered architecture, rate limiting, logging |
| `security.mdc` | ✅ | `**/*.ts(x)`, `app/api/**/*.ts` | project-specific | Secrets/env, no secrets in code, sanitize user input, rate limiting, CORS, file uploads, PII logging |

> **AlwaysApply rules** are attached to every request; **glob-scoped rules** attach when the active file matches their globs. This gives a layered set: universal guidance (`stack`, `typescript-quality`, `security`) + context-specific guidance (`api-and-server` for routes, `styling-and-ui` for components).

## Upstream rules considered and not added (with reasons)

- `clean-code.mdc` — already covered by monorepo-wide `../../.cursor/rules/clean-code.mdc`
- `nextjs-app-router.mdc` — too thin, references `.js` not `.ts`, superseded by `nextjs-stack.mdc`
- `typescript-zod-tailwind-nextjs.mdc` — base material for our `nextjs-stack.mdc` and `styling-and-ui.mdc`; installed in adapted form only
- `nextjs-tailwind-typescript-apps.mdc` — heavy Supabase/LangChain focus, not this stack
- `tailwind-css-nextjs-guide.mdc` — requires DaisyUI which we don't use
- `nextjs-react-typescript.mdc` — content is Solidity/Web3, not relevant
- `anti-overengineering.mdc`, `anti-sycophancy-code-discipline.mdc`, `cursor-rules-pack-v2.mdc`, `typescript-code-quality.mdc` — overlap with our existing rules; not added to avoid duplication
- `nextjs15-react19-vercelai-tailwind.mdc` — useful source but its `vercelai` / Nuqs / Zustand specifics do not match this project's current deps; key React-19 / Next-15 patterns folded into `nextjs-stack.mdc`
- `javascript-typescript-code-quality.mdc` — content merged into `typescript-quality.mdc` (Zod 4, error handling, naming) and `api-and-server.mdc` (API hygiene)

## Maintenance

To refresh from upstream:
```bash
cd /tmp && rm -rf awesome-cursorrules && git clone --depth 1 https://github.com/PatrickJS/awesome-cursorrules.git
# Vet new candidates against stack pins in stack.mdc and existing rules before adding.
# Update this README when files are added/removed.
```
