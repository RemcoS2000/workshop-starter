@AGENTS.md

# Workshop starter

Next.js + Prisma + SQLite starter for the Codehive x HomeWizard workshop. Participants extend this with auth, CSV import, and theming.

## Stack

Next.js 16 App Router · TypeScript strict · Tailwind v4 · Prisma 7 · SQLite · BetterAuth (dep only) · Vitest (dep only) · Prettier.

Prisma 7 uses a [prisma.config.ts](prisma.config.ts) for CLI settings (datasource URL, seed) and a driver adapter at runtime - `@prisma/adapter-better-sqlite3` wired up in [src/lib/prisma.ts](src/lib/prisma.ts). The schema's `datasource` block has no `url` (that lives in the config file).

## Models

See [prisma/schema.prisma](prisma/schema.prisma).

- `User` · shape is BetterAuth-compatible so its CLI will extend this table later.
- `MeterReading` · `kind` is "electricity" | "gas" | "water", `unit` is "kWh" | "m3", `value` is cumulative (matches P1 smart-meter output).
- `Product` · HomeWizard-style catalog (P1 Meter, Energy Socket, etc.).

## Scripts

`dev` · `build` · `start` · `lint` · `format` · `test` · `db:seed` · `db:studio` · `db:reset`.

## Conventions

- Server components by default; add `"use client"` only when needed.
- Import the DB client as `import { prisma } from "@/lib/prisma"`.
- Validate API-route input with Zod.
- No em-dashes in code or docs - use `-`, `:`, or `·` instead.

## Workshop tasks (Blok 4)

1. Wire BetterAuth email+password login; protect `/shop`.
2. Build `/upload` that parses `sample-data/meter-readings.csv` and inserts `MeterReading` rows; visualise them on the landing page.
3. Apply HomeWizard branding (navy + cyan, rounded cards, header).

## Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.