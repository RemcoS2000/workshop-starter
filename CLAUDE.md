@AGENTS.md

# Workshop starter

Next.js + Prisma + SQLite starter for the Codehive x HomeWizard workshop. Participants extend this with auth, CSV import, and theming.

## Stack

Next.js 16 App Router · TypeScript strict · Tailwind v4 · Prisma 7 · SQLite · BetterAuth (dep only) · Vitest (dep only) · Prettier.

Prisma 7 uses a [prisma.config.ts](prisma.config.ts) for CLI settings (datasource URL, seed) and a driver adapter at runtime - `@prisma/adapter-better-sqlite3` wired up in [src/lib/prisma.ts](src/lib/prisma.ts). The schema's `datasource` block has no `url` (that lives in the config file).

## Sharp edges

- Next.js 16 has breaking changes vs older examples. Verify framework-specific patterns against `node_modules/next/dist/docs/` before changing app code.
- Prefer server components by default. Add `"use client"` only when browser APIs, local state, or event handlers require it.
- Prisma CLI config lives in [prisma.config.ts](prisma.config.ts). Do not add a datasource `url` to [prisma/schema.prisma](prisma/schema.prisma).

## Models

See [prisma/schema.prisma](prisma/schema.prisma).

- `User` · shape is BetterAuth-compatible so its CLI will extend this table later.
- `MeterReading` · `kind` is "electricity" | "gas" | "water", `unit` is "kWh" | "m3", `value` is cumulative (matches P1 smart-meter output).
- `Product` · HomeWizard-style catalog (P1 Meter, Energy Socket, etc.).

## Scripts

`dev` · `build` · `start` · `lint` · `format` · `test` · `db:seed` · `db:studio` · `db:reset`.

## Conventions

- Import the DB client as `import { prisma } from "@/lib/prisma"`.
- Validate API-route input with Zod.
- Keep changes surgical. Do not refactor adjacent code unless the task requires it.
- Verify with the smallest relevant check before finishing: targeted test, `npm run build`, `npm run lint`, or a direct route/manual check.
- No em-dashes in code or docs - use `-`, `:`, or `·` instead.

## Workshop tasks (Blok 4)

1. Wire BetterAuth email+password login; protect `/shop`.
2. Build `/upload` that parses `sample-data/meter-readings.csv` and inserts `MeterReading` rows; visualise them on the landing page.
3. Apply HomeWizard branding (navy + cyan, rounded cards, header).
