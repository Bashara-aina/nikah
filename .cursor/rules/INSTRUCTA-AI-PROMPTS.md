# Installed prompts from `instructa/ai-prompts`

Source: https://github.com/instructa/ai-prompts (MIT, Kevin Kern)
Upstream commit: shallow clone of `main`
Installed on: 2026-06-20

## Why only these three?

The repo contains 96+ prompt folders. Most target libraries this project does **not** use (Stripe, Supabase, Auth0, Clerk, Firebase, Prisma, Drizzle, Appwrite, Better Auth, Neon, Laravel, Astro, Nuxt, Svelte, Vue, Remix, Flutter, Angular, etc.). Installing the full catalog would bloat `.cursor/rules/` and slow the agent with irrelevant guidance.

This project is **Next.js 16 + React 19 + Tailwind v4 + GSAP/Lenis + Zod**, a single-page wedding invitation with hand-rolled UI primitives. Only the three prompts below are directly applicable.

## Installed rule files

| File | Upstream prompt | Why it applies |
| --- | --- | --- |
| `instructa-nextjs.mdc` | `prompts/next-15/rule-next-coding-standards.md` | App Router conventions (Server Components, `generateMetadata`, Server Actions, route handlers) apply unchanged from Next 13+ through Next 16. The `Next.js 15` label is a naming artifact; the rules are framework-version-agnostic. |
| `instructa-react-19.mdc` | `prompts/react-19/rule-react-19.md` (core) | Project pins `react@19.2.4`. Covers RSC boundary discipline, `useOptimistic`/`useActionState`, ref-as-prop, metadata APIs. |
| `instructa-tailwind-4.mdc` | `prompts/tailwind-4/rule-tailwind-v4-ext.md` | Project pins `tailwindcss@^4`. Covers `@theme`, `oklch`, `@container`, `@utility`, Oxide engine — all v4-only. |

## What I deliberately did **not** install

| Upstream file | Reason skipped |
| --- | --- |
| `prompts/next-15/add-feature-next.md` | Generic feature-addition playbook with code samples. Project has stage-specific runbooks in `docs/build/`. Risk of contradicting project-specific choreography (GSAP/Lenis, hand-rolled UI). |
| `prompts/react-19/add-feature-react.md` | Same as above; redundant with stage runbooks. |
| `prompts/react-19/rule-react-19-ext.md` and `rule-react-19-min.md` | Core version was the most balanced. The `ext` version includes a PropTypes clause that conflicts with the project's `no PropTypes with TypeScript` stance. The `min` version drops useful guidance. |
| `prompts/tailwind-4/rule-tailwind-v4.md` (core) | Subsumed by the extended version. |
| `prompts/tailwind-4/setup-tailwind-v4-uni.md` | Vite-only setup guide. Project uses Next.js, not Vite. |
| All other 90+ prompt folders | Project does not use the underlying library (Stripe, Supabase, Auth0, Clerk, Firebase, Prisma, Drizzle, etc.). |

## How rules compose with existing project rules

- Local (`.cursor/rules/`): `agent-docs.mdc`, `clean-code.mdc`, `project-structure.mdc`, `workflow.mdc` + the three Instructa rules above.
- Global (`~/.cursor/rules/`): 12 always-applied standards (TypeScript, quality gates, MCP, plan mode, etc.).

Local rules win over global rules in case of conflict (per Cursor's rule precedence). The Instructa rules fill the framework-convention gap; the local rules win on project-specific decisions (hand-rolled UI, GSAP/Lenis, file naming, asset pipeline, `?to=` guest personalization).

## Updating the upstream

The rules below are verbatim from the upstream repo, with only the frontmatter `description` adjusted to call out the project context. To refresh:

```bash
# Inside nikah/, replace these three files with newer versions from
# https://github.com/instructa/ai-prompts/tree/main/prompts
# - .cursor/rules/instructa-nextjs.mdc        ← from prompts/next-15/rule-next-coding-standards.md
# - .cursor/rules/instructa-react-19.mdc      ← from prompts/react-19/rule-react-19.md
# - .cursor/rules/instructa-tailwind-4.mdc    ← from prompts/tailwind-4/rule-tailwind-v4-ext.md
```

Re-run the validation steps in the install log (frontmatter check, `npm run type-check`, `npm run lint`) after any upstream sync.

## Attribution

```
Instructa AI Prompts
https://github.com/instructa/ai-prompts
MIT License — Copyright (c) Kevin Kern (@regenrek)
```
