# Claude Code workshop starter

A minimal Next.js codebase for the Codehive x HomeWizard workshop. Clone, install, and extend with Claude Code.

## What is in the box

- **Next.js 16** · App Router, TypeScript strict, Tailwind v4
- **Prisma 7 + SQLite** · local database at `prisma/dev.db`, wired via `@prisma/adapter-better-sqlite3`
- **Three seeded models** · `User`, `MeterReading`, `Product` with demo data loaded on first run
- **BetterAuth** · installed as a dependency, no wiring yet (slide 27 task)
- **Vitest** · installed, no config (run `npx vitest` if you want tests)
- **Sample CSV** · `sample-data/meter-readings.csv` for the upload exercise
- **Landing page** · table of recent meter readings (`src/app/page.tsx`)
- **Shop page** · product grid at `/shop` (`src/app/shop/page.tsx`)
- **Claude Code config** · `.claude/settings.json` + git skills (`/gc`, `/gcp`, `/pr`) + `/grill-me`

## Prerequisites

Version numbers matter less than a working setup. Pick the install path for your OS.

- **Node.js >= 20**
  - macOS / Linux: nvm - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`, then `nvm install 20 && nvm use 20`.
  - Windows: nvm-windows - https://github.com/coreybutler/nvm-windows/releases, then `nvm install 20 && nvm use 20`.
  - Any OS (official installer): https://nodejs.org.
  - Verify: `node -v` prints `v20.x` or higher and `npm -v` prints `10.x` or higher.
- **git** · you already have it if you cloned this repo.
- **Claude Code CLI** · https://claude.com/claude-code.
- **Editor** · VS Code recommended, any editor works - Claude Code does the writing.

## Quick start

Identical on macOS, Linux, and Windows (PowerShell, Git Bash, or WSL):

```
cd project
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open http://localhost:3000 - you should see the seeded meter readings table.

`npm install` auto-creates `.env` from `.env.example` via a `postinstall` hook, so no manual `cp` / `copy` step.

## Project tour (60 seconds)

Where everything lives, for anyone new to Next.js:

- `src/app/page.tsx` · landing page (meter readings list)
- `src/app/shop/page.tsx` · product catalog page
- `src/app/` · any new folder here becomes a new route (e.g. `src/app/login/page.tsx` -> `/login`)
- `src/lib/prisma.ts` · database client - `import { prisma } from "@/lib/prisma"`
- `prisma/schema.prisma` · database models (User, MeterReading, Product)
- `prisma/seed.ts` · demo data script
- `prisma.config.ts` · Prisma 7 CLI config (datasource URL, seed command)
- `sample-data/meter-readings.csv` · input for the CSV upload exercise
- `CLAUDE.md` · compact session context with only repo-specific facts and sharp edges
- `.claude/settings.json` · pre-approved commands for the common workshop and git flows
- `.claude/skills/{gc,gcp,pr,grill-me}/SKILL.md` · git skills (commit, commit+push, open PR) + plan stress-test via interview (source: [mattpocock/skills](https://github.com/mattpocock/skills))
- `package.json` · scripts and dependencies

## Changing the schema

1. Edit `prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name <change>` - creates a migration, applies it, regenerates the client.
3. Re-seed if needed: `npx prisma db seed`.

`prisma db push` vs `migrate dev`: `push` is quick prototyping with no migration history; `migrate dev` tracks each change in `prisma/migrations/`. Prefer `migrate dev` so your schema history travels with the repo.

## Useful scripts

- `npm run dev` · start the dev server on http://localhost:3000
- `npm run build` · production build (also catches TypeScript-strict issues)
- `npm run start` · serve the production build
- `npm run lint` · ESLint (Next.js config)
- `npm run format` · Prettier over the whole tree
- `npm run test` · Vitest (no sample tests shipped, add your own)
- `npm run db:seed` · re-run `prisma/seed.ts`
- `npm run db:studio` · open Prisma Studio in the browser
- `npm run db:reset` · wipe the DB, re-apply migrations, re-run the seed (cross-platform)

Plus four Claude Code skills in [.claude/skills/](.claude/skills/):

- `/gc` · stage intended files only, then commit with an auto-generated Conventional Commits message
- `/gcp` · `/gc` plus push to remote
- `/pr` · open a pull request with title + body derived from the diff
- `/grill-me` · interview-style stress-test of a plan until shared understanding ([source](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md))

## Sample data

[sample-data/meter-readings.csv](sample-data/meter-readings.csv) has 21 rows spanning a week, all three meter kinds, with monotonically increasing (cumulative) values - the shape real P1 telegrams produce. Columns: `read_at`, `kind`, `value`, `unit`.

The seed script does not read this file. It is the input for the CSV-upload exercise.

## Using Claude Code for the Blok 4 tasks

Three copy-paste starter prompts. All three assume Claude Code is running inside `project/`.

**1. Auth**

```
Wire up BetterAuth email+password login. Add a /login page and protect /shop behind
a session. Use the existing User model in prisma/schema.prisma. Docs:
https://www.better-auth.com/docs
```

**2. CSV import + visualisation**

```
Build a CSV upload page at /upload that reads sample-data/meter-readings.csv,
parses the rows, and inserts MeterReading records for the demo user. Then render
the readings as a chart on the landing page.
```

**3. HomeWizard theming**

```
Apply HomeWizard branding: navy + cyan accent palette, rounded cards on /shop,
and a header with the HomeWizard name. See https://www.homewizard.com for
inspiration.
```

## Troubleshooting

- **Port 3000 already in use**
  - Change the port: macOS / Linux / Git Bash `PORT=3001 npm run dev` · PowerShell `$env:PORT=3001; npm run dev` · CMD `set PORT=3001 && npm run dev`.
  - Or find + kill the other process: macOS / Linux `lsof -i :3000` then `kill <pid>` · Windows `netstat -ano | findstr :3000` then `taskkill /PID <pid> /F`.
- **Prisma Client out of sync** · `npx prisma generate`.
- **Database in a weird state** · `npm run db:reset` (wipes, re-migrates, re-seeds; cross-platform).
- **Node version wrong** · `nvm use 20`.
- **TypeScript errors you do not understand** · paste them into Claude Code, it will explain and fix.
- **Nothing works** · delete `node_modules/` and `prisma/dev.db`, run the Quick start block again.

## Out of scope (left for you)

- BetterAuth route handlers, session cookies, middleware, login UI.
- CSV upload endpoint and chart component.
- HomeWizard theming (colours, typography, logo, product images).
- Shop extensions (detail page, cart, checkout), tariff / pricing, forecasting, weather.
- Tests, CI, Docker.

Have fun.
